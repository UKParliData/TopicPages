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
        var startOfMonthoneYearAgo = new Date(Math.floor(now / 86400000 - 365 - now.getDate() + 1) * 86400000);

        self.startDate =ko.observable(startOfMonthoneYearAgo);
        self.endDate = ko.observable(now);
        self.topic = topics.selection();

        self.items = ko.pureComputed(function() {
            return feedLoader.items().filter(function(doc) {
                return doc.date >= self.startDate() && doc.date <= self.endDate();
            });
        });

        self.views = [
            { name: 'barChart', caption: 'Bar Chart' },
            { name: 'timeline', caption: 'Timeline' },
            { name: 'feed', caption: 'Feed' },
        ];
        self.view = ko.observable(self.views[0]);

        feedLoader.load(self.topic);
    }

    return {
        viewModel: TopicViewModel,
        template: tpl
    };
});
