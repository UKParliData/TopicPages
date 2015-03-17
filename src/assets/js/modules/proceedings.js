define([
    'modules/module',
    'text!../../templates/proceedings.html',
    'utils'
], function(module, tpl) {
    "use strict";

    function ProceedingsViewModel() {
        var self = this;
        module.ModuleViewModel.call(self, 'proceedings');

        /* ====== Overridden methods ====== */

        self.loadItem = function(item) {
            return {
                uri: item._about,
                bibliographicCitation: item.bibliographicCitation,
                date: new Date(item.date._value),
                dateFirstIndexed: new Date(item.dateFirstIndexed),
                dateLastModified: new Date(item.dateLastModified),
                endColRef: item.endColRef,
                externalLocation: item.externalLocation,
                firstIndexedBy: item.firstIndexedBy,
                humanIndexable: item.humanIndexable._value == 'true',
                identifier: item.identifier._value,
                indexStatus: item.indexStatus,
                indexerSummary: item.indexerSummary,
                lastModifiedBy: item.lastModifiedBy,
                published: item.published._value == 'true',
                searchDate: new Date(item.searchDate),
                session: item.session[0],
                sittingDate: new Date(item.sittingDate),
                startColRef: item.startColRef,
                statisticsIndicated: item.statisticsIndicated,
                status: item.status,
                title: item.title,
                volume: parseInt(item.volume._value, 10)
            }
        };

        self.load(0);
    }

    return {
        template: tpl,
        viewModel: ProceedingsViewModel
    };
});
