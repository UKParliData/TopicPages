define([
    'jquery',
    'config',
    'es5-shim',
    'utils'
], function($, cfg) {

    /* ====== loadTopics ====== */

    var terms = null;
    var termsLookup = {};
    var loaded = false;

    function readTerm(term) {
        return {
            id: parseInt(/[0-9]+$/.exec(term._about)[0], 10),
            name: term.prefLabel._value,
            uri: term._about
        };
    }


    function loadTerms() {
        var deferred = $.Deferred();

        function loadTermsPage(page) {
            var url = cfg.topics.query.format(page, cfg.topics.pageSize);

            $.ajax({
                url: url,
                dataType: 'json',
                method: 'GET',
                timeout: 60000,
                success: function(data) {
                    terms = terms.concat(data.result.items.map(readTerm));
                    page++;

                    var state = {
                        loaded: terms.length,
                        expected: data.result.totalResults,
                    };

                    deferred.notify(state);

                    if (data.result.items.length == cfg.topics.pageSize) {
                        loadTermsPage(page);
                    }
                    else {
                        for (var i = 0; i < terms.length; i++) {
                            termsLookup[terms[i].uri] =
                            termsLookup[terms[i].id] =
                                terms[i];
                        }
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

    return {
        loadTerms: loadTerms,
        getTerms: function() {
            if (terms == null) {
                throw 'Taxonomy has not yet been loaded.';
            }
            return terms;
        },
        getTerm: function(id) {
            return termsLookup[id];
        }
    };
});