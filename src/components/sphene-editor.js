import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import BlockOptions from './block-options';
import Overlay from './overlay';
import BlockEditor from './block-editor';
import BlockTypePicker from './block-type-picker';
import SaveButton from './save-button';
import { connect } from 'react-redux';
import {
	fetchPageAsync,
	fetchHeaderAsync,
	setCurrentPageId,
	selectBlock,
	editBlock,
	deleteBlock,
	doneEditing,
	deleteRow,
	savePageAsync,
	createAndAddBlockToRow,
	activateOverlay,
	deactivateOverlay,
	prepareNewBlock,
} from '../actions';
import { getSpheneData } from '../helpers';
import { getCurrentPage, getCurrentPageId, getCurrentRow, getPreparedOptions } from '../selectors';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number.isRequired,
		currentRowId: React.PropTypes.string,
		currentBlockId: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ),
		currentOverlay: React.PropTypes.oneOf( [ 'block-editor', 'block-options', 'block-type-picker' ] ),
		isUnsaved: React.PropTypes.bool,
		fetchPage: React.PropTypes.func.isRequired,
		selectBlock: React.PropTypes.func.isRequired,
		editBlock: React.PropTypes.func.isRequired,
		deleteBlock: React.PropTypes.func.isRequired,
		setCurrentPageId: React.PropTypes.func.isRequired,
		doneEditing: React.PropTypes.func.isRequired,
		activateOverlay: React.PropTypes.func.isRequired,
		deactivateOverlay: React.PropTypes.func.isRequired,
		savePage: React.PropTypes.func.isRequired,
		deleteRow: React.PropTypes.func.isRequired,
		createAndAddBlockToRow: React.PropTypes.func.isRequired,
		fetchHeader: React.PropTypes.func.isRequired,
	},

	componentWillMount() {
		if ( this.props.currentPageId ) {
			this.props.fetchPage( this.props.currentPageId );
		} else {
			const id = parseInt( getSpheneData().currentPageId, 10 );
			this.props.setCurrentPageId( id );
			this.props.fetchPage( id );
		}
		this.props.fetchHeader();
	},

	render() {
		const { rows } = this.props;
		const onAddColumn = () => {
			this.props.activateOverlay( 'block-type-picker' );
		};
		const onDeleteRow = rowId => this.props.deleteRow( rowId, getSpheneData().currentPageId );
		const pageRows = ! rows || rows.length < 1
			? null
			: rows.map( row => {
				return <SpheneRow
					key={ `row-${row.rowId}` }
					rowId={ row.rowId }
					columns={ row.columns }
					onAddColumn={ onAddColumn }
					onDeleteRow={ onDeleteRow }
				/>;
			} );
		const isBlockEditorActive = this.props.currentOverlay === 'block-editor';
		const isBlockOptionsActive = this.props.currentOverlay === 'block-options';
		const isSaveActive = this.props.isUnsaved;
		const isOverlayActive = this.props.currentBlockId && this.props.currentOverlay !== null;
		const onClickOverlay = () => this.props.doneEditing();
		const onAddRow = () => this.props.activateOverlay( 'block-type-picker' );
		const onEditBlock = () => this.props.editBlock( this.props.currentBlockId );
		const onDeleteBlock = () => this.props.deleteBlock( this.props.currentBlockId ) && this.props.doneEditing();
		const onClickSave = () => this.props.savePage( this.props.currentPageId );
		return (
			<div className="sphene-editor__page">
				<SaveButton isActive={ isSaveActive } onClick={ onClickSave } />
				{ pageRows }
				<EmptyEditor onAdd={ onAddRow } />
				<BlockTypePicker />
				<BlockOptions
					isActive={ isBlockOptionsActive }
					onEdit={ onEditBlock }
					onDelete={ onDeleteBlock }
					blockId={ this.props.currentBlockId }
					rowId={ this.props.currentRowId }
					activateOverlay={ this.props.activateOverlay }
					prepareNewBlock={ this.props.prepareNewBlock }
				/>
				<Overlay isActive={ isOverlayActive } onClick={ onClickOverlay } />
				<BlockEditor isActive={ isBlockEditorActive } blockId={ this.props.currentBlockId } />
			</div>
		);
	}
} );

const mapStateToProps = state => {
	const currentPageId = getCurrentPageId( state );
	const currentBlockId = state.currentBlockId;
	const currentRow = currentPageId ? getCurrentRow( state ) : null;
	const currentRowId = currentRow ? currentRow.rowId : '';
	const isUnsaved = state.isUnsaved;
	const page = getCurrentPage( state );
	const rows = page ? page.rows : [];
	return {
		currentOverlay: state.ui.currentOverlay,
		currentBlockId,
		currentRowId,
		currentPageId,
		rows,
		isUnsaved,
		preparedOptions: getPreparedOptions( state ),
	};
};

const actions = {
	fetchPage: fetchPageAsync,
	fetchHeader: fetchHeaderAsync,
	setCurrentPageId,
	selectBlock,
	editBlock,
	deleteBlock,
	doneEditing,
	deleteRow,
	createAndAddBlockToRow,
	savePage: savePageAsync,
	activateOverlay,
	deactivateOverlay,
	prepareNewBlock,
};

export default connect( mapStateToProps, actions )( SpheneEditor );
