var gulp       = require('gulp'),
    docco      = require('gulp-docco'),
    jshint     = require('gulp-jshint'),
    mocha      = require('gulp-mocha'),
    gutil      = require('gulp-util'),
    sass       = require('gulp-sass'),
    prefix     = require('gulp-autoprefixer'),
    uglify     = require('gulp-uglify'),
    replace    = require('gulp-replace'),
    jshint     = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    watchify   = require('watchify'),
    browserify = require('browserify')

// The idea is to generate a bundled version of
// the code just for testing the library on it's own
var targetDir = './playground/dist' 

// Here we go with the details == devil:
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
// I'm apparently using "a vinyl-source-stream to get fast browserify
// builds with watchify, because otherwise it may take seconds to bundle"
// I'm doing as if I understand what I'm doing, which I don't. 
var bundler = watchify(browserify('./playground/index.js', watchify.args))

// add any other browserify options or transforms here
bundler.transform('brfs')

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error')) // log errors
    .pipe(source('index.js'))
    .pipe(buffer())                          // Optional: for sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // | loads map from browserify file
    .pipe(sourcemaps.write('./'))            // | writes .map file
    .pipe(gulp.dest(targetDir + '/'))
}

gulp.task('js-bundle', bundle)
bundler.on('update', bundle) // on any dep update, runs the bundler

// In-line documentation for this module
gulp.task('js-docco', function() {
  return gulp.src("src/**/*.js")
    .pipe(docco())
    .pipe(gulp.dest('docs'))
})

gulp.task('test', ['lint'], function() {
    return gulp.src('test/test.js', { read: false })
        .pipe(mocha({reporter: 'nyan'}))
})

// JShint will be used for JS linting.
// This part needs fine-tuning for my JS preferrence.
// See how I chose a certain reporter and an additional
// one that stops the flow if there is any failure.
gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js', 'playground/index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('sass', function() {
  return gulp.src('style/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
      style: 'expanded'
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest(targetDir + '/'))
})

gulp.task('style', ['sass'], function() {
  gulp.src('style/*.{css,css.map,woff,woff2}')
    .pipe(gulp.dest(targetDir + '/'))
})

gulp.task('watch', function () {
  gulp.watch('src/**/*.js',         ['test', 'js-bundle', 'js-docco'])
  gulp.watch('test/**/*.js',        ['test'])
  gulp.watch('style/**/*.scss',     ['style'])
  gulp.watch('style/*.woff*',       ['style'])
  gulp.watch('playground/index.js', ['lint', 'js-bundle'])
})

gulp.task('docs', ['js-docco', 'diagrams'])
gulp.task('default', ['lint', 'test', 'js-bundle', 'docs'])
