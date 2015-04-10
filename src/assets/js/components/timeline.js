define([
    'text!../../templates/timeline.html',
    'knockout',
    '../models/documents'
], function(tpl, ko, documents) {
    "use strict";

    /* ====== TimelineViewModel class ====== */

    function TimelineViewModel(topicViewModel) {
        var self = this;

        self.timeline = ko.pureComputed(function() {
            return topicViewModel.items().map(function(x, index, array) {
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
        });


    }

    return {
        viewModel: TimelineViewModel,
        template: tpl
    }
});
