define(['jquery', 'es5-shim'], function($) {
    /**
     * The base URL for the DDP ELDA endpoint
     */
    var ddpBase = 'http://lda.data.parliament.uk/'
    var termClass = 'ID';
    var termPageSize = 383;

    /* ====== loadTopics ====== */

    var terms = null;
    var loaded = false;

    function readTerm(term) {
        return {
            id: parseInt(/[0-9]+$/.exec(term._about)[0], 10),
            name: term.prefLabel._value
        };
    }


    function loadTerms() {
        var deferred = $.Deferred();

        function loadTermsPage(page) {
            var url = ddpBase
                + 'terms.json?_pageSize=' + termPageSize
                + '&_page=' + page
                + '&class=' + termClass;

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

                    if (data.result.items.length == termPageSize) {
                        loadTermsPage(page);
                    }
                    else {
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
        }
    };
});
