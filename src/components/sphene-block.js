import React from 'react';
import classnames from 'classnames';

function createMarkup( markup ) {
	return { __html: markup };
}

function renderMarkup( markup ) {
	return <div dangerouslySetInnerHTML={ createMarkup( markup ) } />;
}

const SpheneBlock = React.createClass( {
	propTypes: {
		postId: React.PropTypes.number.isRequired,
		content: React.PropTypes.string,
		onClick: React.PropTypes.func.isRequired,
		isSelected: React.PropTypes.bool,
	},

	render() {
		const { content } = this.props;
		const classNames = classnames( 'sphene-editor__block', { 'is-loading': ! content, 'is-selected': this.props.isSelected } );
		return (
			<div className={ classNames } onClick={ this.props.onClick }>
			{ content ? renderMarkup( content ) : 'loading...' }
			</div>
		);
	},
} );

export default SpheneBlock;
