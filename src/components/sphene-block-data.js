import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBlock } from '../selectors';
import { fetchBlockAsync, selectBlock } from '../actions';
import SpheneBlock from './sphene-block';

const mapStateToProps = ( state, props ) => {
	const block = getBlock( props.postId, state );
	if ( ! block ) {
		return {};
	}
	const content = block.content.rendered;
	const isSelected = state.currentBlockId === props.postId;
	return { content, isSelected };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( { fetchBlock: fetchBlockAsync, selectBlock }, dispatch );
};

const SpheneBlockData = React.createClass( {
	propTypes: {
		postId: React.PropTypes.number.isRequired,
		fetchBlock: React.PropTypes.func.isRequired,
		selectBlock: React.PropTypes.func.isRequired,
		content: React.PropTypes.string,
		isSelected: React.PropTypes.bool,
	},

	componentWillMount() {
		if ( ! this.props.content ) {
			this.props.fetchBlock( this.props.postId );
		}
	},

	onClick() {
		this.props.selectBlock( this.props.postId );
	},

	render() {
		return <SpheneBlock
		postId={ this.props.postId }
		content={ this.props.content }
		onClick={ this.onClick }
		isSelected={ this.props.isSelected }
		/>;
	},
} );
export default connect( mapStateToProps, mapDispatchToProps )( SpheneBlockData );
