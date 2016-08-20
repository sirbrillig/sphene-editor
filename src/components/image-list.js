import React, { PropTypes } from 'react';
import ImageListItem from './image-list-item';

class ImageList extends React.Component {
	render() {
		return (
			<div className="sphene-editor__image-list">
				{ this.props.images.map( image => <ImageListItem image={ image } key={ image.id } /> ) }
			</div>
		);
	}
}

ImageList.propTypes = {
	images: PropTypes.array,
};

export default ImageList;
