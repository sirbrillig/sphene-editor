import React from 'react';
import classnames from 'classnames';

const BlockTypePicker = ( { isActive, createRowAndBlock, deactivateOverlay, rowId, createAndAddBlockToRow } ) => {
	const classNames = classnames( 'sphene-editor__block-type-picker', { 'is-active': isActive } );
	const chooseText = () => {
		rowId ? createAndAddBlockToRow( { rowId } ) : createRowAndBlock();
		deactivateOverlay();
	};
	const chooseHeader = () => {
		rowId ? createAndAddBlockToRow( { rowId, blockType: 'header' } ) : createRowAndBlock( { blockType: 'header' } );
		deactivateOverlay();
	};
	return (
		<div className={ classNames }>
			<p>Choose a block type</p>
			<div className="sphene-editor__block-type-picker__buttons">
				<button onClick={ chooseText }>Text</button>
				<button onClick={ chooseHeader }>Header</button>
			</div>
		</div>
	);
};

BlockTypePicker.propTypes = {
	isActive: React.PropTypes.bool,
	createRowAndBlock: React.PropTypes.func.isRequired,
	createAndAddBlockToRow: React.PropTypes.func.isRequired,
	deactivateOverlay: React.PropTypes.func.isRequired,
	rowId: React.PropTypes.string,
};

export default BlockTypePicker;

