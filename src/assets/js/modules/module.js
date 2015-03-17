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
        var config = cfg.modules[configName];
        var topic = nav.selectedTopic();
        console.log('Creating view model for ' + configName + ': ' + topic);

        /* ====== Observables ====== */

        self.items = ko.observableArray([]);

        /* ====== Public methods ====== */

        self.load = function(page) {
            var url = config.queryByTopic;
            url += url.indexOf('?') >= 0 ? '&' : '?';
            url += '_page={0}&topic={1}'.format(page, topic);
            nav.componentLoading(true);
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            }).done(function(data) {
                var result = data.result;
                var items = result.items.map(self.loadItem);
                nav.componentLoading(false);
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
