define([
    'jquery',
    'knockout',
    'navigator',
    'loader'
], function($, ko, nav, loader) {

    function _abstract() {
        throw 'This method has not been defined in the derived class.';
    }

    /* ====== Module class definition ====== */

    function ModuleViewModel() {
        var self = this;
        var topic = nav.selectedTopic();

        /* ====== Observables ====== */

        self.items = ko.observableArray([]);

        /* ====== Public methods ====== */

        self.load = function(page) {
            nav.componentLoading(true);
            var args = $.extend({_page: page, topic: topic.uri}, self.args);
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
        ModuleViewModel: ModuleViewModel
    };
});
