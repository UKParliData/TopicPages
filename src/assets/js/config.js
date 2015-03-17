define(function() {
    "use strict";

    var ddpBase = 'http://lda.data.parliament.uk/';

    return {
        topics: {
            pageSize: 100,
            query: ddpBase + 'terms.json?class=TPG&_page={0}&_pageSize={1}'
        },
        modules: {
            briefingPapers: {
                title: 'Briefing Papers',
                pageSize: 10,
                queryByTopic: ddpBase + 'briefingpapers.json'
            },
            edms: {
                title: 'Early Day Motions',
                pageSize: 10,
                queryByTopic: ddpBase + 'edms.json?_view=all'
            },
            papersLaid : {
                title: 'Papers Laid',
                pageSize: 10,
                queryByTopic: ddpBase + 'paperslaid.json?exists-topic=true'
            },
            proceedings: {
                title: 'Proceedings',
                pageSize: 10,
                queryByTopic: ddpBase + 'proceedings.json?_view=all'
            },
            wms: {
                title: 'Written Ministerial Statements',
                pageSize: 10,
                queryByTopic: ddpBase + 'writtenministerialstatements.json'
            }
        }
    };
});
