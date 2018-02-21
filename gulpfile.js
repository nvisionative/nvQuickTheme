var project       = 'nvQuickTheme', // If using dev environment in live instance, this needs to be the same as your root folder name.
    version       = '1.0.0',
    author        = 'TK Sheppard &amp; David Poindexter', 
    company       = 'nvisionative',
    url           = 'www.nvquicktheme.com',
    email         = 'support@nvisionative.com',
    description   = 'A DNN Theme Building Framework';

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
gulp.task('js', function() {
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
*	DNN TASKS
------------------------------------------------------*/

gulp.task('containers', function() {
  gulp.src('./containers/*')
    .pipe(gulp.dest('../../Containers/' +project+ '/'))
    .pipe(notify({message: 'Containers updated!', title : 'containers', sound: false}));
});



/*
*	SETUP TASKS
------------------------------------------------------*/

// Pulls from packages and distributes where necessary.
// Add/modify as needed.
gulp.task('update', function() {

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

// Takes the information provided at the top of this file and populates it into the dnn-manifest file.
gulp.task('manifest', function() {
  gulp.src('./dnn-manifest.dnn')
    .pipe(replace(/\<package name\=\"(.*?)(?=\")/, '<package name="'+company+ '.' +project))
    .pipe(replace(/type\=\"Skin\" version\=\"(.*?)(?=\")/, 'type="Skin" version="'+version))
    .pipe(replace(/\<friendlyName\>(.*?)(?=\<)/, '<friendlyName>'+project))
    .pipe(replace(/\<description\>(.*?)(?=\<)/, '<description>'+description))
    .pipe(replace(/\<name\>(.*?)(?=\<)/, '<name>'+author))
    .pipe(replace(/\<organization\>(.*?)(?=\<)/, '<organization>'+company))
    .pipe(replace(/\<url\>(.*?)(?=\<)/, '<url>'+url))
    .pipe(replace(/\<email\>(.*?)(?=\<)/, '<email>'+email))
    .pipe(replace(/\<skinName\>(.*?)(?=\<)/, '<skinName>'+project))
    .pipe(replace(/(\\Skins\\)(.*?)(?=\\)/g, '\\Skins\\'+project))
    .pipe(replace(/(\\Containers\\)(.*?)(?=\\)/g, '\\Containers\\'+project))
    .pipe(gulp.dest('./'))
    .pipe(notify({message: 'Manifest updated successfully!', title : 'manifest', sound: false}));
});



/*
*	PACKAGING TASKS
* ------------------------------------------------------*/

// Zips dist folder
gulp.task('zipdist', function() {
  return gulp.src('dist/**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'+temp))
});

// Zips containers folder
gulp.task('zipcontainers', function() {
  return gulp.src('./containers/**/*')
    .pipe(zip('cont.zip'))
    .pipe(gulp.dest('./'+temp))
});

// Zips everything else
gulp.task('zipelse', function() {
  return gulp.src(['./menus/**/*', './partials/*', '*.ascx', '*.xml', '*.html', '*.htm'], {base: '.'})
    .pipe(gulp.dest('./'+temp))
    .pipe(replace('dist/', ''))
    .pipe(zip('else.zip'))
    .pipe(gulp.dest('./'+temp))
});

// Runs all the zip tasks
gulp.task('buildzips', function (cb) {
  sequence(['zipdist', 'zipcontainers', 'zipelse'], cb)
});

// Zips the .zip files and single files into a package zip file.
// Will need to change if adding specific files.
gulp.task('zipfiles', function() { 
  return gulp.src(['./'+temp+'*.zip','*.{dnn,png,jpg}', 'LICENSE'])
    .pipe(zip(project+'\_'+version+'\_install.zip'))
    .pipe(gulp.dest('./'+build))
});

// Cleans temp folder
gulp.task('cleanup', function() {
  return gulp.src('./_temp')
    .pipe(clean())
});



/*
*	DEV TASKS
* ------------------------------------------------------*/

// gulp watch
gulp.task('watch', function () {
    gulp.watch( src+"scss/**/*.scss", ['scss'])
    gulp.watch([ src+"js/**/*.js"], ['js'])
    gulp.watch( './containers/*', ['containers'])
});

// gulp build
gulp.task('build', ['scss', 'js', 'images', 'containers']);

// gulp package
gulp.task('package', sequence('build', 'buildzips', 'zipfiles', 'cleanup'));
