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
});
