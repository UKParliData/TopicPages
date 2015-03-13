define(['knockout'], function(ko) {

    function Navigator() {
        var self = this;

        self.loading = {
            inProgress: ko.observable(true),
            loaded: ko.observable(100),
            expected: ko.observable(100)
        };

        self.selectedComponent = ko.observable(null);
        self.moduleOfSelectedComponent = ko.pureComputed(function() {
            if (self.selectedComponent == null) {
                return null;
            }
            return 'modules/' + self.selectedComponent();
        });

        self.parameters = ko.observable(null);
        self.messages = ko.observable([]);

        self.removeMessage = function() {
            self.messages.remove(this);
        }

        self.navigateTo = function(component, parameters) {
            if (parameters) {
                self.parameters(parameters);
            }
            self.selectedComponent(component);
        }

        self.goHome = function(parameters) {
            self.navigateTo('home');
        }
    };

    var navigator = new Navigator();

    return navigator;
});
