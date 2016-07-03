import React from 'react';
import classnames from 'classnames';

const SpheneBlock = React.createClass( {
	propTypes: {
		postId: React.PropTypes.number.isRequired,
		content: React.PropTypes.string,
	},

	render() {
		const { postId, content } = this.props;
		const classNames = classnames( 'sphene-editor__block', { 'is-loading': ! content } );
		return (
			<div className={ classNames }>
			{ content ? content : postId }
			</div>
		);
	},
} );

export default SpheneBlock;
