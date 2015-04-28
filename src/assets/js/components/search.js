/* ====== Search for a topic by subject ====== */

/**
 * The user types a subject into a search box and a list of matching topics
 * is shown, dynamically updating. Clicking on one of these topics then takes
 * the user to the relevant topic view.
 */
define([
    'text!../../templates/search.html'

], function(tpl) {
    "use strict";


    function SearchViewModel() {

    }


    return {
        viewModel: SearchViewModel,
        template: tpl
    };
});
