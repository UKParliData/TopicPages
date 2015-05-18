define([
    'text!../../templates/feed.html',
    'knockout',
    '../models/documents'
], function(tpl, ko, documents) {
    "use strict";

    function FeedViewModel(topicViewModel) {
        var self = this;
        self.items = topicViewModel.filteredItems;
    }

    return {
        viewModel : FeedViewModel,
        template: tpl
    };
});
