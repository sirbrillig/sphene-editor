module.exports = function( grunt ) {
	require( 'load-grunt-tasks' )( grunt );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		copytotheplace: {
			all: [ 'sphene-editor.php', 'SpheneEditor', 'js', 'css', 'theme' ],
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

		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: 'babel-register'
				},
				src: [ 'test/**/*.js' ]
			}
		},

		watch: {
			scripts: {
				files: [ 'src/**/*.js', '**/*.php', 'css/*.css' ],
				tasks: [ 'browserify', 'copytotheplace' ],
			}
		},
	} );

	grunt.registerTask( 'default', [ 'browserify', 'copytotheplace' ] );
	grunt.registerTask( 'start', [ 'default', 'watch' ] );
	grunt.registerTask( 'test', [ 'mochaTest' ] );
};
