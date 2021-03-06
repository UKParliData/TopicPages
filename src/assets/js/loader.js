define([
    'jquery',
    './config',
    './app',
    'es5-shim',
    './utils'
], function($, cfg, app) {
    "use strict";

    /* ====== load function ====== */

    /**
     * Loads a dataset from Elda
     *
     * @param {string} dataset
     *  The dataset to query.
     * @param {object} args
     *  The query string arguments with which to query the dataset.
     * @param {function} transform
     *  Optional - a method to call to transform each entry returned by the
     *  dataset into a simpler representation for use by the application.
     *  This may either return a single object or an array; in the latter case,
     *  the array will be concatenated onto the end result.
     * @returns
     *  A promise encapsulating the request and response.
     *  If this is successful, the done handlers will be called with the
     *  following parameters:
     *  - items: an array of items, processed by the transform function if
     *      present
     *  - page: an object containing paging information as follows:
     *      - itemsPerPage: the number of items per page
     *      - page: the zero-based page number
     *      - startIndex: the one-based index of the first result on the page
     *      - totalResults: the total number of results in the query
     *      - totalPages: the total number of pages in the query.
     *  - version: the DDP API version
     *  If it is unsuccessful, the fail handlers will be called with the same
     *  parameters as the jQuery.ajax fail handlers.
     */

    function load(dataset, args, transform) {
        app.loading(app.loading() + 1);

        var deferred = $.Deferred();

        $.ajax({
            url: cfg.ddpBase + dataset + '.json',
            dataType: 'json',
            method: 'GET',
            timeout: cfg.timeout,
            data: args
        })
        .done(function(data) {
            var items;
            var dataItems, page;

            if (data.result.hasOwnProperty('items')) {
                dataItems = data.result.items;
                page = {
                    itemsPerPage: data.result.itemsPerPage,
                    page: data.result.page,
                    startIndex: data.result.startIndex,
                    totalResults: data.result.totalResults,
                    totalPages: Math.ceil(data.result.totalResults / data.result.itemsPerPage)
                };
            }
            else {
                dataItems = [data.result.primaryTopic];
                page = null;
            }

            if (typeof(transform) === 'function') {
                items = [];
                for (var i = 0; i < dataItems.length; i++) {
                    items = items.concat(transform(dataItems[i]));
                }
            }
            else {
                items = data.result.items;
            }

            deferred.resolve(items, page, data['DDP API Version']);
            app.loading(app.loading() - 1);
        })
        .fail(function() {
            deferred.reject.apply(this, arguments);
            app.loading(app.loading() - 1);
        });

        return deferred.promise();
    }


    /* ====== loadMultiple function ====== */

    /**
     * Loads multiple datasets from Elda and collates the results.
     *
     * @param {array} sources
     *  An array of objects, each containing the parameters to pass to the load
     *  function above.
     * @returns
     *  A promise encapsulating the requests and responses.
     *  If all calls are successful, the done handlers will be called with the
     *  following parameters:
     *  - items: an array of items, processed by the transform function if
     *      present
     *  - pages: an array of paging information objects, in an order corresponding
     *      to the entries in the sources array.
     *  - version: the DDP API version
     *  If any of the calls are unsuccessful, the fail handlers will be called
     *  with the same parameters as the jQuery.ajax fail handlers.
     *  Note that this differs form the load() method above in that no paging
     *  data is returned.
     *
     *  On each successful call, a progress notification is issued with the arguments
     *  passed to the done callback of the individual notification.
     */

    function loadMultiple(sources, extend) {
        var deferred = $.Deferred();

        var requests = sources.map(function(source) {
            var args = extend ? $.extend({}, source.args, extend) : source.args;
            return load(source.dataset, args, source.transform)
                .done(function() {
                    deferred.notify.apply(this, arguments);
                });
        });


        $.when.apply(undefined, requests)
            .done(function() {
                var args = sources.length > 1 ? arguments : [ arguments ];
                var items = [];
                var pages = [];
                var version = false;
                for (var i = 0; i < args.length; i++) {
                    items = items.concat(args[i][0]);
                    pages.push(args[i][1]);
                    if (version === false) {
                        version = args[i][2];
                    }
                }
                deferred.resolve(items, pages, version);
            })
            .fail(function() {
                var args = sources.length > 1 ? arguments : [ arguments ];
                deferred.reject.apply(this, args);
            });
        return deferred.promise();
    }


    return {
        load: load,
        loadMultiple: loadMultiple
    };
});
