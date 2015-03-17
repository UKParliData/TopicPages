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
    'ddp',
    'selectize'
], function($, ko, navigator, ddp) {
    "use strict";
    $.support.cors = true;


    /* ===== Components ====== */

    var componentLoader = {
        getConfig: function(name, callback) {
            if (name.substr(0, 8) === 'modules/') {
                callback({ require: name });
            }
            else {
                callback(null);
            }
        }
    };

    ko.components.loaders.push(componentLoader);
    ko.components.register('modules/error', { template: { require: 'text!../templates/error.html' } });


    /* ====== Selectize initialisation ====== */

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

    ko.applyBindings(navigator);

    ddp.loadTerms()
        .progress(function(state) {
            navigator.loading.inProgress(true);
            navigator.loading.loaded(state.loaded);
            navigator.loading.expected(state.expected);
        })
        .done(function(result) {
            navigator.loading.inProgress(false);
            navigator.topics(result);
        })
        .fail(function() {
            navigator.navigateTo('error');
        });
});
