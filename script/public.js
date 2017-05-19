
var DLLSItemPicScale = 240/372 ;

function publog( strtext ){
	console.log( strtext );
}

function initStorage(){
	$api.setStorage("API_itemStore" , {} ); 

}

function homeHead(){
	//var headH = headH||51; 
	//  	api.openFrame ({
	//          name: 'head',
	//          url: 'widget://html/head.html',
	//          bounces: false,
	//          rect:{
	//              x:0,
	//              y: 0 ,
	//              w:'auto',
	//              h: headH
	//          }
	//      });    
  var headhtml = '<div class="homehead">'
  headhtml += '<div class="menu-bar" onclick="openSlide()"><span></span><span></span><span></span></div>'
  headhtml += '<div class="logo fl"><img src="../icon/logo_dh5.png" width="53" height="51" alt="" title="Dungeon Hunter 5"></div>'
  
  headhtml += '<div class="he-co-right fr co-white">'
  headhtml += '<div class="h-c-lang-title bp-rel">'
  headhtml += '<img src="../icon/flag_zh.png" width="27" height="27" alt="" title="">'
  headhtml += '</div></div></div> '
  return headhtml
//  <div class="homehead">
//			<div class="menu-bar" onclick="openSlide()"><span></span><span></span><span></span></div>			
//			<div class="logo fl"><img src="../icon/logo_dh5.png" width="53" height="51" alt="" title="Dungeon Hunter 5"></div>			
//			<div class="he-co-right fr co-white">
//				<div class="h-c-lang-title bp-rel">
//					<img src="../icon/flag_zh.png" width="27" height="27" alt="" title="">
//				</div>
//			</div>
//	</div>
	
	
}

function openSlide () {
        api.openSlidPane ({
            type: 'left'
        });
    }
    
// QQ 
function shareQQImg( imgurl ){
		var qq = api.require('QQPlus');
		
		qq.installed(function(ret, err) {
		    if (ret.status) {
		    	qq.shareImage({
				    //type : 'QZone',
				    type : 'QFriend',    
				    imgPath: imgurl
				},function(ret,err){
				  if (ret.status){
				    console.log("分享成功！");
				  } else {
				    console.log( JSON.stringify(err) );
				  }
				});
		    } else {
		    	console.log(JSON.stringify("没有安装"));
		    }
		});	
		
	}

function isStore(filename){
	var storeJson = $api.getStorage("API_itemStore");
	if( storeJson[filename] == 1 ){
		return true;
	}else{
		return false;
	}
}

function itemStore(filename , action){
	var storeJson = $api.getStorage("API_itemStore");
	 
	if( action ){
		storeJson[filename] = 0 ;
	}else{
		storeJson[filename] = 1 ;
	}
	
	$api.setStorage("API_itemStore", storeJson );
	//console.log( JSON.stringify(storeJson) ) ;
	
}
