window.onload = function () {
    init_page();
    
    function init_page() {
        process_content($(document.body));
    }
    
    function process_content(content) {
        content.getElements('.timesheet').each(function(item) {
            var time_sheet = new timesheet(item);
        });
    }
};

var timesheet = new Class ({
	Implements: Options,

	options: {
	    text_timeout: 5000,
	    keypad_digit_selector: '.keypad_digit'
	},

	initialize: function(item,op) {
            var entries = [];
            //no enries
            if(!entries[0]){
               this.draw_entry_form(item); 
            }
	},

	draw_entry_form: function(item) {
            // Creating an new anchor with an Object
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
                'class': 'overtext'
            });
            new OverText(input, { positionOptions: {
			offset: {
				x: 8,
				y: 8
			}
                    }
                });
            td.adopt(input,{
                title: 'Clock In',
                type: 'text'
            });
            var td = new Element('td');
            tr.adopt(td);
            var input = new Element('input',{
                title: 'Clock Out',
                type: 'text'
            });
            td.adopt(input);
            var td = new Element('td');
            tr.adopt(td);
            var input = new Element('input');
            new OverText(input);
            td.adopt(input);
            var td = new Element('td', {
                'class': 'total',
                html: '0:00'
            });
            tr.adopt(td);
            form.inject(item);
	},
	del: function() {
	
	}
    });