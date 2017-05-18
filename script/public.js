
function publog( strtext ){
	console.log( strtext );
}

function openHead(headH){
	var headH = arguments[0] ? arguments[0] : 51;
	//var headH = headH||51; 
    	api.openFrame ({
            name: 'head',
            url: 'widget://html/head.html',
            bounces: false,
            rect:{
                x:0,
                y: 0 ,
                w:'auto',
                h: headH
            }
        });
    $api.setStorage("API_headHeight" , headH );
}