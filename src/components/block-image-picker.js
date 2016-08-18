import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { getCurrentOverlay, getPreparedOptions, getCurrentRowId } from '../selectors';
import { createAndAddBlockToRow, deactivateOverlay, clearPreparedOptions, prepareNewBlock, activateOverlay } from '../actions';

class BlockImagePicker extends React.Component {
	render() {
		const classNames = classnames( 'sphene-editor__block-image-picker', { 'is-active': this.props.isActive } );
		return (
			<div className={ classNames }>
				<p>Choose an image</p>
			</div>
		);
	}
}

BlockImagePicker.propTypes = {
	isActive: PropTypes.bool,
	rowId: PropTypes.string,
	preparedOptions: PropTypes.object,
	createAndAddBlockToRow: PropTypes.func.isRequired,
	deactivateOverlay: PropTypes.func.isRequired,
	clearPreparedOptions: PropTypes.func.isRequired,
	prepareNewBlock: PropTypes.func.isRequired,
	activateOverlay: PropTypes.func.isRequired,
};

const mapStateToProps = state => ( {
	isActive: getCurrentOverlay( state ) === 'block-image-picker',
	preparedOptions: getPreparedOptions( state ),
	rowId: getCurrentRowId( state ) || '',
} );

export default connect( mapStateToProps, {
	createAndAddBlockToRow,
	deactivateOverlay,
	clearPreparedOptions,
	prepareNewBlock,
	activateOverlay,
} )( BlockImagePicker );
