'use strict';

const {task, dest, src, series, parallel, watch} = require('gulp'),
      $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'minimist', 'del', 'autoprefixer', 'browser-sync']});

const defOpt = {
        string: ['env'],
        boolean: ['map'],
        default: {
          env: process.env.NODE_ENV || 'dev',
          map: false,
          concat: false,
          min: false,
          port: 3000
        }
      },
      opt = $.minimist(process.argv.slice(2), defOpt);

const path  = require('./gulp.path')(opt),
      config  = require('./gulp.config'),
      fs  = require('fs');

const del = f => $.del(f);

task('clean',  () => $.del([path.dev, path.prod]));

task('clean:node',  () => $.del(['node_modules', 'package-lock.json']));

task('vendor', done => {
  const vendor = JSON.parse(fs.readFileSync(path.vendor))[opt.env];
  Object.keys(vendor).map(v => src(vendor[v]).pipe($.concat(`lib.${v}`)).pipe(dest(path[v].dest)));
  done();
});

task('css',
  ()  =>  src(path.css.src)
          .pipe($.sourcemaps.init({loadMaps: true}))
          .pipe($.sass().on('error', $.sass.logError))
          .pipe($.postcss([ $.autoprefixer(config.css.autoprefixer) ]))
          .pipe($.sourcemaps.write('./'))
          .pipe(dest(path.css.dest))
);

task('js',
  ()  =>  src(path.js.src)
          .pipe($.jshint(config.js.settings))
          .pipe($.jshint.reporter('default'))
          .pipe(dest(path.js.dest))
);

task('asset',
  ()  =>  src(path.asset.src)
          .pipe($.plumber())
          .pipe(dest(path.dest))
);

task('inject:css',
  ()  =>  src(path.html.base + 'block/_style.pug')
          .pipe($.inject(
            src(path.inject.css, {read: false, allowEmpty: true}), {
              addpathSlash : false,
              transform: function (filePath) {
                filePath = filePath.replace(/^\/\w+\//, "");
                return 'link(rel="stylesheet", href="' + filePath + '")';
                }}))
          .pipe(dest(path.html.base + 'block'))
);

task('inject:js',
  ()  =>  src(path.html.base + 'block/_script.pug')
          .pipe($.inject(
            src(path.inject.js, {read: false, allowEmpty: true}), {
              addpathSlash : false,
              transform: function (filePath) {
                filePath = filePath.replace(/^\/\w+\//, "");
                return 'script(src="' + filePath + '")';
                }}))
          .pipe(dest(path.html.base + 'block'))
);

task('inject', series('inject:css', 'inject:js'));

task('html',
  ()  =>  src(path.html.src)
          .pipe($.plumber())
          .pipe($.pug(config.html.opts))
          .pipe($.htmlhint(config.html.htmlhint))
          .pipe($.htmlhint.reporter())
          .pipe($.htmlBeautify())
          .pipe($.plumber.stop())
          .pipe(dest(path.dest))
);

task('watch', done => {
  $.watch(path.html.watch, series('html', reload));
  $.watch(path.css.src, series('css', reload));
  $.watch(path.js.src, series('js', reload));
  $.watch(path.inject.css, { events: ['add', 'unlink']}, series('inject:css'));
  $.watch(path.inject.js, { events: ['add', 'unlink']}, series('inject:js'));
  $.watch(path.asset.src, series('asset', reload));
  $.watch(path.vendor, series('vendor', reload));
  done();
});

const server = $.browserSync.create();
const reload = done => {
  server.reload();
  done();
};

task('serve', series('watch',
  () => {
    server.init({
      server: {
        baseDir: path.dest,
        logFileChanges: false
      },
      port: opt.port,
      open: false
    })
  }
));

task('dev', series(
    'clean',
    parallel('vendor', 'asset'),
    parallel('css', 'js'),
    'html',
    'inject',
    'serve',
  )
);
task('prod', () => console.log('Running task PROD'));

task('default', series(opt.env));
