define([
    'text!../../templates/feed.html',
    'knockout',
    '../models/documents'
], function(tpl, ko, documents) {
    "use strict";

    var sources = documents.sources.all;


    function FeedViewModel(topicViewModel) {
        var self = this;
        self.items = topicViewModel.items;
    }

    return {
        viewModel : FeedViewModel,
        template: tpl
    };
});
