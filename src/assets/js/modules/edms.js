define([
    'modules/module',
    'text!../../templates/edms.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function EdmsViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'edms');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item._about,
                date: new Date(item.dateTabled._value),
                motionText: item.motionText,
                externalUrl: item.externalLocation,
                edmNumber: item.edmNumber._value,
                title: item.title,
                sponsors: item.sponsors.map(function(s, ix) {
                    return {
                        uri: s._about,
                        name: item.sponsorPrinted[ix]
                    };
                }),
                topics: item.topic,
                type: item.type
            }
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: EdmsViewModel
    };
});
