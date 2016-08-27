import React from 'react';
import { connect } from 'react-redux';
import { getBlock } from '../selectors';
import { fetchBlockAsync, selectBlock, activateOverlay } from '../actions';
import SpheneBlock from './sphene-block';
import { renderBlockToString } from '../content-renderer';

const mapStateToProps = ( state, props ) => {
	const block = getBlock( props.postId, state );
	if ( ! block ) {
		return {};
	}
	return {
		content: renderBlockToString( block, state ),
		isSelected: state.currentBlockId === props.postId,
		isUnsaved: block.unsaved,
		blockType: block.blockType,
	};
};

const SpheneBlockData = React.createClass( {
	propTypes: {
		postId: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ).isRequired,
		fetchBlock: React.PropTypes.func.isRequired,
		selectBlock: React.PropTypes.func.isRequired,
		content: React.PropTypes.string,
		isSelected: React.PropTypes.bool,
		isUnsaved: React.PropTypes.bool,
		blockType: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			content: null,
		};
	},

	componentWillMount() {
		if ( this.props.content === null && ! this.props.isUnsaved ) {
			this.props.fetchBlock( this.props.postId );
		}
	},

	onClick() {
		this.props.selectBlock( this.props.postId );
		this.props.activateOverlay( 'block-options' );
	},

	render() {
		return <SpheneBlock
			postId={ this.props.postId }
			content={ this.props.content }
			onClick={ this.onClick }
			isSelected={ this.props.isSelected }
			blockType={ this.props.blockType }
		/>;
	},
} );
export default connect( mapStateToProps, {
	fetchBlock: fetchBlockAsync,
	selectBlock,
	activateOverlay,
} )( SpheneBlockData );
