/* ====== Bar Chart module ====== */

/**
 * Displays the retrieved data as a bar chart.
 */
define([
    'text!../../templates/barChart.html',
    'knockout',
    '../models/documents'
], function(tpl, ko, documents) {
    "use strict";

    var sources = documents.sources.all;

    var Month = function(date) {
        var self = this;

        self.year = date.getFullYear();
        self.month = date.getMonth() + 1;
        self.key = self.year.toString(10) + '-' +
            (self.month < 10 ? '0' : '') +
            self.month.toString(10);

        var monthName = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ][date.getMonth()];

        var str = monthName + ' ' + self.year.toString(10);

        self.toString = function() {
            return str;
        };
    };


    var MonthViewModel = function(month) {
        var self = this;

        self.month = month;

        var documents = {};
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            documents[source.title] = [];
        }

        self.addDocument = function(document) {
            var type = document.type.title;
            var docs;

            if (!documents.hasOwnProperty(type)) {
                documents[type] = [];
            }
            else {
                docs = documents[type];
            }
            docs.push(document);
        };

        self.getCounts = function() {
            return sources.map(function(source) {
                var docs = documents[source.title];
                if (docs) {
                    return { source: source, count: docs.length };
                }
                else {
                    return { source: source, count: 0 };
                }
            });
        };
    };


    var BarChartViewModel = function(topicViewModel) {
        var self = this;

        self.byMonth = ko.pureComputed(function() {
            var months = { },
                monthArr = [],
                items = topicViewModel.filteredItems(),
                i, monthKey, month, item;

            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (item.type.selected() && !isNaN(item.date)) {
                    monthKey = new Month(item.date);
                    if (!months.hasOwnProperty(monthKey.key)) {
                        month = new MonthViewModel(monthKey);
                        months[monthKey.key] = month;
                        monthArr.push(month);
                    }
                    else {
                        month = months[monthKey.key];
                    }
                    month.addDocument(item);
                }
            }

            monthArr.sort(function(a, b) {
                return (a.month.year < b.month.year) ? -1
                    : (a.month.year > b.month.year) ? 1
                    : (a.month.month < b.month.month) ? -1
                    : (a.month.month > b.month.month) ? 1
                    : 0;
            });

            return monthArr;
        });

        self.graphGroups = ko.pureComputed(function() {
            return sources.map(function(source, index) {
                return {
                    id: index,
                    content: source.title,
                    className: 'graphGroup' + index.toString(10),
                    name: source.name
                };
            });
        });

        self.graphItems = ko.pureComputed(function() {
            return self.byMonth().reduce(function(result, month) {
                var x = month.month.key;
                var counts = month.getCounts();

                var items = counts.map(function(source) {
                    return { x: x, y: source.count, group: sources.indexOf(source.source) };
                });
                return result.concat(items);
            }, []);
        });

        self.selectBar = function (args) {
            if (
                (args.what === "background")
                && (args.event.target.attributes["class"])
                && (args.event.target.attributes["class"].nodeValue.indexOf("graphGroup") === 0)
            ) {
                var index = args.event.target.attributes["class"].nodeValue.split(" ")[0].replace("graphGroup", "")*1;
                var date = args.time;
                var year = date.getFullYear();
                var month = date.getMonth();
                if (date.getDate() > 15) {
                    month += 1;
                    if (month > 11) {
                        month = 0;
                        year++;
                    }
                }
                var startDate = new Date(year, month, 1);
                var endDate = new Date(year, month+1, 0, 23, 59, 59);
                var documentType = ko.utils.arrayFirst(self.graphGroups(), function (item) {
                    return item.id == index;
                });

                topicViewModel.documentType(documentType.name);
                topicViewModel.startDate(startDate);
                topicViewModel.endDate(endDate);
                topicViewModel.view(topicViewModel.views[2]);
            }
        };

        self.init = function () {
            topicViewModel.reset();
        };

        self.init();
    };

    return {
        viewModel: BarChartViewModel,
        template: tpl
    };
});
