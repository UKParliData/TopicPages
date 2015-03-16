define([
    'modules/module',
    'text!../../templates/briefing-papers.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function BriefingPaperViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'briefingPapers');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item._about,
                date: new Date(item.date._value),
                description: item.description[0],
                identifier: item.identifier._value,
                title: item.title,
                topics: item.topic.map(function(t) {
                    return {
                        uri: t._about,
                        title: t.prefLabel._value
                    };
                }),
                type: item.type
            }
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: BriefingPaperViewModel
    };
});
