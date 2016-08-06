import React from 'react';
import classnames from 'classnames';

const BlockTypePicker = ( { isActive, createRowAndBlock, deactivateOverlay } ) => {
	const classNames = classnames( 'sphene-editor__block-type-picker', { 'is-active': isActive } );
	const chooseText = () => {
		createRowAndBlock();
		deactivateOverlay();
	};
	return (
		<div className={ classNames }>
			<p>Choose a block type</p>
			<div className="sphene-editor__block-type-picker__buttons">
				<button onClick={ chooseText }>Text</button>
			</div>
		</div>
	);
};

BlockTypePicker.propTypes = {
	isActive: React.PropTypes.bool,
	createRowAndBlock: React.PropTypes.func.isRequired,
	deactivateOverlay: React.PropTypes.func.isRequired,
};

export default BlockTypePicker;

