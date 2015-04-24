define([
    'text!../../templates/topic-list.html',
    'knockout',
    '../models/topics'
], function(tpl, ko, topics) {
    "use strict";

    var TopicListViewModel = function() {
        var self = this;

        self.rootTopics = topics.getBaseTopics();
    };

    return {
        viewModel: TopicListViewModel,
        template: tpl
    };
});
