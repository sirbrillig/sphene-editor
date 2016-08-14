import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { getCurrentOverlay, getPreparedOptions, getCurrentRow } from '../selectors';
import { createAndAddBlockToRow, deactivateOverlay, clearPreparedOptions } from '../actions';

const BlockTypePicker = function( props ) {
	const classNames = classnames( 'sphene-editor__block-type-picker', { 'is-active': props.isActive } );
	const chooseText = () => {
		props.createAndAddBlockToRow( Object.assign( {}, props.preparedOptions, { blockType: 'text' } ) );
		props.deactivateOverlay();
		props.clearPreparedOptions();
	};
	const chooseHeader = () => {
		props.createAndAddBlockToRow( Object.assign( {}, props.preparedOptions, { blockType: 'header' } ) );
		props.deactivateOverlay();
		props.clearPreparedOptions();
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
	isActive: PropTypes.bool,
	rowId: PropTypes.string,
	preparedOptions: PropTypes.object,
	createAndAddBlockToRow: PropTypes.func.isRequired,
	deactivateOverlay: PropTypes.func.isRequired,
	clearPreparedOptions: PropTypes.func.isRequired,
};

function mapStateToProps( state ) {
	const currentRow = getCurrentRow( state );
	const rowId = currentRow ? currentRow.rowId : '';
	return {
		isActive: getCurrentOverlay( state ) === 'block-type-picker',
		preparedOptions: getPreparedOptions( state ),
		rowId,
	};
}

export default connect( mapStateToProps, {
	createAndAddBlockToRow,
	deactivateOverlay,
	clearPreparedOptions,
} )( BlockTypePicker );

