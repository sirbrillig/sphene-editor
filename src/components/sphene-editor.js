import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPage } from '../actions';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number,
		fetchPage: React.PropTypes.func.isRequired,
	},

	componentWillMount() {
		if ( this.props.currentPageId ) {
			this.props.fetchPage( this.props.currentPageId );
		}
	},

	render() {
		const { rows } = this.props;
		const content = rows.length < 1 ? <EmptyEditor /> : rows.map( row => <SpheneRow columns={ row.columns } /> );
		return (
			<div className="sphene-editor__page">
			{ content }
			</div>
		);
	}
} );

const getCurrentPageId = state => state.currentPageId;

const getCurrentPage = state => {
	const { currentPageId, pages } = state;
	return pages[ currentPageId ];
};

const mapStateToProps = state => {
	const currentPageId = getCurrentPageId( state );
	const page = getCurrentPage( state );
	const rows = page ? page.rows : [];
	return {
		currentPageId,
		rows,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( { fetchPage }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( SpheneEditor );
