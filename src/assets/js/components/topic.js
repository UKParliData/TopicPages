define([
    'text!../../templates/topic.html',
    'knockout',
    '../models/topics',
    '../models/documents',
    'jquery-ui'
], function(tpl, ko, topics, documents) {
    "use strict";

    function TopicViewModel() {
        var self = this;
        var feedLoader = new documents.FeedLoader();

        var now = new Date();
        var startOfMonthOneYearAgo = new Date(Math.floor(now / 86400000 - 365 - now.getDate() + 1) * 86400000);

        self.startDate = ko.observable(startOfMonthOneYearAgo);
        self.endDate = ko.observable(now);
        self.topic = topics.selection();
        self.documentType = ko.observable(null);
        self.filtering = ko.observable(false);
        self.sources = documents.sources.all.map(function(a) {
            return {
                selected: a.selected,
                title: a.title
            };
        });

        self.items = ko.pureComputed(function() {
            return feedLoader.items().filter(function(doc) {
                var isInDateRange = doc.date >= self.startDate() && doc.date <= self.endDate();
                var isSpecifiedDocumentType = self.documentType() === doc.type.name;
                var isAnyDocumentType = !self.documentType();
                return isInDateRange && (isAnyDocumentType || isSpecifiedDocumentType);
            });
        });

        self.views = [
            { name: 'barChart', caption: 'Bar Chart' },
            { name: 'timeline', caption: 'Timeline' },
            { name: 'feed', caption: 'Feed' }
        ];
        self.view = ko.observable(self.views[0]);

        feedLoader.load(self.topic);

        self.reset = function () {
            self.documentType(null);
            self.startDate(startOfMonthOneYearAgo);
            self.endDate(now);
        };

        self.showFilter = function() {
            self.filtering(true);
        };

        self.closeFilter = function() {
            self.filtering(false);
        };

        function selectOrDeselectAll(active) {
            for (var i = 0; i < self.sources.length; i++) {
                self.sources[i].selected(active);
            }
        }

        self.selectAllTypes = selectOrDeselectAll.bind(null, true);
        self.deselectAllTypes = selectOrDeselectAll.bind(null, false);

        self.filteredItems = ko.pureComputed(function() {
            return self.items().filter(function(i) { return i.type.selected(); });
        });
    }

    return {
        viewModel: TopicViewModel,
        template: tpl
    };
});
