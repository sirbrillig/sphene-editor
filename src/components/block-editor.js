import React from 'react';
import classnames from 'classnames';
import TextEditor from './text-editor';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setBlockContent, doneEditing } from '../actions';

const BlockEditor = React.createClass( {
	propTypes: {
		isActive: React.PropTypes.bool,
		blockId: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.number ] ),
		setBlockContent: React.PropTypes.func.isRequired,
		doneEditing: React.PropTypes.func.isRequired,
	},

	render() {
		const { isActive, blockId } = this.props;
		const onDone = () => this.props.doneEditing();
		const onChange = evt => this.props.setBlockContent( blockId, evt.target.value );
		const classNames = classnames( 'sphene-editor__block-editor', { 'is-active': isActive } );
		const content = isActive ? <TextEditor blockId={ blockId } onChange={ onChange } /> : null;
		const actions = isActive ? <button onClick={ onDone }>Done</button> : null;
		return (
			<div className={ classNames }>
				{ content }
				{ actions }
			</div>
		);
	}
} );

const mapDispatchToProps = dispatch => {
	return bindActionCreators( { setBlockContent, doneEditing }, dispatch );
};

export default connect( () => ( {} ), mapDispatchToProps )( BlockEditor );
