define([
    'text!../../templates/briefing-papers.html',
    'navigator'
], function(tpl, nav) {
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
