require.config({
  shim: {
    'jquery-ui': {
      deps: [
        'css!../lib/jquery-ui/themes/black-tie/jquery-ui.css'
      ]
    }
  },
  paths: {
    jquery: '../lib/jquery/dist/jquery',
    requirejs: '../lib/requirejs/require',
    knockout: '../lib/knockout/dist/knockout',
    text: '../lib/text/text',
    toastr: '../lib/toastr/toastr',
    'es5-shim': '../lib/es5-shim/es5-shim',
    css: '../lib/require-css/css',
    'css-builder': '../lib/require-css/css-builder',
    normalize: '../lib/require-css/normalize',
    'jquery-ui': '../lib/jquery-ui/jquery-ui'
  },
  packages: [

  ]
});

define([
    'jquery',
    'knockout',
    'navigator',
    'topics',
    'jquery-ui'
], function($, ko, nav, topics) {
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


    /* ====== Custom binding: Accordion ====== */

    ko.bindingHandlers.accordion = {
        init: function(element, valueAccessor) {
            var options = valueAccessor() || {};
            setTimeout(function() {
                $(element).accordion(options);
            }, 0);

            //handle disposal (if KO removes by the template binding)
              ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                  $(element).accordion("destroy");
              });
        },
        update: function(element, valueAccessor) {
            if (typeof $(element).data('ui-accordion') != 'undefined') {
                var options = valueAccessor() || {};
                $(element).accordion("destroy").accordion(options);
            }
        }
    };

    /* ====== Custom binding: onScrollEnd ====== */

    // This is used to implement infinite scrolling.

    ko.bindingHandlers.scrollend = {
        init: function(element, valueAccessor, allBindings, data, context) {
            var handler = function() {
                if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
                    valueAccessor()();
                }
            };

            $(window).on('scroll', handler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(window).off('scroll', handler);
            });
        }
    }



    ko.applyBindings(nav);

    topics.loadTerms()
        .progress(function(state) {
            nav.loading.inProgress(true);
            nav.loading.loaded(state.loaded);
            nav.loading.expected(state.expected);
        })
        .done(function(result) {
            nav.loading.inProgress(false);
            nav.topics(result);
            nav.rootTopics(topics.getBaseTopics());
        })
        .fail(function() {
            nav.navigateTo('error');
        });
});
