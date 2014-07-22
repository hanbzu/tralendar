module.exports = (grunt) ->
  banner = '/*\n<%= pkg.name %> <%= pkg.version %>- <%= pkg.description %>\n<%= pkg.repository.url %>\nBuilt on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffeelint:
      options:
        max_line_length:
          level: 'ignore' # No line length limits, please
      app: ['gruntfile.coffee', 'src/**/*.coffee', 'test/*.coffee']

    jshint:
      options:
        asi: 'true' # No line length limits, please
        quotmark: 'single'
      app: ['gruntfile.js', 'test/*.js', 'src/**/*.js']

    coffee:
      compile:
        expand: true
        flatten: true
        cwd: 'src/'
        src: ['**/*.coffee']
        dest: 'js/'
        ext: '.js'

    concat:
      options:
        separator: ';\n'
        banner: banner
      files:
        src: ['src/*.js', 'js/*.js']
        dest: 'build/<%= pkg.name %>.js'

    uglify:
      options:
        banner: banner
      build:
        files:
          'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']

    simplemocha:
      options:
        globals: ['expect']
        timeout: 3000
        ignoreLeaks: false
        ui: 'bdd'
        reporter: 'tap'
      all:
        src: ['test/**/*.js']

    watch:
      scripts:
        files: ['gruntfile.js', 'src/*.js', 'test/**/*.js']
        tasks: ['development']
      coffee:
        files: 'src/*.coffee'
        tasks: ['coffee:compile']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-simple-mocha'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'development', ['coffeelint', 'jshint', 'coffee', 'simplemocha']
  grunt.registerTask 'default', ['development', 'concat', 'uglify']
