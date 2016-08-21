import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import ImageList from './image-list';
import {
	getCurrentOverlay,
	getPreparedOptions,
	getAllMedia,
	getCurrentBlockId,
	getCurrentBlockType,
} from '../selectors';
import {
	createAndAddBlockToRow,
	deactivateOverlay,
	clearPreparedOptions,
	activateOverlay,
	setBlockImage,
	setHeaderImage,
	fetchMediaAsync,
} from '../actions';

class BlockImagePicker extends React.Component {
	componentWillMount() {
		this.props.fetchMedia();
	}

	render() {
		const createImageBlock = ( image ) => {
			const imageProps = {
				imageUrl: image.url,
				imageId: image.id,
			};
			if ( this.props.currentBlockId && this.props.currentBlockType === 'image' ) {
				this.props.setBlockImage( this.props.currentBlockId, image.url, image.id );
			} else if ( this.props.currentBlockId && this.props.currentBlockType === 'header' ) {
				this.props.setHeaderImage( image.url );
			} else {
				this.props.createAndAddBlockToRow( Object.assign( {}, this.props.preparedOptions, imageProps ) );
			}
			this.props.clearPreparedOptions();
			this.props.deactivateOverlay();
		};
		const classNames = classnames( 'sphene-editor__block-image-picker', { 'is-active': this.props.isActive } );
		return (
			<div className={ classNames }>
				<p>Choose an image</p>
				<ImageList images={ this.props.images } onClick={ createImageBlock } />
			</div>
		);
	}
}

BlockImagePicker.propTypes = {
	isActive: PropTypes.bool,
	preparedOptions: PropTypes.object,
	images: PropTypes.array,
	currentBlockId: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
	currentBlockType: PropTypes.string,
	createAndAddBlockToRow: PropTypes.func.isRequired,
	deactivateOverlay: PropTypes.func.isRequired,
	clearPreparedOptions: PropTypes.func.isRequired,
	activateOverlay: PropTypes.func.isRequired,
	setBlockImage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ( {
	isActive: getCurrentOverlay( state ) === 'block-image-picker',
	preparedOptions: getPreparedOptions( state ),
	images: getAllMedia( state ),
	currentBlockId: getCurrentBlockId( state ),
	currentBlockType: getCurrentBlockType( state ),
} );

export default connect( mapStateToProps, {
	createAndAddBlockToRow,
	deactivateOverlay,
	clearPreparedOptions,
	activateOverlay,
	fetchMedia: fetchMediaAsync,
	setBlockImage,
	setHeaderImage,
} )( BlockImagePicker );
