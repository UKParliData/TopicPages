define(['knockout'], function(ko) {

    function Navigator() {
        var self = this;

        self.selectedComponent = ko.observable('loader');
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
