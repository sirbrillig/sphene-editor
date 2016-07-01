<?php
/*
Plugin Name: Sphene Editor
Plugin URI:  https://github.com/sirbrillig/sphene-editor
Description: A page builder
Version:     0.1
Author:      Payton Swick
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

class SpheneEditor {
	protected static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new SpheneEditor();
		}
		return self::$instance;
	}

	public function add_hooks() {
		$this->create_post_types();
		if ( current_user_can( 'edit_pages' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}
		// add_action( 'template_include', array( $this, 'template_include' ) );
	}

	public function create_post_types() {
		register_post_type(
			'sphene_page',
			array(
				'labels' => array(
					'name' => __( 'Sphene Pages' ),
					'singular_name' => __( 'Sphene Page' ),
				),
				'description' => __( 'A page built using the Sphene page builder' ),
				'menu_icon' => 'dashicons-align-left',
				'public' => true,
				'has_archive' => true,
				'show_in_rest' => true,
			)
		);
		register_post_type(
			'sphene_block',
			array(
				'labels' => array(
					'name' => __( 'Sphene Page Blocks' ),
					'singular_name' => __( 'Sphene Page Block' ),
				),
				'description' => __( 'A content block built using the Sphene page builder' ),
				'menu_icon' => 'dashicons-align-right',
				'public' => true,
				'has_archive' => true,
				'show_in_rest' => true,
			)
		);
	}

	public function template_include( $template ) {
		$file = dirname( __FILE__ ) . '/theme/single-' . get_post_type() . '.php';
		if( file_exists( $file ) ) {
			return $file;
		}
		return $template;
	}

	public function rewrite_flush() {
		$this->create_post_types();
		flush_rewrite_rules();
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'sphene-editor', plugins_url( 'js/sphene-editor.js', __FILE__ ), array(), true );
		wp_localize_script( 'sphene-editor', 'spheneData', array(
			'currentPageId' => $this->getCurrentPageId(),
			'pages' => $this->getSphenePosts(),
			'blocks' => $this->getSpheneBlocks(),
		) );
		wp_enqueue_style( 'sphene-editor', plugins_url( 'css/sphene-editor.css', __FILE__ ) );
	}

	public function getCurrentPageId() {
		global $post;
		return $post->ID;
	}

	public function getSphenePosts() {
		return get_posts( array(
			'numberposts' => -1,
			'post_type' => 'sphene_page',
		) );
	}

	public function getSpheneBlocks() {
		return get_posts( array(
			'numberposts' => -1,
			'post_type' => 'sphene_block',
		) );
	}

}
add_action( 'init', array( SpheneEditor::get_instance(), 'add_hooks' ) );
add_action( 'activate_sphene-editor/sphene-editor.php', array( SpheneEditor::get_instance(), 'rewrite_flush' ) );
