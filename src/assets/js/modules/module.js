define([
    'jquery',
    'knockout',
    'config',
    'navigator',
    'utils'
], function($, ko, cfg, nav) {

    function _abstract() {
        throw 'This method has not been defined in the derived class.';
    }

    /* ====== Module class definition ====== */

    function ModuleViewModel(configName) {
        var self = this;
        var config = cfg[configName];
        var topic = nav.selectedTopic();

        /* ====== Observables ====== */

        self.loading = ko.observable(false);
        self.items = ko.observableArray([]);

        /* ====== Public methods ====== */

        self.load = function(page) {
            var url = config.queryByTopic.format(page, topic);
            self.loading(true);
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            }).done(function(data) {
                var result = data.result;
                var items = result.items.map(self.loadItem);
                self.loading(false);
                self.items(items);
            });
        }

        /* ====== Overridable methods ====== */

        self.loadItem = _abstract;
    }


    return {
        ModuleViewModel : ModuleViewModel
    };
});