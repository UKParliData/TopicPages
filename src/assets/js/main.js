require.config({
  shim: {
    'selectize' : {
      deps: [
        'css!../lib/selectize/dist/css/selectize.css',
        'css!../lib/selectize/dist/css/selectize.default.css'
      ]
    }
  },
  paths: {
    jquery: "../lib/jquery/dist/jquery",
    requirejs: "../lib/requirejs/require",
    knockout: "../lib/knockout/dist/knockout",
    selectize: "../lib/selectize/dist/js/selectize",
    text: "../lib/text/text",
    toastr: "../lib/toastr/toastr",
    "es5-shim": "../lib/es5-shim/es5-shim",
    microplugin: "../lib/microplugin/src/microplugin",
    sifter: "../lib/sifter/sifter",
    css: "../lib/require-css/css",
    "css-builder": "../lib/require-css/css-builder",
    normalize: "../lib/require-css/normalize"
  },
  packages: [

  ]
});

require(['init']);
