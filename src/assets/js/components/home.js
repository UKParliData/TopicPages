define([
    'text!../../templates/home-graph.html',
    '../models/topics'

], function(tpl, modTopics) {
    "use strict";

    function HomeViewModel() {
        var self = this;

        var topics = modTopics.getTerms();

        self.nodes = topics
            .map(function(topic) {
                return {
                    id: topic.id,
                    label: topic.name,
                    value: topic.termCount,
                    group: 'main'
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
    }

    return {
        viewModel: HomeViewModel,
        template: tpl
    };
});
