define(['jquery', 'ddp'], function($, ddp) {

    var terms;

    (function() {
        var loading = document.getElementById('loading');
        var progressValue = document.getElementById('progress-value');
        var progressMeter = document.getElementById('progress-meter');

        $(loading).show();

        ddp.getTerms()
            .progress(function(state) {
                console.log(state);
                var percentage = Math.round(state.loaded * 100 / state.expected);
                progressValue.innerHTML = percentage + '%';
                progressMeter.max = state.expected;
                progressMeter.min = 0;
                progressMeter.value = state.loaded;
            })
            .done(function(result) {
                console.log(result);
                terms = result;
                $(loading).hide();
            });
    })();

});
