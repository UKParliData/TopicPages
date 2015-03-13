define(function() {
    "use strict";

    var ddpBase = 'http://lda.data.parliament.uk/';

    return {
        topics: {
            pageSize: 100,
            query: ddpBase + 'terms.json?class=TPG&_page={0}&_pageSize={1}'
        },
        briefingpapers: {
            pageSize: 10,
            query: ddpBase + 'briefingpapers.json?_page={0}&topic={1}'
        }
    };
});