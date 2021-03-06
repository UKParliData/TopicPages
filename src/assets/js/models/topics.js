define([
    'jquery',
    'knockout',
    '../config',
    '../utils',
    'es5-shim'
], function($, ko, cfg) {
    "use strict";

    var terms = null;
    var termsLookup = {};
    var loaded = false;
    var roots = [];
    var baseTopics = [];
    var selection = ko.observable(null);


    /* ====== Topic class ====== */

    var Topic = function(term) {
        var self = this;

        self.id = parseInt(/[0-9]+$/.exec(term._about)[0], 10);
        self.name = term.prefLabel._value;
        self.uri = term._about;
        self.termCount = term.termCount ? term.termCount : 0;
        self.children = [];
        self.parents = [];

        var parentIDs;

        if (term.broader) {
            if (term.broader.constructor === Array) {
                parentIDs = term.broader
                    .map(function(x) {
                        if (x.hasOwnProperty('_about')) {
                            return x._about;
                        }
                        else if (typeof(x) === 'string') {
                            return x;
                        }
                        else {
                            return null;
                        }
                    });
            }
            else if (term.broader._about) {
                parentIDs = [term.broader._about];
            }
            else if (term.broader.constructor === String) {
                parentIDs = [term.broader];
            }
            else {
                parentIDs = [];
            }
        }
        else {
            parentIDs = [];
        }

        self.setParents = function() {
            for (var i = 0; i < parentIDs.length; i++) {
                var parentID = parentIDs[i];
                var parent = termsLookup[parentID];
                if (parent) {
                    self.parents.push(parent);
                    parent.children.push(self);
                }
            }
            if (!self.parents.length) {
                roots.push(self);
            }
            delete(self.setParents);
        };

        self.select = function() {
            selection(self);
        };
    };


    function readTerm(term) {
        return new Topic(term);
    }


    function loadTerms() {
        var deferred = $.Deferred();

        function loadTermsPage(page) {
            var url = cfg.topics.query;

            $.ajax({
                url: url,
                dataType: 'json',
                method: 'GET',
                timeout: 60000,
                data: {
                    _page: page,
                    _pageSize: cfg.topics.pageSize,
                    _properties: 'termCount,prefLabel,broader',
                    _view: 'basic',
                    'class': 'TPG'
                },
                success: function(data) {
                    terms = terms.concat(data.result.items.map(readTerm));
                    page++;

                    var state = {
                        loaded: terms.length,
                        expected: data.result.totalResults
                    };

                    deferred.notify(state);

                    if (data.result.items.length == cfg.topics.pageSize) {
                        loadTermsPage(page);
                    }
                    else {
                        postProcessTerms();
                        loaded = true;
                        deferred.resolve(terms);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    deferred.reject(textStatus, errorThrown);
                }
            });
        }

        if (terms !== null) {
            deferred.resolve(terms);
        }
        else {
            terms = [];
            loadTermsPage(0);
        }

        return deferred.promise();
    }



    function postProcessTerms() {
        for (var i = 0; i < terms.length; i++) {
            termsLookup[terms[i].uri] =
            termsLookup[terms[i].id] =
                terms[i];
        }

        for (i = 0; i < terms.length; i++) {
            terms[i].setParents();
        }

        baseTopics = roots
            .map(function(x) { return x.children; })
            .reduce(function(a, b) { return a.concat(b); }, []);

        function setLevel(term, level) {
            term.level = level;
            for (var i = 0; i < term.children.length; i++) {
                var child = term.children[i];
                if (!child.hasOwnProperty('level'))
                    setLevel(term.children[i], level + 1);
            }
        }

        for (i = 0; i < roots.length; i++)
            setLevel(roots[i], 0);
    }


    return {
        loadTerms: loadTerms,
        getTerms: function() {
            return terms;
        },
        getTerm: function(id) {
            return termsLookup[id];
        },
        getBaseTopics: function() {
            return baseTopics;
        },
        selection: selection,
        Topic: Topic
    };
});
