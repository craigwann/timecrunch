var timesheet = function(process_content, item){
    var clock_in_btn_id = '#clock_in';
    var clock_out_btn_id = '#clock_out';
    var current_date;
    var current_week;
    var current_month;
    var current_display_date;
    
    var init = function(item, def) {
        draw_nav();
        
        chrome.storage.sync.get(current_month.toString(), function(r) {
            var h1 = document.createElement('h1');
            $(h1).html(display_date);
            item.appendChild(h1);
            if (r[current_month] && r[current_month][current_week]) {
                if (is_empty(r[current_month][current_week])) {
                    //Just to be safe, lets make sure the week object isn't empty
                    delete r[current_month][current_week];
                    chrome.storage.sync.set(r, function() {
                        date = new Date();
                        set_current_date(date);
                        refresh_timesheet();
                    });
                }
                var total = get_total(r[current_month][current_week]);
                draw_entries(item, r[current_month][current_week]);
            }
            draw_entry_form(item, null, null, def);
            if (total) {
                var div = document.createElement('div');
                div.setAttribute('class','total');
                if (total.minutes < 10) {
                    total.minutes = '0' + total.minutes;
                }
                $(div).html(total['hours'] + ':' + total['minutes']);
                item.appendChild(div);
            }
        });
    };
    
    var get_total = function(week_obj) {
        var total = 0;
        $.each(week_obj, function(key, entry_obj) {
            var s = new Date(entry_obj['d'] + ' ' + entry_obj['s']);
            var e = new Date(entry_obj['d'] + ' ' + entry_obj['e']);
            total = get_date_difference(s, e) + total;
        });
        return diff_as_time(total);
    };
    
    var activate_in_out_btns = function() {
        $(clock_in_btn_id).click(function(el) {
            var date = new Date();
            set_current_date(date);
            var def = {
                d: date.toString('d MMMM, yyyy'),
                s: date.toString('h:mm tt')
            };
            refresh_timesheet(def);
            var n = noty({
                text: "Clocked in",
                timeout: 5000
            });
         });
         
         $(clock_out_btn_id).click(function(el) {
            var date = new Date();
            if (input_empty($("input[name='in']"))) {
                var n = noty({
                    text: "You aren't clocked in",
                    timeout: 5000,
                    type: 'error'
                });
            } else {
                var time = date.toString('h:mm tt');
                $("input[name='out']").val(time);
                $("input[name='out']").trigger('change');
            }
         });
    }
    
    var get_week_start = function(date) {
        if (date.getDay() === 0) {
            week_start = date.toString('MM_d_yyyy');
        } else {
            week_start = date.last().sunday().toString('MM_d_yyyy');
        }
        return week_start;
    }
    
    var set_current_date = function(date) {
        current_date = date;
        //Sunday?
        current_week = get_week_start(date);
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
        
        var s_date = new Date(entry_obj['d'] + ' ' + entry_obj['s']).getTime();
        var e_date = new Date(entry_obj['d'] + ' ' + entry_obj['e']).getTime();
        var time_diff = get_time_difference(s_date, e_date);
        if (time_diff.minutes < 10) {
            time_diff.minutes = '0' + time_diff.minutes;
        }
  
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
        tr.appendChild(td);
    };
    
    var get_time_difference = function (from, to) {
        var difference = get_date_difference(from, to);
        return diff_as_time(difference);
    };
    
    var get_date_difference = function (from, to) {
        if (to >= from ) {
            var difference = to - from;
        } else {
            var difference = from - to;
        }
        return difference;
    };
    
    var diff_as_time = function(difference) {
        var diff = {
            hours: Math.floor(difference / 36e5),
            minutes: Math.floor(difference % 36e5 / 60000)
        };
        return diff;
    };
    
    var edit_entry = function(item, key) {
        chrome.storage.sync.get(current_month.toString(), function(r) {
            draw_entry_form(item, key, r);
        });
    };
    
    var draw_entry_form = function(item, key, month_obj, def) {
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
        if (def && def['d']) {
            $(d).val(def['d']);
        } else if (key) {
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
        if (def && def['s']) {
            $(s).val(def['s']);
        } else if (key) {
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
        if ($('.total').length) {
            $(form).insertBefore($('.total'));
        } else {
            item.appendChild(form);
        }

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
                var n = noty({
                    text: "Entry deleted.",
                    timeout: 5000
                });
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
        var entry_week = get_week_start(date);
        var entry_sub = {'d': entry_date, 's': entry_start, 'e': entry_end};
        if (key) {
            var action = 'edit';
        } else {
            key = generate_id();
            var action = 'add';
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
                        if (Object.keys(r[entry_month][entry_week]).length >= 14) {
                            var n = noty({
                                text: "Due to storage limits, only 14 entries are allowed for each week. Sorry!",
                                timeout: 5000,
                                type: 'error'
                            });
                            return;
                        }
                        //existing week - overwrite or add entry
                        month[entry_month][entry_week][key] = entry_sub;
                    }
                }
                chrome.storage.sync.set(month, function() {
                    //Jump to week of entry date
                    if (get_week_start(date) != get_week_start(current_date)) {
                        var a = action;
                        if (action === 'edit') {
                            a = 'mov'
                        };
                        var n = noty({
                            text: "You've " + a + "ed" + " an entry to a different week than you were viewing. Moving to the week of your entry.",
                            timeout: 5000
                        });
                        set_current_date(date);
                    } else {
                        var n = noty({
                            text: 'Entry ' + action + 'ed',
                            timeout: 5000
                        });
                    }
                    refresh_timesheet(item);
                });
            });
        }
    };
    
    var refresh_timesheet = function(def) {
        $(item).html('');
        init(item, def);
    };

    var date = new Date();
    set_current_date(date);
    init(item);
    activate_in_out_btns();
    process_content(item);
};