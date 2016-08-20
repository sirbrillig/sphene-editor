import React, { PropTypes } from 'react';

class ImageListItem extends React.Component {
	render() {
		const onClick = () => this.props.onClick( this.props.image );
		return (
			<div className="sphene-editor__image-list-item" onClick={ onClick }>
				<img src={ this.props.image.thumbnailUrl }/>
			</div>
		);
	}
}

ImageListItem.propTypes = {
	image: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default ImageListItem;

