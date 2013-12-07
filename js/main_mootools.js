window.addEvent('domready',function() {
    init_page();
    
    function init_page() {
        process_content($(document.body));
    }
    
    function process_content(content) {
        content.getElements('.timesheet').each(function(item) {
            require(['timesheet'],function(){
                var time_sheet = new timesheet(item, {
                    content_processor: process_content
                });
            });
        });
        
        content.getElements('.datetime').each(function(item) {
             require(['datepicker/Locale.en-US.DatePicker','datepicker/Picker','datepicker/Picker.Attach','datepicker/Picker.Date'],function(languagePack, datePicker, pickerAttack, pickerDate){
                new Asset.css('js/datepicker/datepicker_jqui/datepicker_jqui.css');
                var date_picker = new Picker.Date(item, { 
                    timePicker: true, 
                    positionOffset: {x: -35, y: -195}, 
                    pickerClass: 'datepicker_jqui', 
                    useFadeInOut: !Browser.ie 
                });
            });
        });
        
        content.getElements('.date').each(function(item) {
             require(['datepicker/Locale.en-US.DatePicker','datepicker/Picker','datepicker/Picker.Attach','datepicker/Picker.Date'],function(languagePack, datePicker, pickerAttack, pickerDate){
                new Asset.css('js/datepicker/datepicker_jqui/datepicker_jqui.css');
                var date_picker = new Picker.Date(item, { 
                    timePicker: false, 
                    positionOffset: {x: -35, y: -195}, 
                    pickerClass: 'datepicker_jqui', 
                    useFadeInOut: !Browser.ie 
                });
            });
        });
        
        content.getElements('.time').each(function(item) {
             require(['datepicker/Locale.en-US.DatePicker','datepicker/Picker','datepicker/Picker.Attach','datepicker/Picker.Date'],function(languagePack, datePicker, pickerAttack, pickerDate){
                new Asset.css('js/datepicker/datepicker_jqui/datepicker_jqui.css');
                var date_picker = new Picker.Date(item, { 
                    pickOnly: 'time',
                    positionOffset: {x: -35, y: -195}, 
                    pickerClass: 'datepicker_jqui', 
                    useFadeInOut: !Browser.ie 
                });
            });
        });
        
        content.getElements('.overtext').each(function(item) {
           new OverText(item); 
        });
    }
    
});