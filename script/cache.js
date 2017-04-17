var serverurl = "https://d.apicloud.com/mcm/api/";
var machineurl = "http://xxxxxxxxxxx";
var key = "xxxxxx";

window.onerror = function() {
	return true;
}

function ajaxRequest(url, method, datas, callBack) {
	var serverUrl = serverurl;
	var now = Date.now();
	api.ajax({
		url : serverUrl + url,
		method : method,
		cache : false,
		timeout : 30,
		dataType : 'json',
		data : {
			values : datas
		}
	}, function(ret, err) {
		if (ret) {
			callBack(ret, err);
		} else {
			api.alert({
				msg : ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
			});
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
function writeFile(json, id, path) {
	//缓存目录
	var cacheDir = api.cacheDir;
	api.writeFile({
		//保存路径
		path : cacheDir + '/' + path + '/' + id + '.json',
		//保存数据，记得转换格式
		data : JSON.stringify(json)
	}, function(ret, err) {

	})
}

//缓存方法
function doCache(folder, id, url, callback) {
	readFile('/' + folder + '/' + id + '.json', function(ret, err) {
		if (ret.status) {
			//如果成功，说明有本地存储，读取时转换下数据格式
			//拼装json代码
			//alert('取到缓存')
			var cacheData = ret.data;
			callback(JSON.parse(cacheData));
			iCache($('.cache'));
			//再远程取一下数据，防止有更新
			ajaxRequest(url, 'GET', '', function(ret, err) {
				if (ret) {
					if (cacheData != JSON.stringify(ret)) {
						//有更新处理返回数据
						//alert('更新缓存')
						callback(ret);
						//缓存数据
						writeFile(ret, id, folder);
						iCache($('.cache'));
					}
				} else {
					alert('数据获取失败！');
				}
			})
		} else {
			//如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
			ajaxRequest(url, 'GET', '', function(ret, err) {
				if (ret) {
					//处理返回数据
					//alert('没取到缓存')
					callback(ret);
					//缓存数据
					writeFile(ret, id, folder);
					iCache($('.cache'));
				} else {
					alert('数据获取失败！');
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
