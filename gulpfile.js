var manifest      = './manifest.json';
var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    cleancss      = require('gulp-clean-css'),
    jshint        = require('gulp-jshint'),
    sass          = require('gulp-sass'),
    imagemin      = require('gulp-imagemin'),
    rename        = require('gulp-rename'),
    notify        = require('gulp-notify'),
    plumber       = require('gulp-plumber'),
    path          = require('path'),
    config        = require( manifest ),
    node          = ( config.node.length )? config.node+'/' : '',
    src           = ( config.src.length )? config.src+'/' : '',
    assets        = ( config.assets.length )? config.assets+'/' : '';

// Gulp plumber error handler
var onError = function(err) {
    //console.log(err); // Commenting out because it's mostly annoying. Enable as needed.
    //this.emit('end');
};



/*
*	IMAGE/SVG TASKS
------------------------------------------------------*/
    
// Compresses images for production.
gulp.task('images', function() {
	return gulp.src( './'+node+'images/**/*.{jpg,jpeg,png,gif}' )
		.pipe(imagemin())
		.pipe(gulp.dest( './'+node+'images/' ));
});



/*
*	CSS TASKS
------------------------------------------------------*/

// Development CSS creation.
// Checks for errors and concats. Minified.
gulp.task('scss', function() {
	return gulp.src( './'+src+'scss/**/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('style.min.css'))
    .on('error', notify.onError(function( err ){
        return { message: err.message, title : 'ERROR', sound: "Frog"};
      })
    )
    .pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', '> 1%']}))
		.pipe(gulp.dest( './'+assets+'/css/'))
    .on('error', notify.onError(function( err ){
				return { message: err.message, title : 'ERROR', sound: "Frog"};
			})
		)
		.pipe(notify({ message: 'Styles compiled successfully!', title : 'sass', sound: false }));
});



/*
*	JAVASCRIPT TASKS
------------------------------------------------------*/

// Development JS creation.
// Checks for errors and concats. Does not minify.
gulp.task('js', function () {
    return gulp.src( [ './'+src+'js/*.js'] )
      .pipe(plumber({errorHandler: notify.onError( {
        message : "<%= error.message %>", title : 'ERROR' }
      )}))
      .pipe(jshint())
      .pipe(gulp.dest( './assets/js/'))
      .pipe(jshint.reporter('fail'))
      .pipe(notify(function (file) {
		    if (file.jshint.success) {
		    	return { message : 'JS much excellent success!',
									title : file.relative,
									sound: false,
									icon: path.join('node_modules/gulp-notify/node', 'gulp.png'),
								};
		    }
		    var errors = file.jshint.results.map(function (data) {
		       	if (data.error) {
		        	return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
		        }
		    }).join("\n");
		    return { message : file.relative + " (" + file.jshint.results.length + " errors)\n" + errors,
								sound: "Frog",
								emitError : true,
								icon: path.join('node_modules/gulp-notify/node', 'gulp-error.png'),
								title : 'JSLint'
							};
    	}))
});



/*
*	YARN INITIALIZATION
------------------------------------------------------*/

// Pulls from packages and distributes where necessary.
// Add/modify as needed.
gulp.task('node', function(){

	// This copies the normalize css file over to the scss components folder.
	// If you updated normalize it will get updated if you run [node].
	gulp.src( './'+node+'/normalize.css/normalize.css' )
		.pipe(rename("_normalize.scss"))
		.pipe(gulp.dest( './'+src+"scss/components/"));
  
	// Copies over bootstrap css and js to assets folder.
	gulp.src( './'+node+'/bootstrap/dist/css/bootstrap.min.css')
		.pipe(gulp.dest( './'+assets+"/css/"));
  gulp.src( './'+node+'/bootstrap/dist/js/bootstrap.bundle.min.js')
		.pipe(gulp.dest( './'+assets+"/js/"));
  
  // Copies over font-awesome node to proper folder.
  gulp.src( './'+node+'/font-awesome/fonts/*')
		.pipe(gulp.dest( './'+assets+"/fonts/"));
  gulp.src( './'+node+'/font-awesome/css/font-awesome.min.css')
		.pipe(gulp.dest( './'+assets+"/css/"));
  
  // Combines Sidr Styles and moves to components folder.
  // If you updated sidr it will get updated if you run [node].
  gulp.src('./'+node+'/sidr/dist/stylesheets/jquery.sidr.light.css')
    .pipe(rename("_sidr.scss"))
    .pipe(gulp.dest('./'+src+'scss/components/'));
  gulp.src( './'+node+'/sidr/dist/jquery.sidr.min.js')
		.pipe(gulp.dest( './'+assets+"/js/"));
  
});



/*
*	TASKS
* ------------------------------------------------------
*
* [gulp watch] - Development task
*
* [gulp build] - *NOT CREATED YET* Build task, compresses images, concats all scss, css, and js into single minified files.
*
*/

// gulp watch
gulp.task('watch', function () {
    gulp.watch( src+"scss/**/*.scss", ['scss']);
    gulp.watch([ src+"js/**/*.js"], ['js']);
});