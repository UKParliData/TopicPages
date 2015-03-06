module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                files: {
                    'src/style.css': 'src/less/main.less'
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
            files: ['src/less/*.less', 'src/less/**/*.less'],
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.registerTask('default', ['less', 'bower', 'bowerRequirejs']);
};
