var timesheet = function(process_content, item){
    var current_month = null;
    var entries = [];
    var date = new Date();
    var current_date = date;
    var current_week = date.last().sunday().toString('MM_d_yyyy');
    var current_month = date.getFullYear() + '_' + date.getMonth();
        
    var init = function(item) {  
        chrome.storage.sync.get(current_month.toString(), function(r) {
        
            var date = new Date(current_date);
            var display_date = date.toString("MMMM d ") + ' - ' + date.next().saturday().toString("MMMM d yyyy");
            var h1 = document.createElement('h1');
            var node = document.createTextNode(display_date);
            h1.appendChild(node);
            item.appendChild(h1);
        
            if (r[current_month]) {
                if(!r[current_month][current_week]){
                    entry(item, null, null); 
                } else {
                    draw_entries(item, r[current_month][current_week]);
                }
            } else {
                entry(item, null, null);
            }
        });
    };
    
    var draw_entries = function(item, week_obj) {
        var table = document.createElement('table');
        $.each(week_obj, function(key, entry_obj) {
            draw_entry(table, key, entry_obj);
        });
        item.appendChild(table);
    };
    
    var draw_entry = function(table, key, entry_obj) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        
        var td = document.createElement('td');
        var node = document.createTextNode(entry_obj['d']);
        td.appendChild(node);
        tr.appendChild(td);

        var td = document.createElement('td');
        var node = document.createTextNode(entry_obj['s']);
        td.appendChild(node);
        tr.appendChild(td);

        var td = document.createElement('td');
        var node = document.createTextNode(entry_obj['e']);
        td.appendChild(node);
        tr.appendChild(td);

        var td = document.createElement('td');
        var node = document.createTextNode('0.00');
        td.appendChild(node);
        tr.appendChild(td);

        var td = document.createElement('td');
        var img = document.createElement('img');
        img.setAttribute('class', 'icon delete');
        img.setAttribute('src', 'images/paperminus32.png');
        img.setAttribute('rel', key);
        img.setAttribute('width', 15);
        $(img).click(function(el) {
            delete_entry(key); 
        });
        td.appendChild(img);

        var img = document.createElement('img');
        img.setAttribute('class', 'icon edit');
        img.setAttribute('src', 'images/paperpencil32.png');
        img.setAttribute('rel', key);
        img.setAttribute('width', 15);
        $(img).click(function(el) {
            edit_entry(item, key); 
        });
        td.appendChild(img);

        var img = document.createElement('img');
        img.setAttribute('class', 'icon add');
        img.setAttribute('src', 'images/paperplus32.png');
        img.setAttribute('rel', key);
        img.setAttribute('width', 15);
        $(img).click(function(el) {
            draw_entry_form(item, null); 
        });
        td.appendChild(img);

        tr.appendChild(td);
    };
    
    var edit_entry = function(item, key) {
        chrome.storage.sync.get(current_month.toString(), function(r) {
            draw_entry_form(item, key, r);
        });
    };
    
    var draw_entry_form = function(item, key, month_obj) {
        console.log(month_obj);
        if ($('form').length) {
            //So we can change between add/edit forms.
            $('form').remove();
        }
        
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
        if (key) {
            $(input).val(month_obj[current_month][current_week][key]['d']);
        }
        td.appendChild(input);

        var td = document.createElement('td');
        tr.appendChild(td);
        var input = document.createElement('input');
        input.setAttribute('name','in');
        input.setAttribute('type','text');
        input.setAttribute('class','time');
        input.setAttribute('placeholder','Start Time');
        if (key) {
            $(input).val(month_obj[current_month][current_week][key]['s']);
        }
        td.appendChild(input);

        var td = document.createElement('td');
        tr.appendChild(td);
        var input = document.createElement('input');
        input.setAttribute('name','out');
        input.setAttribute('type','text');
        input.setAttribute('class','time');
        input.setAttribute('placeholder','End Time');
        if (key) {
            $(input).val(month_obj[current_month][current_week][key]['e']);
        }
        td.appendChild(input);

        var td = document.createElement('td');
        var node = document.createTextNode('0.00');
        td.appendChild(node);
        td.setAttribute('class','total');
        tr.appendChild(td);
        item.appendChild(form);

        $(item).find('input').each(function(i, el){
            $(el).change(function(el) {
                process_entry($(this).parent().parent(), key);
            });
        });
        process_content(item);
    };
    
    var delete_entry = function(id) {
        chrome.storage.sync.get(current_month.toString(), function(r) {
            delete r[current_month][current_week][id];
            chrome.storage.sync.set(r, function() {
                chrome.storage.sync.get(current_month.toString(), function(r) {
                    refresh_timesheet(item);
                });
            });
        });
    };
    
    var input_empty = function(el) {
        var value = $(el).val();
        var placeholder = $(el).attr('placeholder');
        
        if (($(el).val() === "") || (($(el).val() === $(el).attr('placeholder')))) {
            return true;
        } else {
            return false;
        }
    };
    
    var generate_id = function() {
        return Math.round(new Date().getTime() + (Math.random() * 100));
    };
    
    var month_obj = function(month, week_obj) {
         var obj = {};
         obj[month] = week_obj;
         return obj;
    };
    
    var week_obj = function(week_start, entry_obj) {
        var obj = {};
        obj[week_start] = entry_obj;
        return obj;
    };
    
    var entry_obj = function(id, entry) {
        var obj = {};
        obj[id] = entry;
        return obj;
    };
    
    var process_entry = function(el, key) {
        //chrome.storage.sync.clear();
        var inputs = $(el).find('input');
        var entry_date = $(inputs[0]).val();
        var entry_start = $(inputs[1]).val();
        var entry_end = $(inputs[2]).val();
        var date = new Date(entry_date);
        var entry_month = date.getFullYear() + '_' + date.getMonth();
        var entry_week = date.last().sunday().toString('MM_d_yyyy');
        var entry_sub = {'d': entry_date, 's': entry_start, 'e': entry_end};
        
        if (!key) {
            key = generate_id();
        }
            
        if ((!input_empty(inputs[0])) && (!input_empty(inputs[1])) && (!input_empty(inputs[2]))) {
            chrome.storage.sync.get(current_month.toString(), function(r) {
                if(!r[entry_month]){
                    //If new month - all new
                    var entry = entry_obj(generate_id(), entry_sub);
                    var week = week_obj(entry_week, entry);
                    var month = month_obj(entry_month, week);
                } else {
                    //existing month 
                    var month = r;
                    if (!r[entry_month][entry_week]) {
                        //new week - add to month
                        var entry = entry_obj(key, entry_sub);
                        month[entry_month][entry_week] = entry;
                    } else {
                        //existing week - overwrite or add entry
                        month[entry_month][entry_week][key] = entry_sub;
                    }
                }
                chrome.storage.sync.set(month, function() {
                    refresh_timesheet(item);
                });
            });
        }
    };
    
    var refresh_timesheet = function() {
        $(item).html('');
        init(item);
    };

    init(item);
    process_content(item);
};