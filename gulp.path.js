'use strict';

module.exports = (opt) => {
  let app = './app/';
  let dev = './build/';
  let prod  = './dist/';
  let dest  = opt.env  === 'dev' ? dev : prod;

  return {
    app:  app,
    dev:  dev,
    prod:  prod,
    dest:  dest,

    asset: {
      src: [
        `${app}asset/**/*`
      ]
    },

    vendor: `${app}vendor.json`,

    html: {
      base: `${app}html/`,
      src:  `${app}html/*.pug`,
      watch:  [
        `${app}html/**/*.pug`,
      ]
    },

    css:  {
      base: `${app}css/`,
      src:  `${app}css/**/*`,
      dest: `${dest}css/`,
    },

    js: {
			base: `${app}js/`,
			src: `${app}js/**/*`,
			dest: `${dest}js/`,
    },

    inject: {
      css: [
        `${dest}css/lib.css`,
        `${dest}css/**/*.css`,
      ],
      js: [
        `${dest}js/lib.js`,
        `${dest}js/**/*.js`,
      ]
    },
  };
};