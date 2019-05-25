'use strict';

module.exports = {
  css: {
    //settings
    autoprefixer: {
      browsers: [
        '> 0%'
      ],
      cascade: true
    },
    cssmin: {
      // keepSpecialComments : '0'
      compatibility: 'ie8'
    },
    cssLint: {
      'adjoining-classes': false,
      'box-model': false,
      'box-sizing': false,
      'bulletproof-font-face': true,
      'compatible-vendor-prefixes': true,
      'display-property-grouping': true,
      'duplicate-background-images': true,
      'duplicate-properties': true,
      'empty-rules': true,
      'errors': true, //
      'fallback-colors': false,
      'floats': true,
      'font-faces': false,
      'font-sizes': false,
      'gradients': true,
      'ids': true,
      'import': true,
      'important': false,
      'known-properties': true,
      'outline-none': false,
      'overqualified-elements': false,
      'qualified-headings': false,
      'regex-selectors': false,
      'rules-count': true, //
      'selector-max': true, //
      'selector-max-approaching': true, //
      'shorthand': true,
      'star-property-hack': true,
      'text-indent': false,
      'underscore-property-hack': true,
      'unique-headings': true,
      'universal-selector': false,
      'unqualified-attributes': false,
      'vendor-prefix': true,
      'zero-units': true
    }
  },

  html: {
    // settings
    opts: {
      pretty: true,
      locals: {}
    },
    htmlhint: {
      'tagname-lowercase': true,
      'attr-lowercase': false,
      'attr-value-double-quotes': true,
      'spec-char-escape': true,
      'id-unique': true,
      'src-not-empty': true,
      'img-alt-require': true
    },
    htmlmin: {
      collapseWhitespace: true
    }
  },

  js: {
    settings: {
      'boss': true,
      'browser': true,
      'curly': true,
      'devel': true,
      'eqeqeq': true,
      'eqnull': true,
      'evil': true,
      'expr': true,
      'globals': {
        'Modernizr': true,
        'jQuery': true
      },
      'latedef': true,
      'loopfunc': true,
      'newcap': true,
      'noarg': true,
      'quotmark': 'single',
      'sub': true,
      'undef': true,
      'unused': true
    }
  }
};