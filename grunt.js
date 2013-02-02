module.exports = function(grunt){
	grunt.initConfig({
		watch : {
			files : ['.']
		},
		server : {
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

		var server = grunt.config.get('server');

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

	grunt.registerTask('server', 'start-server watch');
};
