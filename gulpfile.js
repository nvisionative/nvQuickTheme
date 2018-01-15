var manifest      = './manifest.json';
var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    jshint        = require('gulp-jshint'),
    sass          = require('gulp-sass'),
    imagemin      = require('gulp-imagemin'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify'),
    notify        = require('gulp-notify'),
    path          = require('path'),
    config        = require( manifest ),
    node          = ( config.node.length )? config.node+'/' : '',
    src           = ( config.src.length )? config.src+'/' : '',
    dist          = ( config.dist.length )? config.dist+'/' : '';

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
// Checks for errors and concats. Minifies.
gulp.task('scss', function() {
	return gulp.src( './'+src+'scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', '> 1%']}))
		.pipe(gulp.dest( './'+dist+'/css/'))
		.pipe(notify({message: 'Styles compiled successfully!', title : 'sass', sound: false}));
});



/*
*	JAVASCRIPT TASKS
------------------------------------------------------*/

// Development JS creation.
// Checks for errors and concats. Minifies.
gulp.task('js', function () {
    return gulp.src( [ './'+src+'js/*.js'] )
      .pipe(jshint())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest( './dist/js/'))
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
*	SETUP TASKS
------------------------------------------------------*/

// Pulls from packages and distributes where necessary.
// Add/modify as needed.
gulp.task('setup', function(){

	// This copies the normalize css file over to the scss components folder.
	// If you update normalize it will get updated if you run [setup].
	gulp.src( './'+node+'/normalize.css/normalize.css' )
		.pipe(rename("_normalize.scss"))
		.pipe(gulp.dest( './'+src+"scss/components/"));
  
	// Copies over bootstrap css and js to dist.
	gulp.src( './'+node+'/bootstrap/dist/css/bootstrap.min.css')
		.pipe(gulp.dest( './'+dist+"/css/"));
  gulp.src( './'+node+'/bootstrap/dist/js/bootstrap.bundle.min.js')
		.pipe(gulp.dest( './'+dist+"/js/"));
  
  // Copies over font-awesome assets to dist.
  gulp.src( './'+node+'/font-awesome/fonts/*')
		.pipe(gulp.dest( './'+dist+"/fonts/"));
  gulp.src( './'+node+'/font-awesome/css/font-awesome.min.css')
		.pipe(gulp.dest( './'+dist+"/css/"));
    
});



/*
*	DEV TASKS
* ------------------------------------------------------*/

// gulp watch
gulp.task('watch', function () {
    gulp.watch( src+"scss/**/*.scss", ['scss']);
    gulp.watch([ src+"js/**/*.js"], ['js']);
});

// gulp build
gulp.task('build', ['scss', 'js']);