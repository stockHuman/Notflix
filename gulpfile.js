/*
	Arthem (c) 2017
	==
	run the whole shabang with `$ gulp watch` in the project directory
	install them all with
	`$ npm i gulp gulp-sass gulp-concat gulp-rename gulp-uglify browser-sync -D
*/

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// compiles sass files to css
gulp.task('sass', function () {
	return gulp.src('scss/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', function (err) {
			console.error(err.message);
			browserSync.notify(err.message, 3000); // Display error in the browser
			this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
		})) // Using gulp-sass
		.pipe(gulp.dest('build/assets/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// similarly to the sass tast, scripts compiles and concatinates js files and reloads the browser
gulp.task('scripts', function() {
	// script paths
	var jsSources = 'js/*.js',
	    jsDist = 'build/assets/js/';

  return gulp.src(jsSources)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(jsDist))
		.pipe(rename('app.min.js'))
		.pipe(uglify().on('error', function (err) {
			console.error(err.message);
			browserSync.notify(err.message, 3000); // Display error in the browser
			this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
		}))
		.pipe(gulp.dest(jsDist))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browserSync', function () {
	browserSync.init({server: {baseDir: "./build"}})
});

// watches files for changes, adjust accordingly
gulp.task('watch', ['browserSync', 'sass'], function () {
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('js/**/*.js', ['scripts']);
	gulp.watch('build/**/*.html', browserSync.reload);
});

// stop old version of gulp watch from running when you modify the gulpfile
gulp.watch("gulpfile.js").on("change", function () {
	process.exit(0);
});
