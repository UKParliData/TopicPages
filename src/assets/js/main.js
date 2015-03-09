require.config({
  shim: {

  },
  paths: {
    jquery: "../lib/jquery/dist/jquery",
    requirejs: "../lib/requirejs/require",
    knockout: "../lib/knockout/dist/knockout",
    selectize: "../lib/selectize/dist/js/selectize"
  },
  packages: [

  ]
});
require(['app']);
