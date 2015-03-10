define([
    'jquery',
    'knockout',
    'modules/navigator'
], function($, ko, navigator) {
    "use strict";

    $.support.cors = true;
    ko.components.register('loader', { require: 'modules/loader' });
    ko.components.register('home', { require: 'modules/home' });
    ko.applyBindings(navigator);
});
