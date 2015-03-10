define([
    'jquery',
    'knockout',
    'modules/navigator'
], function($, ko, navigator) {
    "use strict";

    $.support.cors = true;
    ko.components.register('loader', { require: '/assets/js/modules/loader.js' });
    ko.applyBindings(navigator);
});
