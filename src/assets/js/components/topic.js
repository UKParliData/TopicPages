define([
    'text!../../templates/topic.html',
    'knockout',
    '../models/topics',
    '../models/documents'
], function(tpl, ko, topics, documents) {
    "use strict";

    function TopicViewModel() {
        var self = this;
        var feedLoader = new documents.FeedLoader();

        self.topic = topics.selection();
        self.items = feedLoader.items;
        self.views = [
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
