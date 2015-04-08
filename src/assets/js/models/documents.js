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


    /* ====== Briefing Papers ====== */

    sources.briefingPapers = {
        title: 'Briefing Papers',
        aggregate : {
            dataset: 'briefingpapers',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return {
                    type: sources.briefingPapers,
                    uri: item.contentLocation,
                    date: new Date(item.date._value),
                    title: (item.identifier && item.identifier._value ? item.identifier._value + ': ' : '')
                        + item.title,
                    content: item.description[0]
                };
            }
        }
    };


    /* ====== EDMs ====== */

    sources.edms = {
        title: 'EDMs',
        aggregate : {
            dataset: 'edms',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return {
                    type: sources.edms,
                    uri: item.externalLocation,
                    title: (item.edmNumber && item.edmNumber._value
                            ? 'EDM ' + item.edmNumber._value + ' - ' : ''
                        )
                        + item.title,
                    date: new Date(item.dateTabled._value),
                    content: item.motionText
                };
            }
        }
    };


    /* ====== Papers Laid ====== */

    sources.papersLaid = {
        title: 'Papers Laid',
        aggregate : {
            dataset: 'paperslaid',
            args: {
                'exists-topic': true,
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return {
                    type: sources.papersLaid,
                    uri: item.internalLocation,
                    date: new Date(item.dateLaid._value),
                    title: item.title,
                    content: null
                };
            }
        }
    };


    /* ====== proceedings ====== */

    sources.proceedings = {
        title: 'Proceedings',
        aggregate: {
            dataset: 'proceedings',
            args: {
                _view: 'all',
                _sort: '-date'
            },
            transform: function(item) {
                return {
                    type: sources.proceedings,
                    uri: item.externalLocation,
                    date: new Date(item.date._value),
                    title: item.title,
                    content: item.indexerSummary
                };
            }
        }
    };


    /* ====== Written Ministerial Statements ====== */

    sources.wms = {
        title: 'Written Ministerial Statements',
        aggregate: {
            dataset: 'writtenministerialstatements',
            args : {
                _sort: '-date'
            },
            transform: function (item) {
                return {
                    type: sources.wms,
                    uri: item._about,
                    date: new Date(item.date._value),
                    title: item.title,
                    content: item.statementText
                };
            }
        }
    };


    sources.all = [
        sources.briefingPapers,
        sources.edms,
        sources.papersLaid,
        sources.proceedings,
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
            topic;

        self.items = ko.observableArray([]);
        self.items.extend({rateLimit: {timeout: 50, method: 'notifyWhenChangesStop'}});
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
            loaderModule.loadMultiple(s, {
                _page: pageNumber,
                _pageSize: config.pageSize,
                topic: topic.uri
            })
            .progress(function(items) {
                for (var j = 0; j < items.length; j++) {
                    var i = 0;
                    var ins = items[j];
                    var si = self.items(), sil = si.length;
                    while (i < sil && si[i].date > ins.date) i++;
                    self.items.splice(i, 0, ins);
                }
            })
            .done(function(items, pages, version) {
                pageNumber++;

                for (var i = pages.length - 1; i >= 0; i--) {
                    if (pageNumber >= pages[i].totalPages) {
                        activeSources.splice(i, 1);
                    }
                }

                deferred.resolveWith(self);
            })
            .fail(function() {
                deferred.rejectWith.apply(self, arguments);
            })
            .always(function() {
                self.loading(false);
            });

            return deferred.promise();
        };
    }

    return {
        sources: sources,
        FeedLoader: FeedLoader
    };
});
