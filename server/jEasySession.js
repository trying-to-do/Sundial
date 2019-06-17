"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// session有效时间（秒）
var effectiveTime = 7200000;
// 生成随机字符串
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// session句柄
var SessionHandle = /** @class */ (function () {
    function SessionHandle(id, value0) {
        this._id = id;
        this.Value = value0;
        this._createTime = new Date();
        this._effectiveTime = effectiveTime;
    }
    Object.defineProperty(SessionHandle.prototype, "CreateTime", {
        get: function () {
            return this._createTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionHandle.prototype, "ID", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionHandle.prototype, "Value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
        },
        enumerable: true,
        configurable: true
    });
    return SessionHandle;
}());
exports.SessionHandle = SessionHandle;
// session类
var Session = /** @class */ (function () {
    function Session() {
        this._map = new Map();
        this._sessionCount = 0;
    }
    Session.prototype._isTimeOut = function (sessionHandle) {
        // 获取会话句柄创建时间
        var create = sessionHandle.CreateTime.getTime();
        // 获取当前时间
        var now = new Date().getTime();
        // 没有超时
        if (now - create <= effectiveTime) {
            return false;
        }
        // 超时
        else {
            return true;
            ;
        }
    };
    Object.defineProperty(Session.prototype, "SessionCount", {
        // 得到已启动的会话数
        get: function () {
            return this._sessionCount;
        },
        enumerable: true,
        configurable: true
    });
    // 查看会话是否存在
    Session.prototype.isExists = function (id) {
        var sh = this._map.get(id);
        if (sh && sh instanceof SessionHandle) {
            if (this._isTimeOut(sh)) {
                this._map.delete(id);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    // 创建一个会话句柄，并存储一些信息，返回并返回会话id
    Session.prototype.createSessionHandle = function (value) {
        var str;
        do {
            str = randomString(32);
        } while (this.isExists(str));
        var session = new SessionHandle(str, value);
        this._map.set(str, session);
        return str;
    };
    // 删除会话
    Session.prototype.deleteSessionHandle = function (id) {
        if (this._map.get(id) instanceof SessionHandle) {
            this._map.delete(id);
            return true;
        }
        else {
            return false;
        }
    };
    // 获得会话句柄内部的信息
    Session.prototype.getValue = function (id) {
        if (this.isExists(id)) {
            return this._map.get(id).Value;
        }
        else {
            return null;
        }
    };
    return Session;
}());
exports.Session = Session;
