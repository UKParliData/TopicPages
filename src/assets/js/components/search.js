/* ====== Search for a topic by subject ====== */

/**
 * The user types a subject into a search box and a list of matching topics
 * is shown, dynamically updating. Clicking on one of these topics then takes
 * the user to the relevant topic view.
 */
define([
    'text!../../templates/search.html',
    'knockout',
    '../loader',
    '../models/topics'
], function(tpl, ko, loader, topics) {
    "use strict";

    var Topic = function(data) {
        var self = this;
        self.title = data.prefLabel._value;
        self.id = data._about;
        self.select = function() {
            var topic = topics.getTerm(self.id);
            if (topic) {
                topics.selection(topic);
            }
        };
    };

    var Subject = function(item) {
        var self = this;
        self.title = item.prefLabel._value;
        self.topics = item.mappedTopic.map(function(x) {
            return new Topic(x);
        });
    };

    function SearchViewModel() {
        var self = this;

        var queryInProgress = null;
        var pendingQuery = null;

        self.items = ko.observableArray();
        self.searchText = ko.observable('');

        var doSearch = function(query) {
            if (queryInProgress !== null) {
                pendingQuery = (query !== queryInProgress) ? query : null;
                return;
            }
            queryInProgress = query;

            var args = {
                _search: query + '*',
                'exists-mappedTopic': true
            };

            var transform = function(item) {
                return new Subject(item);
            };

            loader.load('terms', args, transform)
                .done(function(items, page, version) {
                    queryInProgress = null;
                    if (pendingQuery !== null) {
                        var q = pendingQuery;
                        pendingQuery = null;
                        doSearch(q);
                    }

                    self.items(items);
                });
        };

        var searchSubscription = self.searchText.subscribe(doSearch);
        self.dispose = function() {
            searchSubscription.dispose();
        };
    }


    return {
        viewModel: SearchViewModel,
        template: tpl
    };
});
