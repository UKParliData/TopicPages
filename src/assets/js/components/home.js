define([
    'text!../../templates/home-graph.html',
    'knockout',
    '../models/topics'
], function(tpl, ko, modTopics) {
    "use strict";

    function HomeViewModel() {
        var self = this;

        var topics = modTopics.getTerms()
            .filter(function(x) { return x.level > 0; });

        var topicStates = {};
        for (var i = 0; i < topics.length; i++) {
            var topic = topics[i];
            topicStates[topic.id] = topic.level <= 1;
        }

        self.topics = ko.observableArray(
            topics.filter(function(topic) {
                return topicStates[topic.id] === true;
            })
        );

        self.nodes = ko.pureComputed(function() {
            return self.topics()
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
        });

        self.edges = ko.pureComputed(function() {
            return topics
                .map(function(topic) {
                    return topic.children.map(function(child) {
                        return {
                            from: topic.id,
                            to: child.id,
                            length: 250 / (child.level * child.level)
                        };
                    })
                })
                .reduce(function(aggregate, edges) {
                    return aggregate.concat(edges);
                }, []);
        });

        self.rootTopics = modTopics.getBaseTopics();


        self.expandNode = function(properties) {
            var nodes = properties.nodes;
            for (var i = 0; i < nodes.length; i++) {
                var topic = modTopics.getTerm(nodes[i]);

                for (var j = 0; j < topic.children.length; j++) {
                    var child = topic.children[j];
                    console.log(child);
                    if (!topicStates[child.id]) {
                        self.topics.push(child);
                        topicStates[child.id] = true;
                    }
                }
            }
        };


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
