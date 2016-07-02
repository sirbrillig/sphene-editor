import React from 'react';
import SpheneBlock from './sphene-block';

export default ( { columns } ) => {
	return (
		<div className="sphene-editor__row">
			{ columns.map( block => <SpheneBlock postId={ block.postId } /> ) }
		</div>
	);
};
