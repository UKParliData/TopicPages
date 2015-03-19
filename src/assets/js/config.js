define(function() {
    "use strict";

    var ddpBase = 'http://lda.data.parliament.uk/';

    return {
        ddpBase: ddpBase,
        timeout: 60000,
        topics: {
            pageSize: 100,
            query: ddpBase + 'terms.json?class=TPG&_page={0}&_pageSize={1}'
        },
        modules: {
            briefingPapers: {
                title: 'Briefing Papers',
            },
            edms: {
                title: 'Early Day Motions',
            },
            papersLaid : {
                title: 'Papers Laid',
            },
            proceedings: {
                title: 'Proceedings',
            },
            wms: {
                title: 'Written Ministerial Statements',
            }
        }
    };
});
