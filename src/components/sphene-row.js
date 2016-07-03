import React from 'react';
import SpheneBlock from './sphene-block';

export default function SpheneRow( { columns } ) {
	return (
		<div className="sphene-editor__row">
			{ columns.map( ( block, index ) => <SpheneBlock key={ `column-${index}` } postId={ block.postId } /> ) }
		</div>
	);
}
