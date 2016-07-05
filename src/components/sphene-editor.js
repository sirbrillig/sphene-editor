import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import BlockOptions from './block-options';
import Overlay from './overlay';
import BlockEditor from './block-editor';
import SaveButton from './save-button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	fetchPageAsync,
	setCurrentPageId,
	selectBlock,
	editBlock,
	deleteBlock,
	doneEditing,
	deleteRow,
	createRowAndBlock,
	savePageAsync,
	createAndAddBlockToRow,
} from '../actions';
import { getSpheneData } from '../helpers';
import { getCurrentPage, getCurrentPageId, getCurrentRow } from '../selectors';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number.isRequired,
		currentRowId: React.PropTypes.string,
		currentBlockId: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ),
		isBlockEditorActive: React.PropTypes.bool,
		isUnsaved: React.PropTypes.bool,
		fetchPage: React.PropTypes.func.isRequired,
		selectBlock: React.PropTypes.func.isRequired,
		editBlock: React.PropTypes.func.isRequired,
		deleteBlock: React.PropTypes.func.isRequired,
		setCurrentPageId: React.PropTypes.func.isRequired,
		doneEditing: React.PropTypes.func.isRequired,
		createRowAndBlock: React.PropTypes.func.isRequired,
		savePage: React.PropTypes.func.isRequired,
		deleteRow: React.PropTypes.func.isRequired,
		createAndAddBlockToRow: React.PropTypes.func.isRequired,
	},

	componentWillMount() {
		if ( this.props.currentPageId ) {
			this.props.fetchPage( this.props.currentPageId );
		} else {
			const id = parseInt( getSpheneData().currentPageId, 10 );
			this.props.setCurrentPageId( id );
			this.props.fetchPage( id );
		}
	},

	render() {
		const { rows } = this.props;
		const onAddColumn = rowId => this.props.createAndAddBlockToRow( rowId );
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
		const isBlockEditorActive = this.props.isBlockEditorActive;
		const isSaveActive = this.props.isUnsaved;
		const isOverlayActive = !! this.props.currentBlockId;
		const onClickOverlay = () => this.props.doneEditing();
		const onAddRow = () => this.props.createRowAndBlock();
		const onEditBlock = () => this.props.editBlock( this.props.currentBlockId );
		const onDeleteBlock = () => this.props.deleteBlock( this.props.currentBlockId ) && this.props.doneEditing();
		const onClickSave = () => this.props.savePage( this.props.currentPageId );
		const onAddColumnAfterBlock = () => onAddColumn( this.props.currentRowId );
		return (
			<div className="sphene-editor__page">
				<SaveButton isActive={ isSaveActive } onClick={ onClickSave } />
				{ pageRows }
				<EmptyEditor onAdd={ onAddRow } />
				<BlockOptions
					isActive={ isOverlayActive }
					onEdit={ onEditBlock }
					onDelete={ onDeleteBlock }
					onAdd={ onAddColumnAfterBlock }
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
	const isBlockEditorActive = state.ui.showingBlockEditor;
	const isUnsaved = state.isUnsaved;
	const page = getCurrentPage( state );
	const rows = page ? page.rows : [];
	return {
		isBlockEditorActive,
		currentBlockId,
		currentRowId,
		currentPageId,
		rows,
		isUnsaved,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( {
		fetchPage: fetchPageAsync,
		setCurrentPageId,
		selectBlock,
		editBlock,
		deleteBlock,
		doneEditing,
		createRowAndBlock,
		deleteRow,
		createAndAddBlockToRow,
		savePage: savePageAsync,
	}, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( SpheneEditor );
