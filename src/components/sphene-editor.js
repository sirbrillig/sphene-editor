import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';

export default ( { rows = [] } ) => {
	const content = rows.length < 1 ? <EmptyEditor /> : rows.map( row => <SpheneRow columns={ row.columns } /> );
	return (
		<div className="sphene-editor__page">
			{ content }
		</div>
	);
};
