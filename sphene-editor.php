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

	public function __construct( $options = array() ) {
		require_once( plugin_dir_path( __FILE__  ) . 'SpheneEditor/src/HeaderImageController.php' );
		$this->header_image_controller = isset( $options['header_image_controller'] ) ? $options['header_image_controller'] : new SpheneEditor\HeaderImageController();
	}

	public function add_hooks() {
		$this->create_post_types();
		if ( current_user_can( 'edit_pages' ) ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'template_include', array( $this, 'template_include' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	public function rest_api_init() {
		register_rest_field( 'sphene_page', 'sphene_data', array(
			'get_callback' => array( $this, 'get_post_content_filtered' ),
			'update_callback' => array( $this, 'set_post_content_filtered' ),
		) );
		register_rest_field( 'sphene_block', 'blockType', array(
			'get_callback' => array( $this, 'get_block_type' ),
			'update_callback' => array( $this, 'set_block_type' ),
		) );
		register_rest_field( 'sphene_block', 'imageUrl', array(
			'get_callback' => array( $this, 'get_block_image_url' ),
			'update_callback' => array( $this, 'set_block_image_url' ),
		) );
		$this->header_image_controller->register_routes();
	}

	public function set_block_image_url( $value, $object ) {
		if ( ! $value || ! is_string( $value ) ) {
			return;
		}
		$block_type = $this->get_block_type_from_id( $object->ID );
		if ( $block_type === 'image' ) {
			// 'image' blocks use the featured image on the post, which is set by ID
			return;
		}
		update_post_meta( $object->ID, 'sphene-editor-block-image', strip_tags( $value ) );
	}

	public function get_block_image_url( $object ) {
		$block_type = $this->get_block_type( $object );
		if ( $block_type === 'image' ) {
			return $this->get_block_featured_image_url( $object );
		}
		return get_post_meta( $object['id'], 'sphene-editor-block-image', true );
	}

	private function get_block_featured_image_url( $object ) {
		return $this->get_image_url_from_attachment_id( get_post_thumbnail_id( $object['id'] ) );
	}

	private function get_image_url_from_attachment_id( $attachment_id ) {
		if ( ! $attachment_id || is_wp_error( $attachment_id  ) ) {
			return '';
		}
		$url = wp_get_attachment_url( $attachment_id );
		if ( ! $url || is_wp_error( $url  ) ) {
			return '';
		}
		return $url;
	}

	public function set_block_type( $value, $object ) {
		if ( ! $value || ! is_string( $value ) ) {
			return;
		}
		update_post_meta( $object->ID, 'sphene-editor-block-type', strip_tags( $value ) );
	}

	public function get_block_type( $object ) {
		return $this->get_block_type_from_id( $object['id'] );
	}

	private function get_block_type_from_id( $id ) {
		return get_post_meta( $id, 'sphene-editor-block-type', true );
	}

	public function get_post_content_filtered( $object ) {
		$post = get_post( $object['id'] );
		if ( ! $post ) {
			return '';
		}
		if ( ! $post->post_content_filtered ) {
			return $post->post_content;
		}
		return $post->post_content_filtered;
	}

	public function set_post_content_filtered( $value, $object ) {
		$post = get_post( $object->ID );
		if ( ! $post ) {
			return;
		}
		$updated = array(
			'ID' => $post->ID,
			'post_content_filtered' => $value,
		);
		$res = wp_update_post( $updated, true );
		if ( is_wp_error( $res ) ) {
			echo $res->message;
		}
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
				'supports' => array( 'author', 'thumbnail', 'editor' ),
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
		if ( ! is_single() || get_post_type() !== 'sphene_page' ) {
			return;
		}
		wp_enqueue_script( 'sphene-editor', plugins_url( 'js/sphene-editor.js', __FILE__ ), array(), true );
		wp_localize_script( 'sphene-editor', 'spheneData', array(
			'wpApiSettings' => array( 'root' => esc_url_raw( rest_url() ), 'nonce' => wp_create_nonce( 'wp_rest' ) ),
			'currentPageId' => $this->getCurrentPageId(),
		) );
	}

	public function enqueue_styles() {
		if ( ! is_single() || get_post_type() !== 'sphene_page' ) {
			return;
		}
		wp_enqueue_style( 'sphene-editor', plugins_url( 'css/sphene-editor.css', __FILE__ ) );
	}

	// Copy post_content to post_content_filtered
	// This is just temporary until the editor can do it
	public function update_page_content() {
		global $post;
		if ( empty( $post->post_content_filtered ) ) {
			$post->post_content_filtered = $post->post_content;
			wp_update_post( $post, false );
		}
	}

	public function getCurrentPageId() {
		global $post;
		return $post->ID;
	}
}
add_action( 'init', array( SpheneEditor::get_instance(), 'add_hooks' ) );
add_action( 'activate_sphene-editor/sphene-editor.php', array( SpheneEditor::get_instance(), 'rewrite_flush' ) );
