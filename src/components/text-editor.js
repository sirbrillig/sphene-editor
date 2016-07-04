import React from 'react';
import { connect } from 'react-redux';
import { getBlock } from '../selectors';

const TextEditor = React.createClass( {
	propTypes: {
		blockId: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ).isRequired,
		blockText: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
	},

	render() {
		return (
			<textarea value={ this.props.blockText } onChange={ this.props.onChange } />
		);
	}
} );

const mapStateToProps = ( state, props ) => {
	const block = getBlock( props.blockId, state );
	if ( ! block ) {
		console.error( `Sphene Editor Error: could not find block ID ${props.blockId}` );
		return {};
	}
	const blockText = block.content;
	return { blockText };
};

export default connect( mapStateToProps )( TextEditor );
