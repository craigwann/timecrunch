var timesheet = function(process_content, item){
    var process_entry = function(item) {
        $('header').css("background-color:red");
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
    
    var current_month = null;
    var entries = [];

    var date = new Date();
    this.current_month = date.getFullYear + '_' +  date.getMonth;

    //no enries
    if(!entries[0]){
      draw_entry_form(item); 
    }
    //\\//End Functions\\//\\
    
    $(item).children('input').each(function(i, el){
        $(el).live('change',function(ev) {
            process_entry(this);
        });
    });
    
    process_content(item);
};