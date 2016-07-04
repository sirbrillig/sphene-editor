import React from 'react';

const EmptyEditor = ( { onAdd } ) => {
	return (
		<div className="sphene-editor__row is-empty">
			<div className="sphene-editor__block is-empty">
				<button onClick={ onAdd }>Add</button>
			</div>
		</div>
	);
};

EmptyEditor.propTypes = {
	onAdd: React.PropTypes.func.isRequired,
};

export default EmptyEditor;
