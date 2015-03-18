define([
    'modules/module',
    'text!../../templates/html-item-linked.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function PapersLaidViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'papersLaid');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item.internalLocation,
                date: new Date(item.dateLaid._value),
                title: item.title,
                content: null
            };
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: PapersLaidViewModel
    };
});
