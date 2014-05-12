/*global module:false*/
module.exports = function( grunt ) {

    "use strict";

    grunt.initConfig( {
         connect: {
              server: {
                options: {
                  port: 9000,
                  base: './app/',
                  hostname: 'localhost', // Change to 0.0.0.0 to external connection.
                  open: true,
                  keepalive: true,
                  middleware: function (connect, options) {
                    return [
                      require('connect-livereload')({ port: 35729 }),
                      // Serve static files.
                      connect.static(options.base),
                    ];
                  }
                }
              }
            },

        jshint: {
          src: {
            options: {
              curly: false,
              undef: true,
              globals: {
                "jQuery":true,
                "window":true,
                "document":true
              }
            },
            files: {
              src: ['app/fft.js']
            }
          }
        },
        concat: {
            js: {
                options: {
                    separator: ';'
                },
//                src:     ['external/**/*.js','src/*.js', 'src/*/*.js'],
                src:     [ 'app/assets/*.js', 'app/lib/*.js', 'app/src/*.js' ],
//                src:     [ 'external/BOX2DWEB/*.js','config/*.js', 'src/*/*.js','src/*.js'],
                dest:    'app/assets/all.js'
            }

        },

        // minifiziert JS-Dateien
        uglify: {
            build: {
                files: {
                    'app/assets/all.min.js': [ 'app/assets/all.js' ]
                }
            }
        },
        

    } );

    /**
     * Ist ein Modul, um alle npm-gruntTasks zu laden
     */
    require( 'load-grunt-tasks' )( grunt );



    grunt.registerTask( 'build', [ 'concat', 'uglify'] );

    grunt.registerTask( 'test', [ 'jshint'] );

    grunt.registerTask('default', 'server');
  grunt.registerTask('server', ['connect']);


};