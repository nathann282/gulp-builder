'use strict';

const gulp  = require('gulp'),
      $     = require('gulp-load-plugins')({
                pattern: ['gulp-*', 'minimist']
              }),
      defOpts = {
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
      taskDir = './tasks',
      tasks = require('fs').readdirSync(taskDir);

let opts  = $.minimist(process.argv.slice(2), defOpts);

tasks.forEach(task => {
  console.log(task);
  try {
    require(taskDir + task)(gulp, $, opts);
  } catch(err) {
    console.log(`Task ${task} could not be loaded: ${err}`);
  }
});

gulp.task('default', done => {
  let t = opts.env === 'dev' ? 'dev' : 'prod';
  return gulp.series(t)(done);
});

gulp.task('dev', () => console.log('dev'));

gulp.task('prod', () => console.log('prod'));