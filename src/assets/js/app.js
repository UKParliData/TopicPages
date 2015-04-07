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

        topics.loadTerms().done(function() {
            self.loading(false);
        });
    }

    return new App();
});
