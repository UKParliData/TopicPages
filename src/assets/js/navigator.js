define([
    'knockout',
    'config'
], function(ko, cfg) {

    function Navigator() {
        var self = this;

        self.pages = [];
        for (var key in cfg.modules) {
            if (cfg.modules.hasOwnProperty(key)) {
                self.pages = self.pages.concat({
                    pageTitle: cfg.modules[key].title,
                    target: key
                });
            }
        }

        self.pages.sort(function(a, b) {
            return a.pageTitle < b.pageTitle ? -1
                : a.pageTitle > b.pageTitle ? 1
                : 0;
            });

        self.loading = {
            inProgress: ko.observable(true),
            loaded: ko.observable(0),
            expected: ko.observable(100)
        };

        self.selectedComponent = ko.observable(null);
        self.moduleOfSelectedComponent = ko.pureComputed(function() {
            if (self.selectedComponent() == null) {
                return 'modules/home';
            }
            return 'modules/' + self.selectedComponent();
        });
        self.selectedConfig = ko.pureComputed(function() {
            var cp = self.selectedComponent();
            if (cfg.modules.hasOwnProperty(cp)) {
                return cfg.modules[cp];
            }
            return null;
        });

        self.parameters = ko.observable(null);
        self.messages = ko.observableArray([]);

        self.topics = ko.observableArray([]);
        self.selectedTopic = ko.observable(null);

        self.removeMessage = function() {
            self.messages.remove(this);
        };

        self.navigateTo = function(component, parameters) {
            if (parameters) {
                self.parameters(parameters);
            }
            self.selectedComponent(component);
        };

        self.goHome = function(parameters) {
            self.navigateTo('home');
        };

        self.gotoPage = function(page) {
            self.navigateTo(page.target);
        };
    };

    var navigator = new Navigator();

    return navigator;
});
