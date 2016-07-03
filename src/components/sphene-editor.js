import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import { findPostById } from '../helpers';
import { connect } from 'react-redux';

const SpheneEditor = ( { rows = [] } ) => {
	const content = rows.length < 1 ? <EmptyEditor /> : rows.map( row => <SpheneRow columns={ row.columns } /> );
	return (
		<div className="sphene-editor__page">
			{ content }
		</div>
	);
};

SpheneEditor.propTypes = {
	rows: React.PropTypes.array,
};

const getCurrentPage = state => {
	const { currentPageId, pages } = state;
	return findPostById( pages, currentPageId );
};

const mapStateToProps = state => {
	const page = getCurrentPage( state );
	const rows = page.rows || [];
	return {
		rows
	};
};

export default connect( mapStateToProps )( SpheneEditor );
