import React, { PropTypes } from 'react';
import RichTextEditor from 'react-rte-browserify';
import { connect } from 'react-redux';
import { getBlock } from '../selectors';

class BlockTextEditor extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { value: RichTextEditor.createValueFromString( props.blockText, 'html' ) };
		this.onChange = value => {
			this.setState( { value } );
			props.onChange( value.toString( 'html' ) );
		};
	}

	render() {
		return (
			<div className="block-text-editor">
				<RichTextEditor value={ this.state.value } onChange={ this.onChange } />
			</div>
		);
	}
}

BlockTextEditor.propTypes = {
	blockId: PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ).isRequired,
	blockText: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

function mapStateToProps( state, props ) {
	const block = getBlock( props.blockId, state );
	if ( ! block ) {
		console.error( `Sphene Editor Error: could not find block ID ${props.blockId}` );
		return {};
	}
	const blockText = block.content;
	return { blockText };
}

export default connect( mapStateToProps )( BlockTextEditor );
