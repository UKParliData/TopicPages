define([
    'jquery',
    'knockout',
    'loader',
    'navigator',
    'text!../../templates/feed.html'
], function($, ko, loader, nav, tpl) {
    "use strict";

    function FeedViewModel() {
        var self = this;
        var topic = nav.selectedTopic();
        var page = 0;
        var loading = false;

        self.items = ko.observableArray([]);

        self.load = function() {
            if (loading) return;
            if (page < 0) return;
            loading = true;
            if (page == 0) {
                nav.componentLoading(true);
            }
            var dataset = 'typesterm/' + topic.id;
            var args = {
                _page: page,
                _pageSize: 50
            };
            loader.load(dataset, args, function(item) {
                var uri = item.type, name = uri.split('#').pop();
                return {
                    title: item.title,
                    date: new Date(item.date._value),
                    type: {
                        uri: uri,
                        name: name,
                        displayName: name.replace(/[A-Z]/g, ' $&').trim()
                    }
                };
            }).done(function(items, pageInfo, version) {
                for (var i = 0; i < items.length; i++) {
                    self.items.push(items[i]);
                }
                if (++page >= pageInfo.totalPages) {
                    page = -1;
                }
            }).always(function() {
                if (nav.componentLoading()) {
                    nav.componentLoading(false);
                }
                loading = false;
            });
        }

        self.load();
    }


    return {
        template: tpl,
        viewModel: FeedViewModel
    };
});
