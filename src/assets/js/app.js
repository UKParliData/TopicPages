define(['jquery', 'knockout', 'ddp'], function($, ko, ddp) {
    "use strict";

    var InitViewModel = function() {
        var self = this;
        self.loaded = ko.observable(0);
        self.expected = ko.observable(100);
        self.percentage = ko.pureComputed(function() {
            return (Math.round(self.loaded() * 100 / self.expected()))
                .toString(10) + "%";
        }, self);
    };

    var vm = new InitViewModel();

    ko.components.register('init', {
        template: { require: 'text!/modules/progress.html' },
        viewModel: { instance: vm }
    });

    ko.applyBindings({ selectedComponent: 'init' });

    var terms;

    (function() {
        var loading = document.getElementById('loading');
        var progressValue = document.getElementById('progress-value');
        var progressMeter = document.getElementById('progress-meter');

        ddp.getTerms()
            .progress(function(state) {
                vm.loaded(state.loaded);
                vm.expected(state.expected);
            })
            .done(function(result) {
                terms = result;
            });
    })();
});
