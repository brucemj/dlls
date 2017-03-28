var dbname = 'dllsmj';
// 数据库名

var ver_weapons = 17032814;
// 装备版本号  年月日 时
var ver_pets = 17032814;
// 仆从版本号  年月日 时

var createVer = 'CREATE TABLE IF NOT EXISTS version (item char(16) , ver int)';
var createWeapons = 'CREATE TABLE IF NOT EXISTS weapons (ID int , filename char(16) , namecn char(16) , namepy char(16), nametype char(6), weight int, panel int, element char(8), profile char(150)  )';
var weapons_col = ["filename", "namecn", "namepy", "nametype", "weight", "panel", "element", "profile"]
var weapons_colname = ' (filename, namecn, namepy, nametype, weight, panel, element, profile ) ';

function initVer() {
	var db = api.require('db');
	var ret = db.openDatabaseSync({
		name : dbname
	});
	console.log('数据库同步打开 : ' + JSON.stringify(ret));
	// 创建 version 表
	ret = db.executeSqlSync({
		name : dbname,
		sql : createVer
	});
	if (ret.status) {
		console.log('表 version 创建成功: ' + JSON.stringify(ret));
	} else {
		console.log('表 version 创建失败 : ' + JSON.stringify(err));
	}

	// 检查 version 表更新
	ret = db.selectSqlSync({
		name : dbname,
		sql : 'SELECT ver FROM version where item="weapons" and ver >= ' + ver_weapons
	});
	if (ret.status) {
		if (ret.data.length == 0) {
			console.log('表 version 版本过旧，重新写入数据 . ');
			wtDB();
			// 更新版本号
			var update_ver_weapons = ' ("weapons" , ' + ver_weapons + ')'
			db.executeSql({
				name : dbname,
				sql : 'insert into  version ( item , ver ) values ' + update_ver_weapons
			}, function(ret, err) {
				console.log('更新版本号 weapons = ' + ver_weapons + JSON.stringify(ret))
			})
		} else {
			console.log('表 version 版本正确. ');
		}
	} else {
		console.log('表 version 查询失败 : ' + JSON.stringify(err));
	}

}

function wtDB() {
	var db = api.require('db');
	db.openDatabaseSync({
		name : dbname
	});
	
	db.executeSqlSync({
		name : dbname,
		sql : createWeapons
	})
	db.executeSqlSync({
		name : dbname,
		sql : ' delete from weapons '
	})

	var dataWeapons = "( ";
	var d1 = {
		"filename" : "a1",
		"namecn" : "辉耀陨石佩剑",
		"namepy" : "hyyspj",
		"nametype" : "双刀",
		"weight" : 30,
		"panel" : 1843,
		"element" : "fire",
		"profile" : '{"暴击伤害":30,"攻击速度":13,"暴击率":15,"生命/击杀":172,"3秒持续伤害":600}'
	};

	//for (var i = 0; i <= weapons_col.length; i++) {
//		var p = weapons_col[i]
//		if (i == weapons_col.length) {
//			dataWeapons = dataWeapons + '"' + d1.p + '"' + ' )';
//		} else {
//			dataWeapons = dataWeapons + '"' + d1.p + '"' + ', ';
//		}
		dataWeapons = dataWeapons + '"' + d1.filename + '"' + ', ' ;
		dataWeapons = dataWeapons + '"' + d1.namecn + '"' + ', ' ;
		dataWeapons = dataWeapons + '"' + d1.namepy + '"' + ', ' ;
		dataWeapons = dataWeapons + '"' + d1.nametype + '"' + ', ' ;
		dataWeapons = dataWeapons + d1.weight + ', ' ;
		dataWeapons = dataWeapons + d1.panel  + ', ' ;
		dataWeapons = dataWeapons + '"' + d1.element + '"' + ', ' ;
		dataWeapons = dataWeapons + "'" + d1.profile + "'" + ') ' ;
	//}
	console.log('dataWeapons = ' + dataWeapons );

	ret = db.executeSqlSync({
		name : dbname,
		sql : 'insert into weapons ' + weapons_colname + ' values ' + dataWeapons
	}) ;
	console.log('weapons execute into = ' + JSON.stringify(ret));

	db.selectSqlSync({
		name : dbname,
		sql : 'select *  weapons '
	}, function(ret, err) {
		console.log('weapons select = ' + JSON.stringify(ret));
	})
}

function readWeapons() {
	var db = api.require('db');
	db.openDatabaseSync({
		name : dbname
	});
	
	var ret = db.selectSqlSync({
		name : dbname,
		sql : 'select * from weapons '
	}, function(ret, err) {
		console.log('weapons select = ' + JSON.stringify(ret));
	})
	if (ret.status) {
		console.log('readWeapons ret = ' + JSON.stringify(ret));
		
//		var retss = [] ;
//		var namecn = "namecn"
//		var dd = {"namecn":""} ;
//		var data = ret.data ;
//		for ( var i=0 ; i<=data.length ; i++ ) {
//			dd = data[i] ;
//			console.log('dataFormat dd = ' + JSON.stringify(dd));
//			retss[i] = {"title":""} ;
//			retss[i].title = dd.namecn + '\n' ;
//				//ret[i].title = ret[i].title + data[i]."nametype" + ' 攻击: ' + data[i]."panel" + '\n' ;
//				//ret[i].title = ret[i].title + data[i]."profile" + '\n' ;
//		}
//		console.log('readWeapons retss = ' + JSON.stringify(retss));
		$api.setStorage("weaponslist", dataFormat( ret.data ) );
	}else{
		console.log('readWeapons err = ' + JSON.stringify(ret));
	}	
}

function dataFormat( data ) {
	var ret = [] ;
	
	for ( var i=0 ; i<data.length ; i++ ) {
		ret[i] = {"title":""}
		ret[i].title = data[i].namecn + '\n /n' ;
		ret[i].title = ret[i].title + data[i].nametype + ' 攻击: ' + data[i].panel + '\n' ;
		ret[i].title = ret[i].title + data[i].profile + '\n' ;
	}
	return ret
}

function delTable(tablename) {
	var db = api.require('db');
	db.executeSql({
		name : dbname,
		sql : 'drop table ' + tablename
	}, function(ret, err) {
		console.log('删除  ' + tablename + JSON.stringify(err) + ' ; err= ' + JSON.stringify(err));
	})
}

