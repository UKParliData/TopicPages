define([
    'knockout',
    'config',
    'ddp'
], function(ko, cfg, ddp) {

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

        self.componentLoading = ko.observable(false);

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

        self.topics = ko.observableArray([]);
        self.selectedTopic = ko.observable(null);
        self.selectedTopicName = ko.pureComputed(function() {
            var st = self.selectedTopic();
            return ddp.getTerm(st).name;
        });

        self.navigateTo = function(component) {
            self.selectedComponent(component);
        };

        self.gotoPage = function(page) {
            self.navigateTo(page.target);
        };

        self.selectedTopic.subscribe(function(newValue) {
            self.moduleOfSelectedComponent.notifySubscribers();
        });
    };

    var navigator = new Navigator();

    return navigator;
});
