var bs            = require('browser-sync').create(),
    gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    jshint        = require('gulp-jshint'),
    sass          = require('gulp-sass')(require('sass')),
    imagemin      = require('gulp-imagemin'),
    modernizr     = require('gulp-modernizr'),
    imwebp        = require('imagemin-webp'),
    webp          = require('gulp-webp'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify'),
    notify        = require('gulp-notify'),
    replace       = require('gulp-replace'),
    zip           = require('gulp-zip'),
    clean         = require('gulp-clean'),
    cleanCSS      = require('gulp-clean-css'),
    details       = require('./project-details.json'),
    project       = details.project,
    version       = details.version,
    author        = details.author,
    company       = details.company,
    url           = details.url,
    email         = details.email,
    description   = details.description;
    
var paths = {
  projectdetails: {
    src: './project-details.json'
  },
  fonts: {
    src: './src/fonts/*',
    dest: './dist/fonts/'
  },
  faFonts: {
    src: './node_modules/@fortawesome/fontawesome-free/webfonts/*',
    dest: './dist/webfonts/'
  },
  faCss: {
    src: './node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    dest: './dist/css/'
  },
  slimMenu: {
    src: './src/assets/jquery.slimmenu.min.js',
    dest: './dist/js/'
  },
  normalize: {
    src: './node_modules/normalize.css/normalize.css',
    dest: './dist/css/'
  },
  bsJs: {
    src: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.*',
    dest: './dist/js/'
  },
  images: {
    src: './src/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
    dest: './dist/images/'
  },
  styles: {
    src: './src/scss/**/*.scss',
    dest: './dist/css/'
  },
  scripts: {
    src: './src/js/*.js',
    dest: './dist/js/'
  },
  containers: {
    src: './containers/*',
    dest: '../../Containers/'+project+'/'
  },
  manifest: {
    src: './manifest.dnn',
    dest: './'
  },
  zipdist: {
    src: 'dist/**/*',
    zipfile: 'dist.zip',
    dest: './temp/'
  },
  zipcontainers: {
    src: './containers/**/*',
    zipfile: 'cont.zip',
    dest: './temp/'
  },
  zipelse: {
    src: ['./menus/**/*', './partials/*', '*.{ascx,xml,html,htm}'],
    zipfile: 'else.zip',
    dest: './temp/'
  },
  zippackage: {
    src: ['./temp/*.zip','*.{dnn,png,jpg,txt}', 'LICENSE'],
    zipfile: project+'\_'+version+'\_install.zip',
    dest: './build/'
  },
  cleantemp: {
    src: './temp/'
  },
  cleandist: {
    src: './dist/'
  }
};
    

/*------------------------------------------------------*/
/* INIT TASKS ------------------------------------------*/
/*------------------------------------------------------*/
// Copy fonts from src/fonts to dist/fonts
function fontsInit() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'fontsInit'}));
}

// Copy fontawesome-free fonts from node_modules to dist/fonts
function faFontsInit() {
  return gulp.src(paths.faFonts.src)
    .pipe(gulp.dest(paths.faFonts.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'faFontsInit'}));
}

// Copy fontawesome-free CSS from node_modules to dist/css/fontawesome-free
function faCssInit() {
  return gulp.src(paths.faCss.src)
    .pipe(gulp.dest(paths.faCss.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'faCssInit'}));
}

// Copy jquery.slimmenu.min.js from src/assets to dist/js
function slimMenuInit() {
  return gulp.src(paths.slimMenu.src)
    .pipe(gulp.dest(paths.slimMenu.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'slimMenuInit'}));
}

// Compile normalize.css from node_modules and copy to dist/js
function normalizeInit() {
  return gulp.src(paths.normalize.src, { sourcemaps: true })
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(cleanCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(autoprefixer())
  .pipe(gulp.dest(paths.normalize.dest, { sourcemaps: '.' }))
  .pipe(notify({message: '<%= file.relative %> compiled and distributed!', title : 'normalizeInit'}));
}

// Copy bootstrap JS from node_modules to dist/js
function bsJsInit() {
  return gulp.src(paths.bsJs.src)
    .pipe(gulp.dest(paths.bsJs.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'bsJsInit'}));
}

// modernizr Init
function modernizrInit() {
  return gulp.src(paths.scripts.src)
    .pipe(modernizr({
      'options': [
        'setClasses'
      ],
      'tests': [
        'webp'
      ]
    }))
    .pipe(uglify())
    .pipe(rename({suffix: '-custom.min'}))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'modernizrInit', sound: false}));
}

/*------------------------------------------------------*/
/* END INIT TASKS --------------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* IMAGE TASKS -----------------------------------------*/
/*------------------------------------------------------*/
// Optimize images and copy to dist/images
function optimize() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
		.pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
      ], {
        plugins: imwebp({quality:75})
      }
    ))
		.pipe(gulp.dest(paths.images.dest))
    .pipe(notify({message: '<%= file.relative %> optimized!', title : 'images'}));
}

// Make WebP versions of all images
function convert() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(notify({message: '<%= file.relative %> converted to webp!', title : 'images'}));
}

/*------------------------------------------------------*/
/* END IMAGE TASKS -------------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* STYLES TASKS ----------------------------------------*/
/*------------------------------------------------------*/
// Compile custom SCSS to CSS and copy to dist/css
function styles() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
  .pipe(sass({includePaths: ['./node_modules']},{outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(cleanCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(autoprefixer())
  .pipe(gulp.dest(paths.styles.dest, { sourcemaps: '.' }))
  .pipe(notify({message: '<%= file.relative %> compiled and distributed!', title: 'styles'}));
}
/*------------------------------------------------------*/
/* END STYLES TASKS ------------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* SCRIPTS TASKS ---------------------------------------*/
/*------------------------------------------------------*/
// Compile custom JS and copy to dist/js
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(jshint())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: '.' }))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(notify({ message : '<%= file.relative %> minified!', title : "scripts"}));
}
/*------------------------------------------------------*/
/* END SCRIPTS TASKS -----------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* DNN TASKS -------------------------------------------*/
/*------------------------------------------------------*/
// Copy containers to proper DNN theme containers folder
function containers() {
  return gulp.src(paths.containers.src)
    .pipe(gulp.dest(paths.containers.dest))
    .pipe(notify({message: '<%= file.relative %> distributed!', title : 'containers'}));
}

// Update manifest.dnn
function manifest() {
  return gulp.src(paths.manifest.src)
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
    .pipe(gulp.dest(paths.manifest.dest))
    .pipe(notify({message: '<%= file.relative %> updated!', title : 'manifest'}));
}
/*------------------------------------------------------*/
/* END DNN TASKS ---------------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* MAINTENANCE TASKS -----------------------------------*/
/*------------------------------------------------------*/
// Clean up dist folder
function cleandist() {
  return gulp.src(paths.cleandist.src, { allowEmpty: true })
    .pipe(clean())
    .pipe(notify({message: 'dist folder cleaned up!', title : 'cleandist'}));
}
/*------------------------------------------------------*/
/* END MAINTENANCE TASKS -------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* PACKAGING TASKS -------------------------------------*/
/*------------------------------------------------------*/
// ZIP contents of dist folder
function zipdist() {
  return gulp.src(paths.zipdist.src)
    .pipe(zip(paths.zipdist.zipfile))
    .pipe(gulp.dest(paths.zipdist.dest))
    .pipe(notify({message: '<%= file.relative %> temporarily created!', title : 'zipdist'}));
}

// ZIP contents of containers folder
function zipcontainers() {
  return gulp.src(paths.zipcontainers.src)
    .pipe(zip(paths.zipcontainers.zipfile))
    .pipe(gulp.dest(paths.zipcontainers.dest))
    .pipe(notify({message: '<%= file.relative %> temporarily created!', title : 'zipcontainers'}));
}

// ZIP everything else
function zipelse() {
  return gulp.src(paths.zipelse.src, {base: '.'})
    .pipe(gulp.dest(paths.zipelse.dest))
    .pipe(notify({message: '<%= file.relative %> temporarily created!', title : 'zipcontainers'}))
    .pipe(replace('dist/', ''))
    .pipe(zip(paths.zipelse.zipfile))
    .pipe(gulp.dest(paths.zipelse.dest))
    .pipe(notify({message: '<%= file.relative %> temporarily created!', title : 'zipcontainers'}));
}

// git ziptemp
var ziptemp = gulp.series(zipdist, zipcontainers, zipelse);

// Assemble files into DNN theme install package
function zippackage() { 
  return gulp.src(paths.zippackage.src)
    .pipe(zip(paths.zippackage.zipfile))
    .pipe(gulp.dest(paths.zippackage.dest))
    .pipe(notify({message: '<%= file.relative %> created!', title : 'zippackage'}));
}

// Clean temp folder
function cleantemp() {
  return gulp.src(paths.cleantemp.src)
    .pipe(clean())
    .pipe(notify({message: 'temp folder cleaned up!', title : 'cleantemp'}));
}
/*------------------------------------------------------*/
/* END PACKAGING TASKS ---------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* DEV TASKS -------------------------------------------*/
/*------------------------------------------------------*/
//gulp serve
function serve() {
  bs.init({
      proxy: "nvQuickTheme.loc"
  });
  gulp.watch(paths.images.src, images).on('change', bs.reload);
  gulp.watch(paths.styles.src, styles).on('change', bs.reload);
  gulp.watch(paths.scripts.src, scripts).on('change', bs.reload);
  gulp.watch(paths.containers.src, containers).on('change', bs.reload);
}

// gulp watch
function watch() {
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.containers.src, containers);
}

// gulp images
var images = gulp.series(optimize, convert);

// gulp init
var init = gulp.series(fontsInit, faFontsInit, faCssInit, slimMenuInit, normalizeInit, bsJsInit, modernizrInit);

// gulp build
var build = gulp.series(cleandist, init, styles, scripts, images, containers, manifest);

// gulp package
var package = gulp.series(build, ziptemp, zippackage, cleantemp);
/*------------------------------------------------------*/
/* END DEV TASKS ---------------------------------------*/
/*------------------------------------------------------*/


/*------------------------------------------------------*/
/* EXPORT TASKS ----------------------------------------*/
/*------------------------------------------------------*/
// You can use CommonJS `exports` module notation to declare tasks
exports.fontsInit = fontsInit;
exports.faFontsInit = faFontsInit;
exports.faCssInit = faCssInit;
exports.slimMenuInit = slimMenuInit;
exports.normalizeInit = normalizeInit;
exports.bsJsInit = bsJsInit;
exports.convert = convert;
exports.optimize = optimize;
exports.images = images;
exports.modernizrInit = modernizrInit;
exports.styles = styles;
exports.scripts = scripts;
exports.containers = containers;
exports.manifest = manifest;
exports.cleandist = cleandist;
exports.zipdist = zipdist;
exports.zipcontainers = zipcontainers;
exports.zipelse = zipelse;
exports.ziptemp = ziptemp;
exports.zippackage = zippackage;
exports.cleantemp = cleantemp;
exports.serve = serve;
exports.watch = watch;
exports.init = init;
exports.build = build;
exports.package = package;

// Define default task that can be called by just running `gulp` from cli
exports.default = build;
/*------------------------------------------------------*/
/* END EXPORT TASKS ------------------------------------*/
/*------------------------------------------------------*/
