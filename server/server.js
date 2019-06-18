"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import http = require("http");
// import url = require("url");
// import fs = require("fs");
// import util = require("util");
// import mysql = require('mysql');
// import queryString = require("querystring");
var http = require("http");
var fs = require("fs");
var util = require("util");
var mysql = require("mysql");
var queryString = require("querystring");
var mySession = require("./jEasySession");
var UserImformation = /** @class */ (function () {
    function UserImformation(id, name) {
        this.id = id;
        this.name = name;
    }
    return UserImformation;
}());
// 本地服务器路径
var serverPath = "F:/读书/web/Sundial";
// 请求路径 ==> 函数 表
var functionMap = new Map();
var session = new mySession.Session();
// 连接数据库
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'rigui'
});
mysqlConnection.connect(function (error, result) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("数据库连接成功！");
    }
});

functionMap.set('/account/login', accountLogin);
functionMap.set('/account/register', accountRegister);
functionMap.set('/account/get', accountGet);
functionMap.set('/event/get', eventGet);
functionMap.set('/event/create', eventCreate);

// 创建服务器
http.createServer(function (request, response) {
    // 获取请求路径
    var targetPath = request.url;
    // 从函数表中获得对应函数
    var value = functionMap.get(targetPath);
    var userImformation;
    try {
        // 如果访问服务器根目录
        if (targetPath == "/") {
            response.end("server is running at http://localhost:8000");
        }
        // 如果本次访问不是请求文件
        else if (util.isFunction(value)) {
            var postBody_1 = '';
            // 如果请求头含有cookie
            if (request.headers.cookie) {
                // 转化cookie为对象
                var cookieOjbect = queryString.parse(request.headers.cookie, ';', '=');
                // 检测会话状态是否存在
                if (cookieOjbect.id && session.isExists(cookieOjbect.id.toString())) {
                    // 获取已经启动会话的用户的id和name
                    var obj = session.getValue(cookieOjbect.id.toString());
                    userImformation = new UserImformation(obj.id, obj.name);
                }
            }
            // 接收报文
            request.on("data", function (chunk) {
                postBody_1 += chunk;
            });
            // 报文接收完毕
            request.on("end", function () {
                console.log(postBody_1);
                var jsonObj = JSON.parse(postBody_1);
                value(response, jsonObj, userImformation);
            });
        }
        // 本次访问需要请求文件
        else {
            // 读取服务器文件
            fs.readFile(serverPath + targetPath, function (error, data) {
                response.end(data);
            });
        }
    }
    catch (error) {
        printException(error);
    }
}).listen(8000);

// 属性拼接函数
function propertiesSplicing(postBody) {
    var str = "";
    for (var key in postBody) {
        str.concat(key.toString() + ",");
    }
    return str.substr(0, str.length - 1);
}
// 不定长参数,将字符数组内的字符串拼接为JSON字符串
function makeJsonStr(str) {
    var returnStr = "{";
    var index = 0;
    for (var i = 0; i + 2 < str.length; i += 2) {
        returnStr += "\"" + str[i] + "\":" + "\"" + str[i + 1] + "\",";
    }
    returnStr += "\"" + str[str.length - 2] + "\":" + "\"" + str[str.length - 1] + "\"}";
    return returnStr;
}
// 将只有单条记录的数据库查询结果转化为JSON串
function queryToJsonStr(sqlResult) {
    var returnStr = "[{\"status\":\"0\"},";
    var strArray = [];
    for (var x in sqlResult) {
        for (var y in sqlResult[x]) {
            strArray.push(y);
            strArray.push(sqlResult[x][y]);
        }
        returnStr += makeJsonStr(strArray) + ",";
        strArray = [];
    }
    return returnStr.substr(0, returnStr.length - 1) + "]";
}
// 将有多条记录的数据库查询结果转化为JSON串
function queryArrayToJsonStr(sqlResult) {
    var returnStr = "[{\"status\":\"0\"},";
    var strArray = [];
    for (var i in sqlResult) {
        for (var j in sqlResult[i]) {
            strArray.push(j);
            strArray.push(sqlResult[i][j]);
        }
        returnStr += makeJsonStr(strArray) + ',';
        strArray = [];
    }
    returnStr = (returnStr.substr(0, returnStr.length - 1).concat("]"));
    return returnStr;
}
// 打印错误日志
function printException(error) {
    var str = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        str[_i - 1] = arguments[_i];
    }
    console.log(new Date().toLocaleTimeString());
    console.log(error);
    for (var i in str) {
        console.log(i);
    }
}

//创建账户
function accountRegister(require, jsonObj) {
    var sql = "select idAccount " + "from account " + "where Username=?";
    var value = [jsonObj.name];
    var returnStr = "";
    //查找用户名是否存在
    mysqlConnection.query(sql, values, function (error, results, fields) {
        if (error) {
            printException(error);
        }
        //如果没有找到用户名
        else if (results.length == 0) {
            sql = "insert into account" + " (name, password, level, age, status)" + " values(?,?,?,?,?);";
            values = [
                jsonObj.name,
                jsonObj.password,
                jsonObj.level,
                jsonObj.age,
                jsonObj.status
            ];

            // 插入新注册的用户信息
            mysqlConnection.query(sql, values, function (error, results, fields) {
                if (error) {
                    printException(error);
                }
                else {
                    returnStr = "[" + makeJsonStr(["status", "0"]) + "]";
                    response.end(returnStr);
                }
            });
        }
        // 如果用户名重复
        else {
            returnStr = "[" + makeJsonStr(["status", "1", "message", "user is exists!"]) + "]";
            response.end(returnStr);
        }
    })
}

//用户登录
function accountLogin(response, jsonObj, userImformation) {
    var sql = "select * " +
        "from Account " +
        "where name=? and password=?;";
    var values = [jsonObj.name, jsonObj.password];
    var returnStr = "";
    if (!!userImformation) {
        returnStr = "[" + makeJsonStr(["status", "0"]) + "]";
        response.end(returnStr);
    }
    else {
        // 查询用户名和密码是否存在且匹配
        mysqlConnection.query(sql, values, function (error, results, fields) {
            if (error) {
                printException(error);
            }
            // 无查询结果，代表用户名或密码错误
            else if (results.length == 0) {
                returnStr = "[" + makeJsonStr(["status", "2", "message", "userName error or passWord error"]) + "]";
                response.end(returnStr);
            }
            // 查询到匹配的用户名和密码
            else {
                // 新建一个会话，会话内保存用户id和name
                var id = "id=" + session.createSessionHandle(new UserImformation(results[0].id, results[0].name));
                // 设置响应头cookie，cookie信息为会话ID
                response.writeHead(200, {
                    "Content-Type": "text/plain",
                    "Set-Cookie": id + ';path=/'
                });
                returnStr = "[" + makeJsonStr(["status", "0"]) + "]";
                response.end(returnStr);
            }
        });
    }
}

//获取用户信息
function accountGet(response, jsonObj, userImformation) {
    var sql = "select * " +
        "from Account " +
        "where id=?";
    var values = [userImformation.id];
    var returnStr = "";
    // 查询用户信息
    mysqlConnection.query(sql, values, function (error, results, fields) {
        if (error) {
            printException(error);
        }
        // 如果没有查询结果
        else if (results.length == 0) {
            returnStr = "[" + makeJsonStr(["status", "2", "message", "userName error"]) + "]";
            response.end(returnStr);
        }
        else {
            returnStr = queryToJsonStr(results);
            response.end(returnStr);
        }
    });
}

//获取用户日程
function eventGet(response, jsonObj, userImformation) {
    var sql = "select * " +
        "from event " +
        "where ownerid=? and date=?";
    var values = [userImformation.id, jsonObj.date];
    // console.log(jsonObj.date);
    var returnStr = "";
    mysqlConnection.query(sql, values, function (error, results, fields) {
        if (error) {
            printException(error);
        }
        else if (results.length != 0) {
            returnStr = queryArrayToJsonStr(results);
            // console.log(userImformation.id);
            // console.log(jsonObj.date);
            // console.log(returnStr);
            response.end(returnStr);
        }
        else {
            returnStr = "[" + makeJsonStr(["status", "0"]) + "]";
            response.end(returnStr);
        }
    });
}

//删除日程
function eventDelete(response, jsonObj, userImformation) {
    var sql = "delete from event " +
        "where id=?;"
    var values = [jsonObj.id];
    var returnStr = "";
    mysqlConnection.query(sql, values);
    returnStr = "[" + makeJsonStr(["status", "0"]) + "]";
    response.end(returnStr);
}

//创建日程
function eventCreate(response, jsonObj, userImformation) {
    var sql = 'insert into event (date, start, end, type, content, ownerid) ' +
        "values(?,?,?,?,?,?);";
    var values = [jsonObj.date, jsonObj.start, jsonObj.end, jsonObj.type, jsonObj.content, userImformation.id];
    var returnStr;
    mysqlConnection.query(sql, values);
    returnStr = "[" + makeJsonStr(["status", "0"]) + "]";
    response.end(returnStr);
}