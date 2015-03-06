module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                files: {
                    'src/style.css': 'src/less/main.less'
                }
            }
        },
        bower : {
            install: {
                options: {
                    targetDir: 'src/assets',
                    layout: 'byComponent',
                    cleanTargetDir: true,
                    cleanBowerDir: true
                }
            }
        },
        watch: {
            files: ['src/less/*.less', 'src/less/**/*.less'],
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.registerTask('default', ['watch']);
};
