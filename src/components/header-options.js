import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
	activateOverlay,
	setSiteTitle,
} from '../actions';
import { getCurrentOverlay, getSiteTitle } from '../selectors';

const HeaderOptions = ( props ) => {
	const editHeaderImage = () => {
		return props.activateOverlay( 'block-image-picker' );
	};
	const onChange = evt => props.setSiteTitle( evt.target.value );
	const classNames = classnames( 'sphene-editor__header-options', { 'is-active': props.isActive } );
	return (
		<div className={ classNames }>
			<p>Header</p>
			<input type="text" placeholder="Site title" value={ props.siteTitle } onChange={ onChange } />
			<button onClick={ editHeaderImage }>Edit Header Image</button>
		</div>
	);
};

HeaderOptions.propTypes = {
	activateOverlay: PropTypes.func.isRequired,
	setSiteTitle: React.PropTypes.func.isRequired,
	isActive: PropTypes.bool,
	siteTitle: PropTypes.string,
};

const mapStateToProps = state => ( {
	isActive: getCurrentOverlay( state ) === 'header-options',
	siteTitle: getSiteTitle( state ),
} );

export default connect( mapStateToProps, {
	activateOverlay,
	setSiteTitle,
} )( HeaderOptions );

