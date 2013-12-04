var timesheet = new Class ({
    Implements: Options,
    
    current_month: null,
    storage: 'chrome.storage.sync',

    options: {
        content_processor: null
    },
    

    initialize: function(item,op) {
        this.setOptions(op);
        var entries = [];
        
        var date = new Date();
        this.current_month = date.get('year') + '_' +  date.get('month');
        
        //no enries
        if(!entries[0]){
           this.draw_entry_form(item); 
        }
        
        item.getElements('input').each(function(el){
            el.addEvent('change',function(e){
                this.process_entry(item);
            }.bind(this));
        }.bind(this));
        
        //item.input.each.addEvent('change', function(){
        //    alert('clicked!');
        //});
        
        this.options.content_processor(item);
    },

    draw_entry_form: function(item) {
        var form = new Element('form', {
            action: '#'
        });
        var table = new Element('table');
        form.adopt(table);
        var tr = new Element('tr');
        table.adopt(tr);
        var td = new Element('td');
        tr.adopt(td);
        var input = new Element('input',{
            title: 'Date',
            type: 'text',
            'class': 'overtext date'
        });
        td.adopt(input);
        var td = new Element('td');
        tr.adopt(td);
        var input = new Element('input',{
            title: 'Clock In',
            type: 'text',
            'class': 'overtext time'
        });
        td.adopt(input);
        var td = new Element('td');
        tr.adopt(td);
        var input = new Element('input',{
            title: 'Clock Out',
            type: 'text',
            'class': 'overtext time'
        });
        td.adopt(input);
        var td = new Element('td', {
            'class': 'total',
            html: '0:00'
        });
        tr.adopt(td);
        form.inject(item);
    },
            
    process_entry: function(item) {
        //Check to see if the inputs are filled in
        var inputs = item.getElements('input');
        if ((inputs[0].value) && (inputs[1].value) && (inputs[2].value)) {
            var date = inputs[0].value;
            var start = inputs[1].value;
            var end = inputs[2].value;
            
            // Save it using the Chrome extension storage API.
            var current_month = new Object;
            current_month[this.current_month] = JSON.encode({'d': date, 's': start, 'e': end});
            
            chrome.storage.sync.set(current_month, function() {
                chrome.storage.sync.get(this.current_month, function(items) {
                    console.log(JSON.encode(items));
                });
            });
        }
    }
});