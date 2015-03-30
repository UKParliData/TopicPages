define([
    'jquery',
    'knockout',
    'loader',
    'navigator',
    'text!../../templates/feed.html',
    'utils'
], function($, ko, loader, nav, tpl) {
    "use strict";

    var itemSources = {
        ResearchBriefing: {
            endpoint: 'briefingpapers/id/{0}',
            args: {},
            transform: function(item) {
                return {
                    heading: item.title,
                    text: item.abstract._value,
                    url: item.internalLocation
                };
            }
        },

        WrittenMinisterialStatement: {
            endpoint: 'about',
            args: function(item) {
                return { resource: item._about };
            },
            transform: function(item) {
                return {
                    heading: item.title,
                    html: item.statementText,
                    url: item._about
                };
            }
        },

        Proceeding: {
            endpoint: 'about',
            args: function(item) {
                return { resource: item._about };
            },
            transform: function(item) {
                return {
                    heading: item.title,
                    text: '',
                    url: item.externalLocation
                };
            }
        },

        EarlyDayMotion: {
            endpoint: 'edms/{0}',
            args: {},
            transform: function(item) {
                return {
                    heading: item.title,
                    text: item.motionText,
                    url: null
                };
            }
        },

        HouseOfCommonsPaper: {
            endpoint: 'about',
            args: function(item) {
                return { resource: item._about };
            },
            transform: function(item) {
                return {
                    heading: item.title,
                    text: '',
                    url: item.internalLocation
                };
            }
        }
    };

    function FeedItemViewModel(item) {
        var self = this;
        var typeUri = item.type, typeName = typeUri.split('#').pop();
        var id = item._about.match(/[0-9]+/g).pop();

        self.title = item.title;
        self.date = new Date(item.date._value);
        self.type = {
            uri: typeUri,
            name: typeName,
            displayName: typeName.replace(/[A-Z]/g, ' $&').trim()
        };

        var loading = false;
        var loaded = false;

        self.content = {
            visible: ko.observable(false),
            heading: ko.observable(''),
            text: ko.observable(''),
            html: ko.observable(''),
            url: ko.observable('')
        };

        self.load = function() {
            if (loading) return;
            if (loaded) {
                self.content.visible(!self.content.visible());
            }
            else if (itemSources.hasOwnProperty(self.type.name)) {
                loading = true;
                var source = itemSources[self.type.name];
                var endpoint = source.endpoint.format(id);
                var args = source.args;
                if (typeof args === 'function') {
                    args = args(item);
                }

                loader.load(endpoint, args, source.transform)
                    .done(function(items, pageInfo, version) {
                        loaded = true;
                        var item = items.pop();
                        self.content.heading(item.heading);
                        self.content.text(item.text);
                        self.content.html(item.html);
                        self.content.url(item.url);
                        self.content.visible(true);
                    })
                    .always(function() {
                        loading = false;
                    });
            }
        };
    }


    function FeedViewModel() {
        var self = this;
        var topic = nav.selectedTopic();
        var page = 0;
        var loading = false;

        self.items = ko.observableArray([]);
        var itemTypes = { };
        self.itemTypes = ko.observableArray([]);

        self.itemType = ko.observable(false);

        self.filteredItems = ko.pureComputed(function() {
            var itemType = self.itemType();
            if (!itemType || !itemType.name) {
                return self.items();
            }
            else {
                return self.items().filter(function(x) {
                    return x.type.name == itemType.name;
                });
            }
        });

        self.load = function() {
            if (loading || page < 0) return;
            loading = true;
            if (page == 0) {
                nav.componentLoading(true);
            }
            var endpoint = 'typesterm/' + topic.id;
            var args = {
                _page: page,
                _pageSize: 500,
                _sort: '-date'
            };
            loader.load(endpoint, args, function(item) {
                return new FeedItemViewModel(item);
            }).done(function(items, pageInfo, version) {

                for (var i = 0; i < items.length; i++) {
                    self.items.push(items[i]);
                    var itemType = items[i].type;
                    if (!itemTypes.hasOwnProperty(itemType.name)) {
                        itemTypes[itemType.name] = itemType;
                        self.itemTypes.push(itemType);
                    }
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

        self.timeline = function() {
            return self.filteredItems().map(function(x, index, array) {
                return {
                    id: x.id,
                    content: '<div class="event-title">' + x.title + '</div>' +
                        '<div class="event-meta">' +
                            '<span class="event-type">' + x.type.displayName + '</span>' +
                            ' - ' +
                            '<span class="event-date">' + x.date.toDateString() + '</span>' +
                        '</div>',
                    className: x.type.name,
                    start: x.date
                };
            });
        };

        self.load();
    }


    return {
        template: tpl,
        viewModel: FeedViewModel
    };
});
