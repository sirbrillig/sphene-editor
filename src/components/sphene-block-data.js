import React from 'react';
import { connect } from 'react-redux';
import { getBlock } from '../selectors';
import { fetchBlockAsync, selectBlock, activateOverlay, updateBlockHeaders } from '../actions';
import SpheneBlock from './sphene-block';

const mapStateToProps = ( state, props ) => {
	const block = getBlock( props.postId, state );
	if ( ! block ) {
		return {};
	}
	return {
		content: block.content,
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
		updateBlockHeaders: React.PropTypes.func.isRequired,
	},

	getDefaultProps() {
		return {
			content: null,
		};
	},

	componentWillMount() {
		if ( this.props.content === null && ! this.props.isUnsaved ) {
			this.props.fetchBlock( this.props.postId );
		} else if ( this.props.blockType === 'header' ) {
			this.props.updateBlockHeaders();
		}
	},

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.content !== this.props.content && nextProps.blockType === 'header' ) {
			this.props.updateBlockHeaders();
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
		/>;
	},
} );
export default connect( mapStateToProps, {
	fetchBlock: fetchBlockAsync,
	selectBlock,
	activateOverlay,
	updateBlockHeaders,
} )( SpheneBlockData );
