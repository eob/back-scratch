/**
 * Grunt Buildfile for Jailbreak Wordpress
 *
 * To be used with GruntJS <http://gruntjs.com/>
 */
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
      banner: "/**\n" +
              "* Back Scratch Client\n" +
              " *\n" +
              " * @author Ted Benson\n" +
              " * @copyright Edward Benson <%= grunt.template.today('yyyy') %>\n" +
              " * All Rights Reserved\n" +
              " */\n"
    },
    concat: {
      dist : {
        src : [
          "<banner>",
          "src/main/js/fragments/prefix._js",
          "src/main/js/events.js",
          "src/main/js/state-machine.js",
          "src/main/js/presence.js",
          "src/main/js/reporting.js",
          "src/main/js/widget.js",
          "src/main/js/fragments/postfix._js",
        ],
        dest : "release/back-scratch.js"
      }
    },
    lint: {
      all: ['grunt.js', 'src/**/*.js']
    },
    min: {
      "release/back-scratch.min.js": ["<banner>", "release/back-scratch.js"]
    },
    qunit: {
      files: [
      ]
    },
    watch: {
      scripts: {
        files: "<config:lint.files>",
        tasks: "default"
      }
    },
    jshint: {
      options: {
        browser: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');
};

