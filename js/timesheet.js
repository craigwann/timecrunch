var timesheet = function(process_content, item){
    var current_month = null;
    var storage = 'chrome.storage.sync';
    var entries = [];
    var date = new Date();
    var current_month = date.getFullYear + '_' +  date.getMonth;
        
    var init = function(item) {        
        //no enries
        if(!entries[0]){
          draw_entry_form(item); 
        }

        $(item).find('input').each(function(i, el){
            $(el).change(function() {
                process_entry(item);
            });
        });
    }
    
    var process_entry = function(item) {
        var inputs = $(item).children('input');
        
        if (($(inputs[0]).val != '') && ($(inputs[1]).val != '') && ($(inputs[2]).val != '')) {
            var date = $(inputs[0]).val;
            var start = $(inputs[1]).val;
            var end = $(inputs[2]).val;
            
            
            // Save it using the Chrome extension storage API.
            //var month = new Object;
            //month[current_month] = JSON.encode({'d': date, 's': start, 'e': end});
            
            //chrome.storage.sync.set(current_month, function() {
            //    chrome.storage.sync.get(this.current_month, function(items) {
            //        console.log(JSON.encode(items));
            //    });
            //});
        }
    };
    
    var draw_entry_form = function(item) {
        var form = document.createElement('form');
        var table = document.createElement('table');
        form.appendChild(table);
        var tr = document.createElement('tr');
        table.appendChild(tr);
        
        var td = document.createElement('td');
        tr.appendChild(td);
        var input = document.createElement('input');
        input.setAttribute('name','date');
        input.setAttribute('type','text');
        input.setAttribute('class','date');
        input.setAttribute('placeholder','Date');
        td.appendChild(input);
        
        var td = document.createElement('td');
        tr.appendChild(td);
        var input = document.createElement('input');
        input.setAttribute('name','in');
        input.setAttribute('type','text');
        input.setAttribute('class','time');
        input.setAttribute('placeholder','Start Time');
        td.appendChild(input);
        
        var td = document.createElement('td');
        tr.appendChild(td);
        var input = document.createElement('input');
        input.setAttribute('name','out');
        input.setAttribute('type','text');
        input.setAttribute('class','time');
        input.setAttribute('placeholder','End Time');
        td.appendChild(input);
        
        var td = document.createElement('td');
        var node = document.createTextNode('0.00');
        td.appendChild(node);
        td.setAttribute('class','total');
        tr.appendChild(td);
        item.appendChild(form);
    };

    init(item);
    process_content(item);
};