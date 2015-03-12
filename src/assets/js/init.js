define([
    'jquery',
    'knockout',
    'navigator',
    'selectize'
], function($, ko, navigator) {
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

    ko.components.loaders.unshift(componentLoader);

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
