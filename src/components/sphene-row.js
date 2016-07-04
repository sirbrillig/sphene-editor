import React from 'react';
import SpheneBlockData from './sphene-block-data';
import EmptyRow from './empty-row';

const SpheneRow = React.createClass( {
	propTypes: {
		columns: React.PropTypes.array.isRequired,
		onAddColumn: React.PropTypes.func.isRequired,
		onDeleteRow: React.PropTypes.func.isRequired,
	},

	render() {
		const { columns } = this.props;
		const allColumns = columns.map( block => <SpheneBlockData key={ `block-${block.postId}` } postId={ block.postId } /> );
		return (
			<div className="sphene-editor__row">
				{ columns.length > 0 ? allColumns : <EmptyRow onAdd={ this.props.onAddColumn } onDelete={ this.props.onDeleteRow } /> }
			</div>
		);
	}
} );

export default SpheneRow;
