module.exports = function( grunt ) {
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		copytotheplace: {
			all: [ 'sphene-editor.php', 'js' ],
		},
	} );

	grunt.loadNpmTasks( 'grunt-copytotheplace' );

	grunt.registerTask( 'default', [ 'copytotheplace' ] );
};
