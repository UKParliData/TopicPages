define(function() {

    var reFormat = /\{([0-9]+)\}/g;

    String.prototype.format = function() {
        var args = arguments;
        return this.replace(reFormat, function(match, p1, offset, str) {
            var ix = parseInt(p1, 10);
            if (ix < args.length) {
                return args[ix];
            }
            else {
                return match;
            }
        });
    };
    
    // Fix Function#name on browsers that do not support it (IE):
    if (!(function f() {}).name) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function() {
                var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
                // For better performance only parse once, and then cache the
                // result through a new accessor for repeated access.
                Object.defineProperty(this, 'name', { value: name });
                return name;
            }
        });
    }
});
