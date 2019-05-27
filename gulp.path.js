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

    vendor: `./package.json`,

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
			src: [
        `${app}js/**/*`,
        `!${app}js/lib/**/*`,
      ],
			dest: `${dest}js/`,
    },

    inject: {
      css: [
        `${dest}css/**/*.css`,
        `!${dest}css/lib/*.css`,
      ],
      js: [
        `${dest}js/**/*.js`,
        `!${dest}js/lib/*.js`,
      ],
    },
  };
};