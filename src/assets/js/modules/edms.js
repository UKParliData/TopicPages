define([
    'modules/module',
    'text!../../templates/html-item-linked.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function EdmsViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'edms');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item.externalLocation,
                title: (item.edmNumber && item.edmNumber._value
                        ? 'EDM ' + item.edmNumber._value + ' - ' : ''
                    )
                    + item.title,
                date: new Date(item.dateTabled._value),
                content: item.motionText
            };
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: EdmsViewModel
    };
});
