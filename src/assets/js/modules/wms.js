define([
    'modules/module',
    'text!../../templates/html-item-linked.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function WmsViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'wms');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item._about,
                date: new Date(item.date._value),
                title: item.title,
                content: item.statementText
            }
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: WmsViewModel
    };
});
