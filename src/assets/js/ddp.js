define(['jquery'], function($) {
    /**
     * The base URL for the DDP ELDA endpoint
     */
    var ddpBase = 'http://lda.data.parliament.uk/'
    var termClass = 'ID';
    var termPageSize = 383;

    /* ====== loadTopics ====== */

    var terms = null;

    function getTerms(doneCallback, progressCallback) {

        var deferred = $.Deferred();

        if (!progressCallback) progressCallback = function() {};
        if (!doneCallback) doneCallback = function() {};

        function loadTerms(page) {
            var url = ddpBase
                + 'terms.json?_pageSize=' + termPageSize
                + '&_page=' + page
                + '&class=' + termClass;

            $.ajax({
                url: url,
                dataType: 'json',
                success: function(data) {
                    terms = terms.concat(data.result.items);
                    page++;

                    var state = {
                        loaded: terms.length,
                        expected: data.result.totalResults,
                    };

                    progressCallback(state);
                    deferred.notify(state);

                    if (data.result.items.length == termPageSize) {
                        loadTerms(page);
                    }
                    else {
                        doneCallback(terms);
                        deferred.resolve(terms);
                    }
                }
            });
        }

        if (terms !== null) {
            doneCallback(terms);
            deferred.resolve(terms);
        }
        else {
            terms = [];
            loadTerms(0);
        }

        return deferred.promise();
    }

    return {
        getTerms: getTerms
    };
});
