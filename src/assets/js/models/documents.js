/* ====== Sources module ====== */
/**
 * This module contains the definitions and transformation functions for per-topic loading
 * of the datasets.
 */

define(['jquery'], function($) {
    "use strict";

    var sources = {};


    /* ====== Briefing Papers ====== */

    sources.briefingPapers = {
        title: 'Briefing Papers',
        aggregate : {
            dataset: 'briefingpapers',
            args: {
                _view: 'all'
            },
            transform: function(item) {
                return {
                    type: sources.briefingPapers,
                    uri: item.contentLocation,
                    date: new Date(item.date._value),
                    title: (item.identifier && item.identifier._value ? item.identifier._value + ': ' : '')
                        + item.title,
                    content: item.description[0]
                };
            }
        }
    };


    /* ====== EDMs ====== */

    sources.edms = {
        title: 'EDMs',
        aggregate : {
            dataset: 'edms',
            args: {
                _view: 'all'
            },
            transform: function(item) {
                return {
                    type: sources.edms,
                    uri: item.externalLocation,
                    title: (item.edmNumber && item.edmNumber._value
                            ? 'EDM ' + item.edmNumber._value + ' - ' : ''
                        )
                        + item.title,
                    date: new Date(item.dateTabled._value),
                    content: item.motionText
                };
            }
        }
    };


    /* ====== Papers Laid ====== */

    sources.papersLaid = {
        title: 'Papers Laid',
        aggregate : {
            dataset: 'paperslaid',
            args: {
                'exists-topic': true,
                _view: 'all'
            },
            transform: function(item) {
                return {
                    type: sources.papersLaid,
                    uri: item.internalLocation,
                    date: new Date(item.dateLaid._value),
                    title: item.title,
                    content: null
                };
            }
        }
    };


    /* ====== proceedings ====== */

    sources.proceedings = {
        title: 'Proceedings',
        aggregate: {
            dataset: 'proceedings',
            args: {
                _view: 'all'
            },
            transform: function(item) {
                return {
                    type: sources.proceedings,
                    uri: item.externalLocation,
                    date: new Date(item.date._value),
                    title: item.title,
                    content: item.indexerSummary
                };
            }
        }
    };


    /* ====== Written Ministerial Statements ====== */

    sources.wms = {
        title: 'Written Ministerial Statements',
        aggregate: {
            dataset: 'writtenministerialstatements',
            args : {},
            transform: function (item) {
                return {
                    type: sources.wms,
                    uri: item._about,
                    date: new Date(item.date._value),
                    title: item.title,
                    content: item.statementText
                };
            }
        }
    };


    sources.all = [
        sources.briefingPapers,
        sources.edms,
        sources.papersLaid,
        sources.proceedings,
        sources.wms
    ];

    return sources;
});
