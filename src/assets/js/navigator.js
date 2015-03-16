define(['knockout'], function(ko) {

    function Navigator() {
        var self = this;

        self.pages = [
            { pageTitle: 'Briefing Papers', target: 'briefing-papers' },
            { pageTitle: 'Early Day Motions', target: 'edms' }
        ];

        self.loading = {
            inProgress: ko.observable(true),
            loaded: ko.observable(0),
            expected: ko.observable(100)
        };

        self.selectedComponent = ko.observable(null);
        self.moduleOfSelectedComponent = ko.pureComputed(function() {
            if (self.selectedComponent() == null) {
                return 'modules/home';
            }
            return 'modules/' + self.selectedComponent();
        });

        self.parameters = ko.observable(null);
        self.messages = ko.observableArray([]);

        self.topics = ko.observableArray([]);
        self.selectedTopic = ko.observable(null);

        self.removeMessage = function() {
            self.messages.remove(this);
        };

        self.navigateTo = function(component, parameters) {
            if (parameters) {
                self.parameters(parameters);
            }
            self.selectedComponent(component);
        };

        self.goHome = function(parameters) {
            self.navigateTo('home');
        };

        self.gotoPage = function(page) {
            self.navigateTo(page.target);
        };
    };

    var navigator = new Navigator();

    return navigator;
});
