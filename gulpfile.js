var project       = 'nvQuickTheme';
var manifest      = './manifest.json';
var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    jshint        = require('gulp-jshint'),
    sass          = require('gulp-sass'),
    imagemin      = require('gulp-imagemin'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify'),
    notify        = require('gulp-notify'),
    sequence      = require('gulp-sequence'),
    replace       = require('gulp-replace'),
    zip           = require('gulp-zip'),
    clean         = require('gulp-clean'),
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
	return gulp.src( './'+src+'images/**/*.{jpg,jpeg,png,gif}' )
		.pipe(imagemin())
		.pipe(gulp.dest( './'+dist+'images/' ));
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
      .pipe(gulp.dest( './'+dist+'js/'))
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
gulp.task('update', function(){

	// This copies the normalize css file over to the scss components folder.
	// If you update normalize it will get overwritten if you run [setup].
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
*	PACKAGING TASKS
* ------------------------------------------------------*/

// Zips the dist/css Folder
gulp.task('zipcss', function() {
  return gulp.src('./'+dist+'/css/*')
    .pipe(zip('css.zip'))
    .pipe(gulp.dest('./'+dist+'/css/'))
});
  
// Zips the dist/js Folder
gulp.task('zipjs', function() {
  return gulp.src('./'+dist+'/js/*')
    .pipe(zip('js.zip'))
    .pipe(gulp.dest('./'+dist+'/js/'))
});

// Zips the dist/images Folder
gulp.task('zipimages', function() {
  return gulp.src('./'+dist+'/images/*')
    .pipe(zip('images.zip'))
    .pipe(gulp.dest('./'+dist+'/images/'))
});

// Zips the dist/fonts Folder
gulp.task('zipfonts', function() {
  return gulp.src('./'+dist+'/fonts/*')
    .pipe(zip('fonts.zip'))
    .pipe(gulp.dest('./'+dist+'/fonts/'))
});

// Zips the containers Folder
gulp.task('zipcontainers', function() {
  return gulp.src('./containers/*')
    .pipe(zip('cont.zip'))
    .pipe(gulp.dest('./containers/'))
});
  
// Zips the menus Folder
gulp.task('zipmenus', function() {
  return gulp.src('./menus/main/*')
    .pipe(zip('menus.zip'))
    .pipe(gulp.dest('./menus/main/'))
});

// Zips the Partials Folder
gulp.task('zippartials', function() {
  return gulp.src('./partials/*')
    .pipe(gulp.dest('./_temp/'))
    .pipe(replace('dist/', ''))
    .pipe(zip('partials.zip'))
    .pipe(gulp.dest('./partials/'))
});

// Zips the root Folder template files
gulp.task('ziproot', function() {
  return gulp.src(['*.ascx', '*.xml', '*.html', '*.htm'])
    .pipe(zip('root.zip'))
    .pipe(gulp.dest('./'))
});

// Runs all the Zip tasks
gulp.task('buildzips', function (cb) {
  sequence(['zipcss', 'zipjs', 'zipimages', 'zipfonts', 'zipcontainers', 'zipmenus', 'zippartials', 'ziproot'], cb)
});

// Zips the .zip files and single files into a package zip file.
// Will need to change if filenames change, or adding specific files.
gulp.task('zipfiles', function() { 
  return gulp.src(['./**/*.zip', '*.dnn', '*.png', '*.jpg', 'LICENSE', '!./_temp'])
    .pipe(zip(project+'.zip'))
    .pipe(gulp.dest('./'))
});

// Cleans up all directory zip files.
gulp.task('cleanup', function() {
  return gulp.src(['./*/**/*.zip', './_temp', 'root.zip'])
    .pipe(clean())
});



/*
*	DEV TASKS
* ------------------------------------------------------*/

// gulp watch
gulp.task('watch', function () {
    gulp.watch( src+"scss/**/*.scss", ['scss'])
    gulp.watch([ src+"js/**/*.js"], ['js'])
});

// gulp build
gulp.task('build', ['scss', 'js', 'images']);

// gulp package
gulp.task('package', sequence('build', 'buildzips', 'zipfiles', 'cleanup'));