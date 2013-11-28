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
            var form = new Element('form', {
                action: '#'
            });
            var table = new Element('table');
            form.adopt(table);
            var tr = new Element('tr');
            table.adopt(tr);
            var td = new Element('td');
            tr.adopt(td);
            var input1 = new Element('input',{
                title: 'Date',
                type: 'text',
                'class': 'overtext'
            });
            td.adopt(input1);
            var td = new Element('td');
            tr.adopt(td);
            var input2 = new Element('input',{
                title: 'Clock In',
                type: 'text',
                'class': 'overtext'
            });
            td.adopt(input2);
            var td = new Element('td');
            tr.adopt(td);
            var input3 = new Element('input',{
                title: 'Clock Out',
                type: 'text',
                'class': 'overtext'
            });
            td.adopt(input3);
            var td = new Element('td', {
                'class': 'total',
                html: '0:00'
            });
            tr.adopt(td);
            form.inject(item);
            
            new OverText(input1);
            new OverText(input2);
            new OverText(input3); 
	},
	del: function() {
	
	}
    });