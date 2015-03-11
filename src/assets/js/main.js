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

define([
    'jquery',
    'knockout',
    'navigator',
    'selectize'
], function($, ko, navigator) {
    "use strict";
    $.support.cors = true;

    /* ===== Components ====== */

    ko.components.register('loader', { require: 'modules/loader' });
    ko.components.register('home', { require: 'modules/home' });
    ko.components.register('error', { template: { require: 'text!../templates/error.html' } });
    ko.applyBindings(navigator);

    ko.bindingHandlers.selectize = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = {
                options: ko.unwrap(allBindingsAccessor.get("options")),
                labelField: ko.unwrap(allBindingsAccessor.get("optionsText")),
                valueField: ko.unwrap(allBindingsAccessor.get("optionsValue")),
                searchField: ko.unwrap(allBindingsAccessor.get("optionsText")),
                sortField: ko.unwrap(allBindingsAccessor.get("optionsText"))
            };
            var $select = $(element).selectize(options);
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.unwrap(allBindingsAccessor.get("options"));
            if (options.length > 0) {
                for (var i = 0; i < options.length; i++)
                    $(element).selectize()[0].selectize.addOption(options[i]);
                $(element).selectize()[0].selectize.enable();
            }
        }
    }
});
