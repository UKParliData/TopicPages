define([
    'knockout',
    './config',
    './loader',
    './topics',
    'es5-shim'
    ], function(ko, cfg, loader, topics) {
    "use strict";

    function App() {
        var self = this;

        self.loading = ko.observable(true);
        self.selectedModule = ko.observable('home');
        self.progress = {
            expected: ko.observable(100),
            loaded: ko.observable(0)
        };

        topics.loadTerms()
            .progress(function(state) {
                self.progress.loaded(state.loaded);
                self.progress.expected(state.expected);
            })
            .done(function(result) {
                setTimeout(function() {
                    self.loading(false);
                }, 100);
            })
            .fail(function() {
                self.selectedModule('error');
            });

        topics.selection.subscribe(function(newValue) {
            self.selectedModule('topicFeed');
        });
    }

    return new App();
});
