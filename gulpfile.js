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
  const vendor = JSON.parse(fs.readFileSync(path.vendor)).vendor[opt.env];
  Object.keys(vendor).map(v => {
    const fileName = v == 'js' ? 'script' : 'style';
    $.del([`${path[v].base}lib`,`${path[v].dest}lib`]);
    src(vendor[v])
      .pipe(dest(`${path[v].base}lib`))
      .pipe(dest(`${path[v].dest}lib`))
      .pipe(src(path.html.base + 'block/_' + fileName + '.pug')
      .pipe($.inject(
        src(vendor[v], {read: false, allowEmpty: true}), {
          name: 'lib',
          transform: filePath => v == 'js'
            ? 'script(src="' + v + '/lib/' + filePath.match(/(?!.*\/).*$/)[0] + '")'
            : 'link(rel="stylesheet", href="' + v + '/lib/' + filePath.match(/(?!.*\/).*$/)[0] + '")',
        }))
      .pipe(dest(path.html.base + 'block')));
  });
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
              transform: filePath => 'link(rel="stylesheet", href="' + filePath.replace(/^\/\w+\//, "") + '")',
            }))
          .pipe(dest(path.html.base + 'block'))
);

task('inject:js',
  ()  =>  src(path.html.base + 'block/_script.pug')
          .pipe($.inject(
            src(path.inject.js, {read: false, allowEmpty: true}), {
              transform: filePath => 'script(src="' + filePath.replace(/^\/\w+\//, "") + '")'
            }))
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

const server = $.browserSync.create();
const reload = done => {
  server.reload();
  done();
};

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
    'inject',
    'html',
    'serve',
  )
);
task('prod', () => console.log('Running task PROD'));

task('default', series(opt.env));
