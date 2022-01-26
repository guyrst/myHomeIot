var bus             = require('./hic_01_event');
var fs              = require('fs');
var config          = JSON.parse(fs.readFileSync('./hic_config.json')).configs;
var f               = require('./hic_functions');

var tick = 0;
var CronJob = require('cron').CronJob;
var init = config.init;
var job = new CronJob(
	'* * * * * *',
	function() {
        
        //var start_up_obj = 'tick' + tick;
        //var suo = config.start_up[start_up_obj];
        
        var suo = init[tick];
        if (suo) { 
         
        //bus.emit('log', new Error('[verbose] loading ==>  ' + JSON.stringify(suo)));
        switch (suo.mode) {
            case 'require':
            bus.emit('log', new Error('[verbose] hic_00_00-loading ==>  ' + JSON.stringify(suo)));    
            req_module = suo.value;
                try { 
                        require(req_module);
                    } catch (e){console.log(e);}

                break;
            case 'event' :
                bus.emit('log', new Error('[verbose] hic_00_01-sending event ==>  ' + JSON.stringify(suo)));    
                event_name = suo.event_name;
                event_value = suo.event_value;
                bus.emit(event_name,event_value);
                break;
            case 'wait' :
                break;
            default:
                break;
        }
    }
    tick = tick+1;
	},
	null,
	true,
	'Europe/Paris'
);

bus.on('log', function (log_object, display,color ) {
    if (display == true || display == undefined || config.log_display.all == true)
    {
        console.log(f.lp(log_object).logstr);
        
    }

});

fs.watchFile('./hic_config.json', (curr, prev) => {
    //bus.emit('load_config');
    tick = 0;   
});





