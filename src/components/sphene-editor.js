import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import BlockOptions from './block-options';
import Overlay from './overlay';
import BlockEditor from './block-editor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPageAsync, setCurrentPageId, selectBlock, editBlock } from '../actions';
import { getSpheneData } from '../helpers';
import { getCurrentPage, getCurrentPageId } from '../selectors';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number.isRequired,
		currentBlockId: React.PropTypes.number,
		fetchPage: React.PropTypes.func.isRequired,
		selectBlock: React.PropTypes.func.isRequired,
		isBlockEditorActive: React.PropTypes.bool,
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

	onClickOverlay() {
		if ( this.props.currentBlockId ) {
			this.props.selectBlock( 0 );
		}
	},

	onClickEdit() {
		this.props.editBlock( this.props.currentBlockId );
	},

	render() {
		const { rows } = this.props;
		const content = ! rows || rows.length < 1
			? null
			: rows.map( ( row, index ) => <SpheneRow key={ `row-${index}` } columns={ row.columns } /> );
		const isBlockEditorActive = this.props.isBlockEditorActive;
		const isOverlayActive = !! this.props.currentBlockId && ! isBlockEditorActive;
		return (
			<div className="sphene-editor__page">
				{ content }
				<EmptyEditor />
				<BlockOptions
					isActive={ isOverlayActive }
					onEdit={ this.onClickEdit }
				/>
				<Overlay isActive={ isOverlayActive } onClick={ this.onClickOverlay } />
				<BlockEditor isActive={ isBlockEditorActive } blockId={ this.props.currentBlockId } />
			</div>
		);
	}
} );

const mapStateToProps = state => {
	const currentPageId = getCurrentPageId( state );
	const currentBlockId = state.currentBlockId;
	const isBlockEditorActive = state.ui.showingBlockEditor;
	const page = getCurrentPage( state );
	const rows = page ? page.sphene_data_parsed.rows : [];
	return {
		isBlockEditorActive,
		currentBlockId,
		currentPageId,
		rows,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( {
		fetchPage: fetchPageAsync,
		setCurrentPageId,
		selectBlock,
		editBlock
	}, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( SpheneEditor );
