var serverurl = "https://d.apicloud.com/mcm/api/";
var machineurl = "http://xxxxxxxxxxx";
var key = "xxxxxx";

window.onerror = function() {
	return true;
}
// function doCache( folder, clsname, callback )
function ajaxRequest(clsname, method, datas, callBack) {
	var model = api.require('model');
	var query = api.require("query");

	model.config({
		appKey : '0D7660A8-5615-F246-E865-7CDD772B1653'
	});
	query.createQuery(function(ret, err) {
		if (ret) {
			var queryId = ret.qid;
			query.limit({
				qid : queryId,
				value : "20"
			});

			model.findAll({
				class : clsname,
				qid : queryId
			}, function(ret, err) {
				if (ret) {
					callBack(ret, err);
				} else {					
					console.log('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode) ;					
				}
			});
		}
	});	
}

// 清除缓存，包括下载的文件、拍照临时文件、网页缓存文件等，清除时可能需要消耗一定时间。
function clearCache() {
	var cacheDir = api.cacheDir;
	api.clearCache(function() {
    api.toast({
        msg: '清除完成'
    });
});
}

//删除文件
function removefs(path) {
	var fs = api.require('fs');
	fs.remove({
	    path: path
	}, function(ret, err) {
	    if (ret.status) {
	        console.log(JSON.stringify(ret));
	    } else {
	        console.log(JSON.stringify(err));
	    }
	});
}


//读文件
function readFile(path, callBack) {
	var cacheDir = api.cacheDir;
	api.readFile({
		path : cacheDir + path
	}, function(ret, err) {
		callBack(ret, err);
	});
}

//写文件
function writeFile(json, path) {
	//缓存目录
	var cacheDir = api.cacheDir;
	api.writeFile({
		//保存路径
		path : cacheDir + path ,
		//保存数据，记得转换格式
		data : JSON.stringify(json)
	}, function(ret, err) {

	})
}

//缓存方法
function doCache(folder, clsname, callback) {
	var cachefile = '/' + folder + '/' + clsname + '.json' ;
	console.log("doCache run");
	readFile(cachefile, function(ret, err) {
		if (ret.status) {
			console.log('本地有缓存');
			//如果成功，说明有本地存储，读取时转换下数据格式
			//拼装json代码
			//alert('取到缓存')
			var cacheData = ret.data;
			console.log( JSON.stringify(cacheData) );
			//callback( JSON.parse( JSON.stringify(cacheData) ) );
			callback(JSON.parse(cacheData));
			iCache($('.imgcache'));
			//再远程取一下数据，防止有更新
			ajaxRequest(clsname, 'GET', '', function(ret, err) {
				if (ret) {
					if (cacheData != JSON.stringify(ret)) {
						//有更新处理返回数据
						//alert('更新缓存')
						callback(ret);
						//缓存数据
						writeFile(ret, cachefile);
						iCache($('.cache'));
					}
				} else {
					console.log('再远程取一下数据，防止有更新,数据获取失败！');
				}
			})
		} else {
			console.log('远程取数据');
			//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
			ajaxRequest(clsname, 'GET', '', function(ret, err) {
				if (ret) {
					//处理返回数据
					//alert('没取到缓存')
					callback(ret);
					//缓存数据
					writeFile(ret, cachefile);
					iCache($('.cache'));
				} else {
					console.log('远程取数据，数据获取失败！');
				}
			})
		}
	})
}

//缓存图片
function iCache(selector) {
	selector.each(function(data) {! function(data) {
			var url = selector.eq(data).attr("src");
			var img = this;
			var pos = url.lastIndexOf("/");
			var filename = url.substring(pos + 1);
			var path = api.cacheDir + "/pic/" + filename;
			var obj = api.require('fs');
			obj.exist({
				path : path
			}, function(ret, err) {
				//msg(ret);
				if (ret.exist) {
					if (ret.directory) {
						//api.alert({msg:'该路径指向一个文件夹'});
					} else {
						//api.alert({msg:'该路径指向一个文件'});
						//selector.eq(data).src=path;
						selector.eq(data).attr('src', null);
						path = api.cacheDir + "/pic/" + filename;
						selector.eq(data).attr('src', path);
						//console.log(selector.eq(data).attr("src"));
					}
				} else {
					api.download({
						url : url,
						savePath : path,
						report : false,
						cache : true,
						allowResume : true
					}, function(ret, err) {
						//msg(ret);
						if (ret) {
							var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
						} else {
							var value = err.msg;
						};
					});
				}
			});
		}(data);
	});
};

function htmldecode(str) {
	str = str.replace(/&amp;/g, '&');
	str = str.replace(/&nbsp;/g, ' ');
	str = str.replace(/&quot;/g, '"');
	str = str.replace(/&#39;/g, "'");
	str = str.replace(/&lt;/gi, '<');
	str = str.replace(/&gt;/gi, '>');
	//	str = str.replace(/<p>/g, '');
	//	str = str.replace(/<\/p>/g, '');
	//	str = str.replace(/<img/g, '<img style="width:100%;"');
	return str;
}
