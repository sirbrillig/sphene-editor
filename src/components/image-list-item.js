import React, { PropTypes } from 'react';

class ImageListItem extends React.Component {
	render() {
		return (
			<div className="sphene-editor__image-list-item">
				<img src={ this.props.image.source_url }/>
			</div>
		);
	}
}

ImageListItem.propTypes = {
	image: PropTypes.object,
};

export default ImageListItem;

