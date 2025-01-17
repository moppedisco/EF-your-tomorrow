module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        options: {
          beautify: true,
          mangle: false
        },              
        src: [
          'js/jquery.js', 
          'js/plugins/base64.min.js',
          'js/plugins/PxLoader.js',
          // 'js/plugins/PxLoaderImage.js',
          'js/plugins/PxLoaderVideo.js',
          'js/plugins/video.js',
          'js/plugins/jquery.transit.min.js',
          'js/plugins/promise-0.1.1.min.js',
          'js/plugins/mediaelement.js',
          'js/plugins/mediaelementplayer.js',
          'js/app.js'
        ],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    less: {
      style: {
        files: {
          "css/style.css": "css/style.less"
        }
      }
    },
    // cssmin: {
    //   combine: {
    //     files: {
    //       'css/build/style.min.css': ['css/style.css']
    //     }
    //   }
    // }
	
	connect: {
		server: {
			options: {
				hostname: 'localhost',
				port: 9000,
				keepalive: true
			}
		}
	},
	
    watch: {
      js: {
        files: ['js/app.js'],
        tasks: ['uglify:build'],
        options: {
          livereload: false,
        }
      },
      css: {
        files: ['css/*.less'],
        tasks: ['less:style'],
        options: {
          livereload: false,
        }
      }
    } 
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');

  // I need a server to run this ;-)
  // grunt.loadNpmTasks('grunt-contrib-connect');
  
  // Default task(s).
  grunt.registerTask('default', ['watch']);

};