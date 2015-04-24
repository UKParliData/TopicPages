define([
    'text!../../templates/home.html',
    'knockout'
], function(tpl, ko) {
    "use strict";

    var HomeViewModel = function() {
        var self = this;

        self.views = [
            { name: 'graph', caption: 'Graph' },
            { name: 'topic-list', caption: 'Topics' }
        ];

        self.view = ko.observable(self.views[0]);
    };

    return {
        viewModel: HomeViewModel,
        template: tpl
    };
});
