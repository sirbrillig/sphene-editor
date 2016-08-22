import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import BlockOptions from './block-options';
import HeaderOptions from './header-options';
import Overlay from './overlay';
import BlockEditor from './block-editor';
import BlockTypePicker from './block-type-picker';
import BlockImagePicker from './block-image-picker';
import SaveButton from './save-button';
import { connect } from 'react-redux';
import {
	fetchPageAsync,
	fetchHeaderAsync,
	setCurrentPageId,
	doneEditing,
	deleteRow,
	savePageAsync,
	activateOverlay,
} from '../actions';
import { getSpheneData } from '../helpers';
import { getCurrentPage, getCurrentPageId, getPreparedOptions } from '../selectors';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number.isRequired,
		currentBlockId: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ),
		currentOverlay: React.PropTypes.string,
		isUnsaved: React.PropTypes.bool,
		fetchPage: React.PropTypes.func.isRequired,
		setCurrentPageId: React.PropTypes.func.isRequired,
		doneEditing: React.PropTypes.func.isRequired,
		activateOverlay: React.PropTypes.func.isRequired,
		savePage: React.PropTypes.func.isRequired,
		deleteRow: React.PropTypes.func.isRequired,
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
		const onAddBlock = () => this.props.activateOverlay( 'block-type-picker' );
		const onDeleteRow = rowId => this.props.deleteRow( rowId, getSpheneData().currentPageId );
		const pageRows = ! rows || rows.length < 1
			? null
			: rows.map( row => {
				return <SpheneRow
					key={ `row-${row.rowId}` }
					rowId={ row.rowId }
					columns={ row.columns }
					onAddColumn={ onAddBlock }
					onDeleteRow={ onDeleteRow }
				/>;
			} );
		const isOverlayActive = this.props.currentOverlay !== null;
		const onClickOverlay = () => this.props.doneEditing();
		const onClickSave = () => this.props.savePage( this.props.currentPageId );
		return (
			<div className="sphene-editor__page">
				<SaveButton isActive={ this.props.isUnsaved } onClick={ onClickSave } />
				{ pageRows }
				<EmptyEditor onAdd={ onAddBlock } />
				<BlockTypePicker />
				<BlockImagePicker />
				<BlockOptions />
				<HeaderOptions />
				<Overlay isActive={ isOverlayActive } onClick={ onClickOverlay } />
				<BlockEditor isActive={ this.props.currentOverlay === 'block-editor' } blockId={ this.props.currentBlockId } />
			</div>
		);
	}
} );

const mapStateToProps = state => {
	const currentPageId = getCurrentPageId( state );
	const currentBlockId = state.currentBlockId;
	const isUnsaved = state.isUnsaved;
	const page = getCurrentPage( state );
	const rows = page ? page.rows : [];
	return {
		currentOverlay: state.ui.currentOverlay,
		currentBlockId,
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
	doneEditing,
	deleteRow,
	savePage: savePageAsync,
	activateOverlay,
};

export default connect( mapStateToProps, actions )( SpheneEditor );
