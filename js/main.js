$( document ).ready(function() {
    init_page();
    
    function init_page() {
        process_content($(document.body));
    }
    
    function process_content(item) {
        $(item).find(".timesheet").each(function(i, el) {
            timesheet(process_content, this);
        });

        $(item).find("input[placeholder]").each(function(i, el) {
             $(el).inputHints();
        });
        
        $(item).find(".date").each(function(i, el) {
             $(el).pickadate();
        });
        
        $(item).find(".time").each(function(i, el) {
             $(el).pickatime({
                 'interval': 15,
                 'edatable': true
             });
        });

        //Functions
        var add_script = function(url) {
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src = url;
            $("head").append( script );
        };
    }
});