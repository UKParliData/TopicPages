define([
    'text!../../templates/home.html',
    '../topics'

], function(tpl, topics) {
    "use strict";


    function HomeViewModel() {

    }

    return {
        viewModel: HomeViewModel,
        template: tpl
    };
});
