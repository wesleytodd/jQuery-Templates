module.exports = function(grunt){
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta : {
			banner : '/* <%= pkg.name %> | Version: <%= pkg.version %> | Author: <%= pkg.author %> */'
		},
		watch : {
			files : '<config:lint.all>',
			tasks : 'mocha lint min'
		},
		min : {
			dist : {
				src : ['<banner>', '<config:lint.all>'],
				dest : 'src/jquery.templates.min.js'
			}
		},
		lint : {
			all : ['src/jquery.templates.js']
		},
		jshint : {
			options : {
				evil : true
			}
		},
		serve : {
			port : 8000,
			root : '.'
		},
		mocha : {
			all : {
				src : ['test/index.html'],
				options : {
					run : true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('start-server', 'Start a server', function(){

		var server = grunt.config.get('serve');

		grunt.log.writeln('Starting server on port ' + server.port)

		var static = require('node-static');
		var fileServer = new static.Server(server.root);
		require('http').createServer(function (request, response) {
			request.addListener('end', function () {
				grunt.log.writeln(request.headers.host + ' ' + request.url);
				fileServer.serve(request, response);
			});
		}).listen(server.port);

	});

	grunt.registerTask('default', 'start-server watch');
};
