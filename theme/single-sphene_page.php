<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>" />
        <title><?php wp_title(); ?></title>
        <link rel="profile" href="http://gmpg.org/xfn/11" />
        <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
        <?php wp_head(); ?>
    </head>
		<body class="sphene-page-body">
<?php

if ( current_user_can( 'edit_pages' ) ) {
	echo '<button class="sphene-edit-button">Edit Page</button>';
}

while ( have_posts() ) {
	the_post();
	the_content();
}

?>
	</body>
</html>
