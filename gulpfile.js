var gulp = require('gulp'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css'),
	image = require('gulp-image'),
	sass = require('gulp-sass'),
	http = require('http'),
    statics = require('node-static');

var gulpPaths = {
	"nm":"./node_modules/",
	"js":"./src/js/",
	"img":"./src/img/",
	"sass":"./src/scss/",
	"dist":"./dist/"
}

function app(){
	return gulp.src([
		gulpPaths.js +'**/*.js'
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest(gulpPaths.dist + 'js'));
}

function vendor(){
	return gulp.src([
		gulpPaths.nm + 'jquery/dist/jquery.min.js',
		gulpPaths.nm + 'popper.js/dist/umd/popper.min.js',
		gulpPaths.nm + 'bootstrap-beta/dist/js/bootstrap.min.js',
	])
	.pipe(concat('vendor.js'))
	.pipe(gulp.dest(gulpPaths.dist + 'js'));
}

function mySass(){
	return gulp.src([
		gulpPaths.sass + 'main.scss'
	])
	.pipe(sass().on('error',sass.logError))
	.pipe(plumber())
	.pipe(rename('app.css'))
	.pipe(gulp.dest(gulpPaths.dist+'css'));
}

function style() {
    return gulp.src([
        gulpPaths.nm + 'bootstrap-beta/dist/css/bootstrap.min.css',
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(gulpPaths.dist+'css'))
}

function img(){
    return gulp.src([
        gulpPaths.img + '*'
    ])
    .pipe(image())
    .pipe(gulp.dest(gulpPaths.dist+'images'));
}

function serve() {
    var st = new statics.Server('./', {cache: -1});
    console.log('Development server started on http://localhost:3333');
    http.createServer(function (req, res) {
        st.serve(req, res);
    }).listen(3333);
}

gulp.task('app', app);
gulp.task('vendor', vendor);
gulp.task('sass', mySass);
gulp.task('style', style);
gulp.task('images', img);	
gulp.task('serve', serve);

gulp.task('default',['app','vendor','sass','style','images','watch','serve'])

gulp.task('watch',function(){
	gulp.watch(gulpPaths.sass + '*.scss', ['sass']);
    gulp.watch(gulpPaths.js + '**/*.js', ['app']);
    gulp.watch(gulpPaths.img + '*', ['images']);
})