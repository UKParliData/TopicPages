define([
    'knockout',
    './config',
    './models/topics',
    'es5-shim'
], function(ko, cfg, topics) {
    "use strict";

    function App() {
        var self = this;
        
        var defaultTitle = 'Browse Parliamentary data by topic';

        self.loading = ko.observable(1);
        self.loaded = ko.observable(false);
        self.selectedModule = ko.observable('home');
        self.title = ko.observable(defaultTitle);
        self.progress = {
            expected: ko.observable(100),
            loaded: ko.observable(0)
        };

        self.goToTopicPicker = function() {
            self.selectedModule('home');
            self.title(defaultTitle);
        };

        topics.loadTerms()
            .progress(function(state) {
                self.progress.loaded(state.loaded);
                self.progress.expected(state.expected);
            })
            .always(function() {
                self.loading(0);
                self.loaded(true);
            })
            .fail(function() {
                self.selectedModule('error');
                self.title(defaultTitle);
                self.loading(0);
                self.loaded(true);
            });

        topics.selection.subscribe(function(newValue) {
            self.selectedModule('topic');
            self.title('Browsing » ' + newValue.name);
        });
    }

    return new App();
});
