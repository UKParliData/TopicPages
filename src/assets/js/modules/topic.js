define([
    'text!../../templates/topic.html',
    '../models/topics',
    '../models/documents'
], function(tpl, topics, documents) {
    "use strict";


    function TopicViewModel() {
        var self = this;
        var feedLoader = new documents.FeedLoader();

        self.topic = topics.selection();
        self.items = feedLoader.items;

        feedLoader.load(self.topic);
    }

    return {
        viewModel: TopicViewModel,
        template: tpl
    };
});
