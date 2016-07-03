import React from 'react';
import SpheneBlockData from './sphene-block-data';

const SpheneRow = React.createClass( {
	propTypes: {
		columns: React.PropTypes.array.isRequired,
	},

	render() {
		const { columns } = this.props;
		return (
			<div className="sphene-editor__row">
			{ columns.map( ( block ) => <SpheneBlockData key={ `block-${block.postId}` } postId={ block.postId } /> ) }
			</div>
		);
	}
} );

export default SpheneRow;
