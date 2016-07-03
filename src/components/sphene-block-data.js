import React from 'react';
import { connect, bindActionCreators } from 'react-redux';
import { getBlock } from '../selectors';
import { fetchBlockAsync } from '../actions';
import SpheneBlock from './sphene-block';

const mapStateToProps = ( state, props ) => {
	const block = getBlock( props.postId, state );
	if ( ! block ) {
		return {};
	}
	const content = block.content.raw;
	return { content };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( { fetchBlock: fetchBlockAsync }, dispatch );
};

const SpheneBlockData = React.createClass( {
	propTypes: {
		postId: React.PropTypes.number.isRequired,
		fetchBlock: React.PropTypes.func.isRequired,
		content: React.PropTypes.string,
	},

	componentWillMount() {
		if ( ! this.props.content ) {
			this.props.fetchBlock( this.props.postId );
		}
	},

	render() {
		return <SpheneBlock postId={ this.props.postId } content={ this.props.content } />;
	},
} );
// FIXME: connect doesn't work for some reason. Maybe we need to do this differently?
export default connect( mapStateToProps, mapDispatchToProps )( SpheneBlockData );
