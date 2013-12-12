var timesheet = function(process_content, item){
    var current_date;
    var current_week;
    var current_month;
    var current_display_date;
    
    var init = function(item) {
        draw_nav();
        
        chrome.storage.sync.get(current_month.toString(), function(r) {
            console.log(r);
            var h1 = document.createElement('h1');
            var node = document.createTextNode(display_date);
            h1.appendChild(node);
            item.appendChild(h1);
            if (r[current_month]) {
                if(!r[current_month][current_week]){
                    draw_entry_form(item, null, null); 
                } else {
                    if (is_empty(r[current_month][current_week])) {
                        //Just to be safe, lets make sure the week object isn't empty
                        delete r[current_month][current_week];
                        chrome.storage.sync.set(r, function() {
                            date = new Date();
                            set_current_date(date);
                            refresh_timesheet();
                        });
                    }
                    draw_entries(item, r[current_month][current_week]);
                }
            } else {
                draw_entry_form(item, null, null);
            }
        });
    };
    
    var set_current_date = function(date) {
        current_date = date;
        //Sunday?
        if (date.getDay() === 0) {
            current_week = date.toString('MM_d_yyyy');
        } else {
            current_week = date.last().sunday().toString('MM_d_yyyy');
        }
        current_month = date.getFullYear() + '_' + date.getMonth();
        display_date = date.toString("MMMM d ") + ' - ' + date.next().saturday().toString("MMMM d yyyy");
    };
    
    function is_empty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }
    
    var draw_nav = function () {
        var arrow_right = document.createElement('div');
            arrow_right.setAttribute('class','arrow_right');
            item.appendChild(arrow_right);
            $(arrow_right).click(function(el) {
                date = new Date(current_date);
                date.setDate(date.getDate() + 7);
                set_current_date(date);
                refresh_timesheet(); 
            });

            var arrow_left = document.createElement('div');
            arrow_left.setAttribute('class','arrow_left');
            item.appendChild(arrow_left);
            $(arrow_left).click(function(el) {
                date = new Date(current_date);
                date.setDate(date.getDate() - 7);
                set_current_date(date);
                refresh_timesheet(); 
            });
    };
    
    var draw_entries = function(item, week_obj) {
        var table = document.createElement('table');
        $.each(week_obj, function(key, entry_obj, total) {
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
        
        var s_date = new Date(entry_obj['d'] + ' ' + entry_obj['s']).getTime();
        var e_date = new Date(entry_obj['d'] + ' ' + entry_obj['e']).getTime();
        var time_diff = get_time_difference(s_date, e_date);
    
        var td = document.createElement('td');
        var node = document.createTextNode(time_diff.hours + ':' + time_diff.minutes);
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
    
    var get_time_difference = function (from, to) {
        if (to >= from ) {
            var difference = to - from;
        } else {
            var difference = from - to;
        }
        var diff = {
            hours: Math.floor(difference / 36e5),
            minutes: Math.floor(difference % 36e5 / 60000)
        };
        return diff;
    } 
    
    var edit_entry = function(item, key) {
        chrome.storage.sync.get(current_month.toString(), function(r) {
            draw_entry_form(item, key, r);
        });
    };
    
    var draw_entry_form = function(item, key, month_obj) {
        if ($('form')) {
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
        var d = document.createElement('input');
        d.setAttribute('name','date');
        d.setAttribute('type','text');
        d.setAttribute('class','date');
        d.setAttribute('placeholder','Date');
        if (key) {
            $(d).val(month_obj[current_month][current_week][key]['d']);
        }
        td.appendChild(d);

        var td = document.createElement('td');
        tr.appendChild(td);
        var s = document.createElement('input');
        s.setAttribute('name','in');
        s.setAttribute('type','text');
        s.setAttribute('class','time');
        s.setAttribute('placeholder','Start Time');
        if (key) {
            $(s).val(month_obj[current_month][current_week][key]['s']);
        }
        td.appendChild(s);

        var td = document.createElement('td');
        tr.appendChild(td);
        var e = document.createElement('input');
        e.setAttribute('name','out');
        e.setAttribute('type','text');
        e.setAttribute('class','time');
        e.setAttribute('placeholder','End Time');
        if (key) {
            $(e).val(month_obj[current_month][current_week][key]['e']);
        }
        td.appendChild(e);
        var td = document.createElement('td');
        
        var set_diff = function() {
            if ((!input_empty(d)) && (!input_empty(s))) {
                var s_date = new Date($(d).val() + ' ' + $(s).val()).getTime();
                if (input_empty(e)) {
                    var e_date = new Date().getTime();
                } else {
                    var e_date = new Date($(d).val() + ' ' + $(e).val()).getTime();
                }
                var time_diff = get_time_difference(s_date, e_date);
                if (time_diff.hours >= 24) {
                    $(td).html('0:00');
                } else {
                    if (time_diff.minutes < 10) {
                        time_diff.minutes = '0' + time_diff.minutes;
                    } 
                    $(td).html(time_diff.hours + ':' + time_diff.minutes);
                }
            } else {
                $(td).html('0:00');
            }
        };
        
        $(s).change(function(el) {
            set_diff();
        });
        $(e).change(function(el) {
            set_diff();
        });
        set_diff();
        setInterval(function(){
                set_diff();
        },60000);
        
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
            //Delete the week if it's empty, and go to current date
            if (is_empty(r[current_month][current_week])) {
                delete r[current_month][current_week];
                date = new Date();
                set_current_date(date);
            }
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
                    //Jump to week of entry date
                    set_current_date(date);
                    refresh_timesheet(item);
                });
            });
        }
    };
    
    var refresh_timesheet = function() {
        $(item).html('');
        init(item);
    };

    var date = new Date();
    set_current_date(date);
    init(item);
    process_content(item);
};