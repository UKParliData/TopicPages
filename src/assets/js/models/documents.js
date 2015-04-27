/* ====== Documents module ====== */

/**
 * This module contains the definitions and transformation functions for per-topic loading
 * of the datasets.
 */

define([
    'jquery',
    'knockout',
    '../config',
    '../loader'
], function($, ko, config, loader) {
    "use strict";

    var sources = {};


    function Document(item) {
        var self = this;

        self.visible = ko.observable(false);
        self.text = ko.pureComputed(function() { return self.content; });
        self.html = '';

        self.load = function() {
            self.visible(!self.visible());
        };
    }


    /* ====== Briefing Papers ====== */

    function BriefingPaper(item) {
        var self = this;
        Document.call(this, item);

        self.type = sources.briefingPapers;
        self.id = item._about;
        self.uri = item.contentLocation;
        self.date = new Date(item.date._value);
        self.title = (item.identifier && item.identifier._value ? item.identifier._value + ': ' : '')
            + item.title;
        self.content = item.description[0];
    }


    sources.briefingPapers = {
        title: 'Briefing Papers',
        name: 'briefingPaper',
        displayName: 'Briefing Paper',
        aggregate : {
            dataset: 'briefingpapers',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return new BriefingPaper(item);
            }
        }

    };


    /* ====== EDMs ====== */

    function EDM(item) {
        var self = this;
        Document.call(this, item);

        self.type = sources.edms,
        self.id = item._about,
        self.uri = item.externalLocation,
        self.title = (item.edmNumber && item.edmNumber._value
                ? 'EDM ' + item.edmNumber._value + ' - '  : ''
            )
            + item.title,
        self.date = new Date(item.dateTabled._value),
        self.content = item.motionText;
    }


    sources.edms = {
        title: 'EDMs',
        name: 'edm',
        displayName: 'Early Day Motion',
        aggregate : {
            dataset: 'edms',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return new EDM(item);
            }
        }
    };


    /* ====== Papers Laid ====== */


    function PaperLaid(item) {
        var self = this;
        Document.call(self, item);

        self.type = sources.papersLaid;
        self.id = item._about;
        self.uri = item.internalLocation;
        self.date = new Date(item.dateLaid._value);
        self.title = item.title;
        self.content = null;
    }


    sources.papersLaid = {
        title: 'Papers Laid',
        name: 'paperLaid',
        displayName: 'Paper Laid',
        aggregate : {
            dataset: 'paperslaid',
            args: {
                'exists-topic': true,
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return new PaperLaid(item);
            }
        }
    };


    /* ====== Proceedings - Debates ====== */

    function ProceedingDebate(item) {
        var self = this;
        Document.call(self, item);

        self.type = sources.proceedingsDebates;
        self.id = item._about;
        self.uri = item.externalLocation;
        self.date = new Date(item.date._value);
        self.title = item.title;
        self.content = item.indexerSummary;
    }

    sources.proceedingsDebates = {
        title: 'Proceedings - Debates',
        name: 'proceedings-debate',
        displayName: 'Proceedings - Debate',
        aggregate: {
            dataset: 'proceedingsdebates',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return new ProceedingDebate(item);
            }
        }
    };


    /* ====== Proceedings - Statements ====== */

    function ProceedingStatement(item) {
        var self = this;
        Document.call(self, item);

        self.type = sources.proceedingsStatements;
        self.id = item._about;
        self.uri = item.externalLocation;
        self.date = new Date(item.date._value);
        self.title = item.title;
        self.content = item.indexerSummary;
    }

    sources.proceedingsStatements = {
        title: 'Proceedings - Statements',
        name: 'proceedings-statement',
        displayName: 'Proceedings - Statement',
        aggregate: {
            dataset: 'proceedingsstatements',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return new ProceedingStatement(item);
            }
        }
    };


    /* ====== Proceedings - Questions ====== */

    function ProceedingQuestion(item) {
        var self = this;
        Document.call(self, item);

        self.type = sources.proceedingsQuestions;
        self.id = item._about;
        self.uri = item.externalLocation;
        self.date = new Date(item.date._value);
        self.title = item.title;
        self.content = item.indexerSummary;
    }

    sources.proceedingsQuestions = {
        title: 'Proceedings - Questions',
        name: 'proceedings-question',
        displayName: 'Proceedings - Question',
        aggregate: {
            dataset: 'proceedingsquestions',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return new ProceedingStatement(item);
            }
        }
    };



    /* ====== Select Committee Reports ====== */

    function SelectCommitteeReport(item) {
        var self = this;
        Document.call(self, item);

        self.type = sources.selectCommitteeReports;
        self.id = item._about;
        self.uri = item.location;
        self.date = new Date(item.date._value);
        self.title = item.title;
        self.content = null;
    }


    sources.selectCommitteeReports = {
        title: 'Select Committee Reports',
        name: 'select-committee-report',
        displayName: 'Select Committee Report',
        aggregate: {
            dataset: 'scrparlisearch',
            args: {
                _sort: '-date',
                _view: 'all'
            },
            transform: function(item) {
                return new SelectCommitteeReport(item);
            }
        }
    };

    /* ====== Written Ministerial Statements ====== */

    function WrittenMinisterialStatement(item) {
        var self = this;
        Document.call(self, item);

        self.type = sources.wms;
        self.id = item._about;
        self.uri = item._about;
        self.date = new Date(item.date._value);
        self.title = item.title;
        self.content = item.statementText;

        self.text = '';
        self.html = self.content;
    }

    sources.wms = {
        title: 'Written Ministerial Statements',
        name: 'wms',
        displayName: 'Written Ministerial Statement',
        aggregate: {
            dataset: 'writtenministerialstatements',
            args : {
                _sort: '-date'
            },
            transform: function (item) {
                return new WrittenMinisterialStatement(item);
            }
        }
    };


    sources.all = [
        sources.briefingPapers,
        sources.edms,
        sources.papersLaid,
        sources.proceedingsDebates,
        sources.proceedingsQuestions,
        sources.proceedingsStatements,
        sources.selectCommitteeReports,
        sources.wms
    ];


    /* ====== FeedLoader class ====== */

    /**
     * Loads all the items for a given topic.
     *
     * @param {array} aSources
     *  Optional: The sources from which we wish to load topic data.
     *  If not specified, all sources will be loaded.
     * @param {module} loaderModule
     *  Optional: the loader module, or a mock thereof.
     *  If not specified, the real loader module will be used.
     */

    function FeedLoader(aSources, aLoader) {
        var self = this,
            pageNumber,
            activeSources,
            loaderModule = aLoader ? aLoader : loader,
            topic,
            loadedItems = {};

        self.items = ko.observableArray([]);
        self.loading = ko.observable(false);


        function reset(aTopic) {
            pageNumber = 0;
            activeSources = (aSources ? aSources : sources.all).slice(0);
            topic = aTopic;
            self.items.removeAll();
        }


        /* ====== load method ====== */

        /**
         * Loads in the next batch of items.
         *
         * @param {Topic} aTopic
         *  The topic to be loaded. If this is the same as the currently active topic, or if it is
         *  unspecified, the next batch of items will be loaded. If it is different, the collection
         *  will be reset and the new topic will be loaded from the start.
         * @returns {Promise}
         *  A promise representing the queries fetching the next batch of items.
         *  On success, the promise receives this.
         */

        self.load = function(aTopic) {
            if (aTopic && aTopic !== topic) reset(aTopic);

            if (!activeSources.length) return;
            var deferred = $.Deferred();
            self.loading(true);
            var s = activeSources.map(function(x) { return x.aggregate; });

            var requiredTopics = [];

            function pushTopic(topic) {
                requiredTopics.push(topic);
                for (var i = 0; i < topic.children.length; i++)
                    pushTopic(topic.children[i]);
            }
            pushTopic(aTopic);

            s = s.reduce(function(sources, nextSource) {
                return sources.concat(requiredTopics.map(function(topic) {
                    var result = $.extend({}, nextSource);
                    result.args = $.extend({}, result.args, {
                        topic: topic.uri
                    });
                    return result;
                }));
            }, []);

            loaderModule.loadMultiple(s, {
                _page: pageNumber,
                _pageSize: config.pageSize
            })
            .progress(function(items) {
                for (var j = 0; j < items.length; j++) {
                    var ins = items[j];
                    if (!loadedItems.hasOwnProperty(ins.id)) {
                        var i = 0;
                        var si = self.items(), sil = si.length;
                        while (i < sil && si[i].date > ins.date) i++;
                        self.items.splice(i, 0, ins);
                        loadedItems[ins.id] = 1;
                    }
                    else {
                        loadedItems[ins.id]++;
                    }
                }
            })
            .done(function(items, pages, version) {
                pageNumber++;

                for (var i = pages.length - 1; i >= 0; i--) {
                    if (pageNumber >= pages[i].totalPages) {
                        activeSources.splice(i, 1);
                    }
                }

                if (activeSources.length) {
                    self.load(aTopic);
                }
                else {
                    deferred.resolveWith(self);
                }
            })
            .fail(function() {
                deferred.rejectWith.apply(self, arguments);
            })
            .always(function() {
                self.loading(false);
            });

            return deferred.promise();
        };

        self.items.extend({rateLimit: {timeout: 50, method: 'notifyWhenChangesStop'}});
    }


    return {
        sources: sources,
        FeedLoader: FeedLoader
    };
});
