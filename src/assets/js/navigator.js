define([
    'knockout',
    'config',
    'loader',
    'ddp',
    'es5-shim'
], function(ko, cfg, loader, ddp) {

    function Navigator() {
        var self = this;

        self.pages = [];

        /* ====== Observable properties ====== */

        self.componentLoading = ko.observable(false);
        self.loading = {
            inProgress: ko.observable(true),
            loaded: ko.observable(0),
            expected: ko.observable(100)
        };
        self.searchText = ko.observable();
        self.selectedComponent = ko.observable(null);
        self.selectedTopic = ko.observable(null);
        self.topics = ko.observableArray([]);


        /* ====== Computed observables ====== */

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

        self.selectedTopicName = ko.pureComputed(function() {
            var st = self.selectedTopic();
            return ddp.getTerm(st).name;
        });


        /* ====== Public methods ====== */

        self.gotoPage = function(page) {
            self.navigateTo(page.target);
        };

        self.navigateTo = function(component) {
            self.selectedComponent(component);
        };

        self.searchForTerm = function() {
            // TODO: something more constructive than this
            console.log(self.searchText());
        };


        /* ====== Initialisation ====== */

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

        self.selectedTopic.subscribe(function(newValue) {
            self.moduleOfSelectedComponent.notifySubscribers();
        });
    };

    var navigator = new Navigator();

    return navigator;
});
