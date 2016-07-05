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
} from '../actions';
import { getSpheneData } from '../helpers';
import { getCurrentPage, getCurrentPageId } from '../selectors';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number.isRequired,
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
		const onAddColumn = () => null;
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
		const onAdd = () => this.props.createRowAndBlock();
		const onClickEdit = () => this.props.editBlock( this.props.currentBlockId );
		const onClickDelete = () => this.props.deleteBlock( this.props.currentBlockId ) && this.props.doneEditing();
		const onClickSave = () => this.props.savePage( this.props.currentPageId );
		return (
			<div className="sphene-editor__page">
				<SaveButton isActive={ isSaveActive } onClick={ onClickSave } />
				{ pageRows }
				<EmptyEditor onAdd={ onAdd } />
				<BlockOptions
					isActive={ isOverlayActive }
					onEdit={ onClickEdit }
					onDelete={ onClickDelete }
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
	const isBlockEditorActive = state.ui.showingBlockEditor;
	const isUnsaved = state.isUnsaved;
	const page = getCurrentPage( state );
	const rows = page ? page.rows : [];
	return {
		isBlockEditorActive,
		currentBlockId,
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
		savePage: savePageAsync,
	}, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( SpheneEditor );
