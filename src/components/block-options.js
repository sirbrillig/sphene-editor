import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
	deleteBlock,
	doneEditing,
	activateOverlay,
	prepareNewBlock,
	editBlock,
} from '../actions';
import { getCurrentOverlay, getCurrentRowId, getCurrentBlockId, getCurrentBlockType, } from '../selectors';

const BlockOptions = ( props ) => {
	const addColumnBeforeBlock = () => {
		props.prepareNewBlock( { rowId: props.rowId, beforeBlockId: props.blockId } );
		props.activateOverlay( 'block-type-picker' );
	};
	const addColumnAfterBlock = () => {
		props.prepareNewBlock( { rowId: props.rowId, afterBlockId: props.blockId } );
		props.activateOverlay( 'block-type-picker' );
	};
	const addRowBefore = () => {
		props.prepareNewBlock( { beforeRowId: props.rowId } );
		props.activateOverlay( 'block-type-picker' );
	};
	const addRowAfter = () => {
		props.prepareNewBlock( { afterRowId: props.rowId } );
		props.activateOverlay( 'block-type-picker' );
	};
	const onEditBlock = () => {
		if ( props.blockType === 'image' ) {
			return props.activateOverlay( 'block-image-picker' );
		}
		if ( props.blockType === 'header' ) {
			return props.activateOverlay( 'header-options' );
		}
		props.editBlock( props.blockId );
	};
	const onDeleteBlock = () => props.deleteBlock( props.blockId ) && props.doneEditing();
	const classNames = classnames( 'sphene-editor__block-options', { 'is-active': props.isActive } );
	return (
		<div className={ classNames }>
			<button className="sphene-editor__block-options__delete" onClick={ onDeleteBlock }>Delete</button>
			<button className="sphene-editor__block-options__edit" onClick={ onEditBlock }>Edit</button>
			<button className="sphene-editor__block-options__add-col-before" onClick={ addColumnBeforeBlock }>Add Column Before</button>
			<button className="sphene-editor__block-options__add-col-after" onClick={ addColumnAfterBlock }>Add Column After</button>
			<button className="sphene-editor__block-options__add-row-before" onClick={ addRowBefore }>Add Row Before</button>
			<button className="sphene-editor__block-options__add-row-after" onClick={ addRowAfter }>Add Row After</button>
		</div>
	);
};

BlockOptions.propTypes = {
	deleteBlock: PropTypes.func.isRequired,
	doneEditing: PropTypes.func.isRequired,
	activateOverlay: PropTypes.func.isRequired,
	prepareNewBlock: PropTypes.func.isRequired,
	editBlock: React.PropTypes.func.isRequired,
	isActive: PropTypes.bool,
	rowId: PropTypes.string,
	blockId: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	blockType: PropTypes.string,
};

const mapStateToProps = state => ( {
	isActive: getCurrentOverlay( state ) === 'block-options',
	rowId: getCurrentRowId( state ),
	blockId: getCurrentBlockId( state ),
	blockType: getCurrentBlockType( state ),
} );

export default connect( mapStateToProps, {
	deleteBlock,
	doneEditing,
	activateOverlay,
	prepareNewBlock,
	editBlock,
} )( BlockOptions );
