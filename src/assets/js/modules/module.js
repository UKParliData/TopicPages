define([
    'jquery',
    'knockout',
    'config',
    'navigator',
    'loader',
    'utils'
], function($, ko, cfg, nav, loader) {

    function _abstract() {
        throw 'This method has not been defined in the derived class.';
    }

    /* ====== Module class definition ====== */

    function LegacyModuleViewModel(configName) {
        var self = this;
        var config = cfg.modules[configName];
        var topic = nav.selectedTopic();

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



    function ModuleViewModel() {
        var self = this;
        var topic = nav.selectedTopic();

        /* ====== Observables ====== */

        self.items = ko.observableArray([]);

        /* ====== Public methods ====== */

        self.load = function(page) {
            nav.componentLoading(true);
            var args = $.extend({_page: page, topic: topic}, self.args);
            loader.load(self.dataset, args, self.loadItem)
                .done(function(items, page, version) {
                    nav.componentLoading(false);
                    self.items(items);
                });
        };

        /* ====== Overridable methods ====== */

        self.loadItem = _abstract;
        self.dataset = null;
        self.args = { };
    }



    return {
        ModuleViewModel: ModuleViewModel,
        LegacyModuleViewModel : LegacyModuleViewModel
    };
});
