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
        asi: 'true' # No obligation to use semicolons
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
        ignoreLeaks: true # Because I happen to bump into globals when using benv
        ui: 'bdd'
        reporter: 'nyan'
      all:
        src: ['test/**/*.js']

    watch:
      scripts:
        files: ['gruntfile.coffee', 'gruntfile.js', 'src/*.js', 'test/**/*.js']
        tasks: ['development']
      coffee:
        files: 'src/*.coffee'
        tasks: ['coffee:compile']

    bower: # It installs bower packages
      install:
        options:
          targetDir: 'bower_components',
          copy: false,
          verbose: true,
          bowerOptions:
            forceLatest: true

  # Matchdep loads all the npm packages starting with grunt-
  require('matchdep')
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks)

  grunt.registerTask 'development', ['coffeelint', 'jshint', 'coffee', 'simplemocha']
  grunt.registerTask 'default', ['bower', 'development', 'concat', 'uglify']
