define([
    'knockout',
    'config',
    'loader',
    'topics',
    'es5-shim'
], function(ko, cfg, loader, topics) {

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
        self.rootTopics = ko.observableArray([]);


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
            var term = topics.getTerm(self.selectedTopic());
            return term ? term.name : null;
        });

        self.topLevelView = ko.pureComputed(function() {
            if (self.loading.inProgress()) {
                return 'loading-template';
            }
            else {
                return 'app-template';
            }
        });


        /* ====== Public methods ====== */

        self.gotoPage = function(page) {
            self.navigateTo(page.target);
        };

        self.navigateTo = function(component) {
            self.selectedComponent(component);
        };

        self.searchForTerm = function() {
            var term = self.searchText();
            var topics = {
                dataset: 'terms',
                args: {
                    _properties: 'prefLabel',
                    'class': 'TPG',
                    _view: 'basic',
                    _search: term
                },
                transform: function(entry) {
                    return {
                        uri: entry._about,
                        name: entry.prefLabel._value
                    };
                }
            };

            var terms = {
                dataset: 'terms',
                args: {
                    'exactMatch.class': 'TPG',
                    _properties: 'prefLabel,exactMatch.prefLabel,exactMatch.class',
                    _view: 'basic',
                    _search: term
                },
                transform: function(entry) {
                    return entry.exactMatch
                        .filter(function(x) { return x['class'] === 'TPG'; })
                        .map(function(x) { return {
                            uri: x._about,
                            name: x.prefLabel._value
                        }; });
                }
            };

            loader.loadMultiple([topics, terms])
                .done(function(items, version) {
                    console.log(items, version);
                });
        };


        /* ====== Initialisation ====== */

        for (var key in cfg.modules) {
            if (cfg.modules.hasOwnProperty(key)) {
                var css = {
                    selected: (function(k) {
                        return ko.pureComputed(function() {
                            return k === self.selectedComponent();
                        });
                    })(key)
                };
                css['nav-link-' + key] = true;

                self.pages = self.pages.concat({
                    pageTitle: cfg.modules[key].title,
                    target: key,
                    css: css
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
