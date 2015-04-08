define([
    'text!../../templates/topic.html',
    '../models/topics',
], function(tpl, topics) {
    "use strict";


    function TopicViewModel() {
        var self = this;

        self.topic = topics.selection();
    }

    return {
        viewModel: TopicViewModel,
        template: tpl
    };
});
