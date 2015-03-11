define([
    'text!../../templates/home.html',
    'ddp',
    'knockout',
    'selectize'
], function(tpl, ddp, ko) {
    "use strict";

    var viewModel = function() {
        var self = this;

        self.topics = ko.observableArray(ddp.getTerms());
        self.selectedTopic = ko.observable(null);
    }

    return {
        template: tpl,
        viewModel: viewModel
    };
});
