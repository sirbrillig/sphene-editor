import React from 'react';

const EmptyRow = ( { onAdd, onDelete } ) => {
	return (
		<div className="sphene-editor__row is-empty">
			<div className="sphene-editor__block is-empty">
				<button onClick={ onAdd }>Add Column</button>
				<button onClick={ onDelete }>Delete Row</button>
			</div>
		</div>
	);
};

EmptyRow.propTypes = {
	onAdd: React.PropTypes.func.isRequired,
	onDelete: React.PropTypes.func.isRequired,
};

export default EmptyRow;

