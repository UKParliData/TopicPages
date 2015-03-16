define([
    'modules/module',
    'text!../../templates/papers-laid.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function PapersLaidViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'papersLaid');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item._about,
                dateLaid: new Date(item.dateLaid._value),
                department: item.departmentPrinted._value,
                member: item.memberPrinted._value,
                dateModified: new Date(item.modified._value),
                paperNumber: item.paperNumber._value,
                parliamentNumber: parseInt(item.parliamentNumber._value, 10),
                session: item.session[0],
                sessionNumber: parseInt(item.sessionNumber._value),
                title: item.title,
                withdrawn: item.withdrawn._value == 'true',
                type: item.type
            }
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: PapersLaidViewModel
    };
});
