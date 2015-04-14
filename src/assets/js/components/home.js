define([
    'text!../../templates/home.html',
    '../models/topics'

], function(tpl, topics) {
    "use strict";


    function HomeViewModel() {
        var self = this;

        self.rootTopics = topics.getBaseTopics();
    }

    return {
        viewModel: HomeViewModel,
        template: tpl
    };
});
