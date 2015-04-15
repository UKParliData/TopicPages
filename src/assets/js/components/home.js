define([
    'text!../../templates/home-graph.html',
    '../models/topics'
], function(tpl, modTopics) {
    "use strict";

    function HomeViewModel() {
        var self = this;

        var topics = modTopics.getTerms();

        self.nodes = topics
            .filter(function(topic) {
                return topic.parents.length > 0;
            })
            .map(function(topic) {
                return {
                    id: topic.id,
                    label: topic.name,
                    value: topic.termCount,
                    group: topic.hasOwnProperty('level')
                        ? 'level' + topic.level.toString()
                        : 'level3',
                    mass: topic.hasOwnProperty('level') && topic.level > 0
                        ? topic.level
                        : 1
                };
            });

        self.edges = topics
            .map(function(topic) {
                return topic.children.map(function(child) {
                    return { from: topic.id, to: child.id };
                })
            })
            .reduce(function(aggregate, edges) {
                return aggregate.concat(edges);
            }, []);

        self.rootTopics = modTopics.getBaseTopics();

        self.selectNodes = function(properties) {
            var nodes = properties.nodes;
            if (nodes.length > 0) {
                var node = nodes.pop();
                var term = modTopics.getTerm(node);
                if (term) {
                    modTopics.selection(term);
                }
            }
        };
    }

    return {
        viewModel: HomeViewModel,
        template: tpl
    };
});
