
module.exports = function(grunt){
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");

    var banner = grunt.template.process(
        grunt.file.read("src/banner.js"),
        {
            "data": grunt.file.readJSON("package.json")
        }
    );

    grunt.initConfig({
        concat: {
            options: { banner: banner },
            dist: {
                files: {
                    "dist/jquery-transition.js": ["src/jquery-transition.js"]
                }
            }
        },
        uglify: {
            options: { banner: banner },
            dist: {
                files: {
                    "dist/jquery-transition.min.js": ["src/jquery-transition.js"]
                }
            }
        }
    });

    grunt.registerTask("default", ["concat:dist", "uglify:dist"]);

};