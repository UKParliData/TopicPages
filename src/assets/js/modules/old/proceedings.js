define([
    'modules/module',
    'text!../../templates/html-item-linked.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function ProceedingsViewModel() {
        var self = this;
        module.ModuleViewModel.call(self);

        /* ====== Overridden methods ====== */

        self.dataset = 'proceedings';
        self.args = {
            _view: 'all'
        };


        self.loadItem = function(item) {
            return {
                uri: item.externalLocation,
                date: new Date(item.date._value),
                title: item.title,
                content: item.indexerSummary
            };
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: ProceedingsViewModel
    };
});
