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

        self.showPage = function(a) {
            console.log(a);
        };

        self.pages = [
            { pageTitle: 'Briefing Papers', target: 'briefing-papers' },
            { pageTitle: 'Early Day Motions', target: 'edms' }
        ];

        console.log(self);
    }

    return {
        template: tpl,
        viewModel: viewModel
    };
});
