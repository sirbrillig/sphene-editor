module.exports = function( grunt ) {
	require( 'load-grunt-tasks' )( grunt );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		copytotheplace: {
			all: [ 'sphene-editor.php', 'js', 'css', 'theme' ],
		},

		browserify: {
			options: {
				transform: [ 'babelify' ],
			},
			dist: {
				files: {
					'js/sphene-editor.js': 'src/index.js'
				}
			}
		},
	} );

	grunt.registerTask( 'default', [ 'browserify', 'copytotheplace' ] );
};
