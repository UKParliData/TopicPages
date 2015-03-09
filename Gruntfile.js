module.exports = function(grunt) {
    var fs = require('fs'),
        path = require('path');

    grunt.initConfig({
        less: {
            development: {
                files: {
                    'src/assets/css/style.css': 'src/assets/less/app.less'
                }
            }
        },
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        bowerRequirejs: {
            target: {
                rjsConfig: 'src/assets/js/main.js'
            }
        },
        watch: {
            files: ['src/assets/less/*.less', 'src/assets/less/**/*.less'],
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('create-directories', function() {
        var dirs = [
            'src/assets/css',
            'src/assets/lib'
        ];

        dirs.forEach(function(dir) {
            var fullPath = path.resolve(__dirname, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath);
            }
        });
    });

    grunt.registerTask('default', ['create-directories', 'less', 'bower', 'bowerRequirejs']);
};
