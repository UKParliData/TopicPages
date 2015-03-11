require.config({
  shim: {

  },
  paths: {
    jquery: "../lib/jquery/dist/jquery",
    requirejs: "../lib/requirejs/require",
    knockout: "../lib/knockout/dist/knockout",
    selectize: "../lib/selectize/dist/js/selectize",
    text: "../lib/text/text",
    toastr: "../lib/toastr/toastr"
  },
  packages: [

  ]
});

define([
    'jquery',
    'knockout',
    'navigator'
], function($, ko, navigator) {
    "use strict";

    $.support.cors = true;
    ko.components.register('loader', { require: 'modules/loader' });
    ko.components.register('home', { require: 'modules/home' });
    ko.components.register('error', { template: { require: 'text!../templates/error.html' } });
    ko.applyBindings(navigator);
});
