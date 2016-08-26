<?php

namespace SpheneEditor;

class SiteTitleController extends \WP_REST_Controller {
	public function register_routes() {
		$namespace = 'sphene-editor/v1';
		\register_rest_route( $namespace, '/settings/site-title', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_site_title' ),
		) );
		\register_rest_route( $namespace, '/settings/site-title', array(
			'methods' => 'POST',
			'callback' => array( $this, 'set_site_title' ),
		) );
	}

	public function get_site_title() {
		return \get_bloginfo( 'name' );
	}

	public function set_site_title( $request ) {
		$title = $request[ 'site-title' ];
		\update_option( 'blogname', $title );
		return $this->get_site_title();
	}
}

