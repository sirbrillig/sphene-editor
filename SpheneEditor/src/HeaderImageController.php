<?php

namespace SpheneEditor;

class HeaderImageController extends \WP_REST_Controller {
	public function register_routes() {
		$namespace = 'sphene-editor/v1';
		\register_rest_route( $namespace, '/settings/header', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_header_data' ),
		) );
	}

	public function get_header_data() {
		$header_data = array(
			'url' => \get_header_image(),
			'width' => \get_theme_support( 'custom-header', 'width' ),
			'height' => \get_theme_support( 'custom-header', 'height' ),
			'text_color' => \get_header_textcolor(),
			'defaults' => $this->get_default_header(),
		);
		if ( \is_random_header_image( 'default' ) ) {
			$header_data[ 'random_default' ] = true;
		}
		if ( \is_random_header_image( 'uploaded' ) ) {
			$header_data[ 'random_uploaded' ] = true;
		}
		return $header_data;
	}

	private function get_default_header() {
		return array(
			'url' => $this->get_default_header_url(),
			'header_text' => \current_theme_supports( 'custom-header', 'header-text' ),
			'text_color' => \get_theme_support( 'custom-header', 'default-text-color' ),
			'random_default' => \current_theme_supports( 'custom-header', 'random-default' ),
		);
	}

	private function get_default_header_url() {
		$default_header = \get_theme_support( 'custom-header', 'default-image' );
		return sprintf( $default_header, \get_template_directory_uri(), \get_stylesheet_directory_uri() );
	}
}
