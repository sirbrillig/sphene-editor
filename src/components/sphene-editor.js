import React from 'react';
import SpheneRow from './sphene-row';
import EmptyEditor from './empty-editor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPageAsync, setCurrentPageId } from '../actions';
import { getSpheneData } from '../helpers';
import { getCurrentPage, getCurrentPageId } from '../selectors';

const SpheneEditor = React.createClass( {
	propTypes: {
		rows: React.PropTypes.array,
		currentPageId: React.PropTypes.number.isRequired,
		fetchPage: React.PropTypes.func.isRequired,
	},

	componentWillMount() {
		if ( this.props.currentPageId ) {
			this.props.fetchPage( this.props.currentPageId );
		} else {
			const id = parseInt( getSpheneData().currentPageId, 10 );
			this.props.setCurrentPageId( id );
			this.props.fetchPage( id );
		}
	},

	render() {
		const { rows } = this.props;
		const content = ! rows || rows.length < 1
			? null
			: rows.map( ( row, index ) => <SpheneRow key={ `row-${index}` } columns={ row.columns } /> );
		return (
			<div className="sphene-editor__page">
			{ content }
			<EmptyEditor />
			</div>
		);
	}
} );

const mapStateToProps = state => {
	const currentPageId = getCurrentPageId( state );
	const page = getCurrentPage( state );
	const rows = page ? page.sphene_data_parsed.rows : [];
	return {
		currentPageId,
		rows,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( { fetchPage: fetchPageAsync, setCurrentPageId }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( SpheneEditor );
