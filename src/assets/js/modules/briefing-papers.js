define([
    'text!../../templates/briefing-papers.html',
    'navigator',
    'config'
], function(tpl, nav, cfg) {
    "use strict";


    var viewModel = function() {
        // TODO: replace this
        console.log(nav.parameters());
    };

    return {
        template: tpl,
        viewModel: viewModel
    };
});