define([
    'text!../../templates/home.html',
    'ddp',
    'knockout',
    'navigator',
    'selectize'
], function(tpl, ddp, ko, nav) {
    "use strict";

    var viewModel = function() {
        var self = this;

        self.topics = ko.observableArray(ddp.getTerms());
        self.selectedTopic = ko.observable(null);

        self.showPage = function(a) {
            nav.navigateTo(a.target, self.selectedTopic());
        };

        self.pages = [
            { pageTitle: 'Briefing Papers', target: 'briefing-papers' },
            { pageTitle: 'Early Day Motions', target: 'edms' }
        ];
    }

    return {
        template: tpl,
        viewModel: viewModel
    };
});
