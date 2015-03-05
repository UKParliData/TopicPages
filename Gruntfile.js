module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                files: {
                    'src/style.css': 'src/less/main.less'
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
    grunt.registerTask('default', ['watch']);
};
