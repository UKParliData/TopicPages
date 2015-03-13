define([
    'jquery',
    'knockout',
    'navigator',
    'config',
    'text!../../templates/briefing-papers.html',
    'utils'
], function($, ko, nav, cfg, tpl) {
    "use strict";

    function loadBriefingPaper(item) {
        return {
            uri: item._about,
            date: new Date(item.date._value),
            description: item.description[0],
            identifier: item.identifier._value,
            title: item.title,
            topics: item.topic.map(function(t) {
                return {
                    uri: t._about,
                    title: t.prefLabel._value
                };
            }),
            type: item.type
        }
    }

    var BriefingPaperViewModel = function(termUri) {
        var self = this;

        self.loading = ko.observable(false);
        self.papers = ko.observableArray([]);

        var load = function(page) {
            var url = cfg.briefingPapers.queryByTopic.format(page, termUri);
            self.loading(true);
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            }).done(function(data) {
                var result = data.result;
                var items = result.items;
                var briefingPapers = items.map(loadBriefingPaper);
                self.loading(false);
                self.papers(briefingPapers);
                console.log(briefingPapers);
            });
        };

        load(0);
    }

    var viewModel = function() {
        var result = new BriefingPaperViewModel(nav.selectedTopic());
        return result;
    };

    return {
        template: tpl,
        viewModel: viewModel
    };
});
