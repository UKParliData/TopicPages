define(function() {
    "use strict";

    var ddpBase = 'http://lda.data.parliament.uk/';

    return {
        topics: {
            pageSize: 1000,
            query: ddpBase + 'terms.json?class=ID&_page={0}&_pageSize={1}'
        }
    };
});
