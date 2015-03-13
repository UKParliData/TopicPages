define([
    'jquery',
    'knockout',
    'navigator',
    'config',
    'text!../../templates/edms.html',
    'utils'
], function($, ko, nav, cfg, tpl) {
    "use strict";

    function loadEdm(item) {
        console.log(item);
        return {
            uri: item._about,
            date: new Date(item.dateTabled._value),
            motionText: item.motionText,
            externalUrl: item.externalLocation,
            edmNumber: item.edmNumber._value,
            title: item.title,
            sponsors: item.sponsors.map(function(s, ix) {
                return {
                    uri: s._about,
                    name: item.sponsorPrinted[ix]
                };
            }),
            topics: item.topic,
            type: item.type
        }
    }

    var EdmViewModel = function(termUri) {
        var self = this;

        self.loading = ko.observable(false);
        self.edms = ko.observableArray([]);

        var load = function(page) {
            var url = cfg.edms.queryByTopic.format(page, termUri);
            self.loading(true);
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            }).done(function(data) {
                var result = data.result;
                var items = result.items;
                var edms = items.map(loadEdm);
                self.loading(false);
                self.edms(edms);
                console.log(edms);
            });
        };

        load(0);
    }

    var viewModel = function() {
        var result = new EdmViewModel(nav.parameters());
        return result;
    };

    return {
        template: tpl,
        viewModel: viewModel
    };
});
