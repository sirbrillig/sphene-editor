import React from 'react';
import SpheneBlockData from './sphene-block-data';
import EmptyRow from './empty-row';

const SpheneRow = React.createClass( {
	propTypes: {
		rowId: React.PropTypes.string.isRequired,
		columns: React.PropTypes.array.isRequired,
		onAddColumn: React.PropTypes.func.isRequired,
		onDeleteRow: React.PropTypes.func.isRequired,
	},

	render() {
		const { columns, rowId } = this.props;
		const onDelete = () => this.props.onDeleteRow( rowId );
		const onAddColumn = () => this.props.onAddColumn( rowId );
		const allColumns = columns.map( block => <SpheneBlockData key={ `block-${block.postId}` } postId={ block.postId } /> );
		return (
			<div className="sphene-editor__row">
				{ columns.length > 0 ? allColumns : <EmptyRow onAdd={ onAddColumn } onDelete={ onDelete } /> }
			</div>
		);
	}
} );

export default SpheneRow;
