define([
    'knockout',
    'ddp',
    'text!../../templates/progress.html',
    'navigator'
], function(ko, ddp, tpl, nav) {
    "use strict";

    var InitViewModel = function() {
        var self = this;
        self.loaded = ko.observable(0);
        self.expected = ko.observable(100);
        self.percentage = ko.pureComputed(function() {
            return (Math.round(self.loaded() * 100 / self.expected()))
                .toString(10) + "%";
        }, self);
        self.caption = ko.observable('Loading taxonomy...');
    };

    var vm = new InitViewModel();

    var terms;

    ddp.loadTerms()
        .progress(function(state) {
            vm.loaded(state.loaded);
            vm.expected(state.expected);
        })
        .done(function(result) {
            terms = result;
            nav.goHome();
        })
        .fail(function() {
            nav.navigateTo('error');
        });

    return {
        template: tpl,
        viewModel: { instance: vm }
    };
});
