define([
    'knockout',
    '../config',
    '../loader',
    '../topics',
    'es5-shim'
], function(ko, cfg, loader, topics) {
    "use strict";

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
        self.selectedComponent = ko.observable(null);
        self.selectedTopic = topics.selection;
        self.topics = ko.observableArray([]);
        self.rootTopics = ko.observableArray([]);


        /* ====== Computed observables ====== */

        self.moduleOfSelectedComponent = ko.pureComputed(function() {
            if (!self.selectedComponent()) {
                return 'modules/topicFeed';
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
            var term = self.selectedTopic();
            if (term.constructor !== topics.Topic) {
                term = topics.getTerm(self.selectedTopic());
            }
            return term ? term.name : null;
        });

        self.topLevelView = ko.pureComputed(function() {
            return self.selectedTopic() === null
                ? 'intro-template'
                : 'app-template';
        });

        self.selectorView = ko.pureComputed(function() {
            return self.loading.inProgress()
                ? 'loading-template'
                : 'topic-selector-template';
        });


        /* ====== Public methods ====== */

        self.gotoPage = function(page) {
            self.navigateTo(page.target);
        };

        self.navigateTo = function(component) {
            self.selectedComponent(component);
        };

        self.goToTopicPicker = function() {
            self.selectedTopic(null);
        }


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
