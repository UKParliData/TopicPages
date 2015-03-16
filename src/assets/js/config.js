define(function() {
    "use strict";

    var ddpBase = 'http://lda.data.parliament.uk/';

    return {
        topics: {
            pageSize: 100,
            query: ddpBase + 'terms.json?class=TPG&_page={0}&_pageSize={1}'
        },
        briefingPapers: {
            pageSize: 10,
            queryByTopic: ddpBase + 'briefingpapers.json?_page={0}&topic={1}'
        },
        edms: {
            pageSize: 10,
            queryByTopic: ddpBase + 'edms.json?_page={0}&topic={1}&_view=all'
        },
        papersLaid : {
            pageSize: 10,
            queryByTopic: ddpBase + 'paperslaid.json?_page={0}&topic={1}&exists-topic=true'
        }
    };
});
