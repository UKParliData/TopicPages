require.config({
  shim: {
    'jquery-ui': {
      deps: [
        'css!../lib/jquery-ui/themes/black-tie/jquery-ui.css'
      ]
    },
    vis: {
      deps: [
        'css!../lib/vis/dist/vis.css'
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
    'jquery-ui': '../lib/jquery-ui/jquery-ui',
    vis: '../lib/vis/dist/vis.min'
  },
  packages: [

  ]
});

define([
    'jquery',
    'knockout',
    'vis',
    './app',
    './models/topics',
    'jquery-ui',
], function($, ko, vis, app, topics) {
    "use strict";
    $.support.cors = true;


    /* ===== Components ====== */

    var componentLoader = {
        getConfig: function(name, callback) {
            if (name.substr(0, 11) === 'components/') {
                callback({ require: name });
            }
            else {
                callback(null);
            }
        }
    };

    ko.components.loaders.push(componentLoader);
    ko.components.register('components/error', { template: { require: 'text!../templates/error.html' } });


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


    /* ====== Custom binding: Date picker ====== */

    ko.bindingHandlers.datepicker = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().datepickerOptions || {},
                $el = $(element);

            //initialize datepicker with some optional options
            $el.datepicker(options);

            //handle the field changing
            ko.utils.registerEventHandler(element, "change", function() {
                var observable = valueAccessor();
                observable($el.datepicker("getDate"));
            });

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $el.datepicker("destroy");
            });

        },
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
                $el = $(element),
                current = $el.datepicker("getDate");

            if (value - current !== 0) {
                $el.datepicker("setDate", value);
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
    };


    /* ====== Custom binding: timeline ====== */

    // This uses the timeline in the VisJS library

    ko.bindingHandlers.timeline = {
        init: function(element, valueAccessor, allBindings, data, context) {
            var value = ko.unwrap(valueAccessor());
            var items = new vis.DataSet(value.items());
            var options = value.options;
            var timeline = new vis.Timeline(element, items, options);

            context.updateTimeline = function() {
                timeline.setItems(new vis.DataSet(value.items()));
                var lastDate = Math.max.apply(null,
                    value.items().map(function(x) { return x.start; })
                );
                var firstDate = lastDate - (180*86400*1000);
                timeline.setOptions({
                    start: firstDate,
                    end: lastDate
                });
            };

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                timeline.destroy();
            });
        },
        update: function(element, valueAccessor, allBindings, data, context) {
            context.updateTimeline();
        }
    };


    /* ====== Custom binding: 2D graph ====== */

    ko.bindingHandlers.graph2d = {
        init: function(element, valueAccessor, allBindings, data, context) {
            var value = ko.unwrap(valueAccessor());
            var groups = new vis.DataSet(value.groups());
            var items = new vis.DataSet(value.items());
            var options = value.options;
            var graph2d = new vis.Graph2d(element, items, groups, options);

            context.updateGraph = function() {
                var value = ko.unwrap(valueAccessor());
                graph2d.setGroups(new vis.DataSet(value.groups()));
                graph2d.setItems(new vis.DataSet(value.items()));
                graph2d.setOptions(value.options);
            };

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                graph2d.destroy();
            });

        },
        update: function(element, valueAccessor, allBindings, data, context) {
            context.updateGraph();
        }
    };


    ko.applyBindings(app);
});
