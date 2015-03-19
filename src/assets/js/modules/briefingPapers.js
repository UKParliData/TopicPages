define([
    'modules/module',
    'text!../../templates/html-item-linked.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function BriefingPapersViewModel() {
        var self = this;
        module.LegacyModuleViewModel.call(self, 'briefingPapers');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item.contentLocation,
                date: new Date(item.date._value),
                title: (item.identifier && item.identifier._value ? item.identifier._value + ': ' : '')
                    + item.title,
                content: item.description[0]
            }
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: BriefingPapersViewModel
    };
});
