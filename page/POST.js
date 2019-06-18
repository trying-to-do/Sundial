var zQuery = window.zQuery || {};

zQuery.RequestUrlSet = function () { }

zQuery.RequestUrlSet.prototype.ServerRootPath = 'http://localhost:8000';

zQuery.AccountRequestUrlSet = function () { zQuery.RequestUrlSet.call(this); }

zQuery.AccountRequestUrlSet.prototype = new zQuery.RequestUrlSet();
zQuery.AccountRequestUrlSet.prototype.LoginUrl = zQuery.AccountRequestUrlSet.prototype.ServerRootPath + '/account/login';
zQuery.AccountRequestUrlSet.prototype.RegisterUrl = zQuery.AccountRequestUrlSet.prototype.ServerRootPath + '/account/register';
zQuery.AccountRequestUrlSet.prototype.GetUrl = zQuery.AccountRequestUrlSet.prototype.ServerRootPath + '/account/get';

zQuery.EventRequestUrlSet = function () { zQuery.RequestUrlSet.call(this); }

zQuery.EventRequestUrlSet.prototype = new zQuery.RequestUrlSet();
zQuery.EventRequestUrlSet.prototype.CreateUrl = zQuery.EventRequestUrlSet.prototype.ServerRootPath + '/event/create';
zQuery.EventRequestUrlSet.prototype.GetUrl = zQuery.EventRequestUrlSet.prototype.ServerRootPath + '/event/get';
zQuery.EventRequestUrlSet.prototype.DeleteUrl = zQuery.EventRequestUrlSet.prototype.ServerRootPath + '/event/delete';

zQuery.Requset = function () { }

zQuery.Requset.prototype.post = function (url, data, sucessCallback, failCallBack) {
    let xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data.toJsonStr());
    xhr.onreadystatechange = function (ev) {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300 || this.status === 304) {
                sucessCallback(JSON.parse(this.responseText));
            }
            else {
                failCallBack(this.status);
            }
        }
    }
}

zQuery.Data = function () { }

zQuery.Data.prototype.toJsonStr = function () {
    return JSON.stringify(this);
}

zQuery.AccountData = function () {
    zQuery.Data.call(this);
}

zQuery.AccountData.prototype = new zQuery.Data();
zQuery.AccountData.prototype.id = 'null';
zQuery.AccountData.prototype.name = 'null';
zQuery.AccountData.prototype.passWord = 'null';
zQuery.AccountData.prototype.status = 'null';
zQuery.AccountData.prototype.level = 'null';
zQuery.AccountData.prototype.age = 'null';
zQuery.AccountData.prototype.toJsonStr = function () {
    return JSON.stringify({
        id: this.id,
        name: this.name,
        password: this.passWord,
        level: this.level,
        age: this.age,
        status: this.status
    });
}

zQuery.EventData = function () {
    zQuery.Data.call(this);
}

zQuery.EventData.prototype = new zQuery.Data();
zQuery.EventData.prototype.id = 'null';
zQuery.EventData.prototype.ownerId = 'null';
zQuery.EventData.prototype.date = 'null';
zQuery.EventData.prototype.start = 'null';
zQuery.EventData.prototype.end = 'null';
zQuery.EventData.prototype.type = 'null';
zQuery.EventData.prototype.content = 'null';
zQuery.EventData.prototype.toJsonStr = function () {
    return JSON.stringify({
        eventid: this.eventId,
        ownerid: this.ownerId,
        date: this.date,
        start: this.start,
        end: this.end,
        type: this.type,
        content: this.content
    });
}

zQuery.Factory = function () { }

zQuery.AccountFactory = function () { zQuery.Factory.call(this); }
zQuery.AccountFactory.prototype = new zQuery.Factory();
zQuery.AccountFactory.prototype.getAccountDataToLogin = function (name, passWord) {
    var obj = new zQuery.AccountData();
    obj.name = name;
    obj.passWord = passWord;
    return obj;
}
zQuery.AccountFactory.prototype.getAccountDataToRegister = function (name, passWord, age, level, status) {
    var obj = new zQuery.AccountData();
    obj.name = name;
    obj.passWord = passWord;
    obj.age = age;
    obj.level = level;
    obj.status = status;
    return obj;
}
zQuery.AccountFactory.prototype.getAccountDataToGet = function () {
    return new zQuery.AccountData();
}

zQuery.EventFactory = function () { zQuery.Factory.call(this); }
zQuery.EventFactory.prototype = new zQuery.Factory();
zQuery.EventFactory.prototype.getEventDataToCreate = function (date, start, end, type, content) {
    var obj = new zQuery.EventData();
    obj.date = date;
    obj.start = start;
    obj.end = end;
    obj.type = type;
    obj.content = content;
    return obj;
}
zQuery.EventFactory.prototype.getEventDataToDelete = function (id) {
    var obj = new zQuery.EventData();
    obj.id = id;
    return obj;
}
zQuery.EventFactory.prototype.getEventDataToGet = function (date) {
    var obj= new zQuery.EventData();
    obj.date=date;
    return obj;
}

zQuery.Operation = function () { }
zQuery.Operation.prototype.factory = new zQuery.Factory();
zQuery.Operation.prototype.requset = new zQuery.Requset();
zQuery.Operation.prototype.requestUrlSet = new zQuery.RequestUrlSet();

zQuery.AccountOperation = function () { zQuery.Operation.call(this); }
zQuery.AccountOperation.prototype = new zQuery.Operation();
zQuery.AccountOperation.prototype.accountFactory = new zQuery.AccountFactory();
zQuery.AccountOperation.prototype.accountRequestUrlSet = new zQuery.AccountRequestUrlSet();
zQuery.AccountOperation.prototype.login = function (name, passWord, sucessCallback, failCallBack) {
    var obj = this.accountFactory.getAccountDataToLogin(name, passWord);
    this.requset.post(this.accountRequestUrlSet.LoginUrl, obj, sucessCallback, failCallBack);
}
zQuery.AccountOperation.prototype.get = function (sucessCallback, failCallBack) {
    var obj = this.accountFactory.getAccountDataToLogin();
    this.requset.post(this.accountRequestUrlSet.GetUrl, obj, sucessCallback, failCallBack);
}
zQuery.AccountOperation.prototype.register = function (name, passWord, age, level, status, sucessCallback, failCallBack) {
    var obj = this.accountFactory.getAccountDataToLogin(name, passWord, age, level, status);
    this.requset.post(this.accountRequestUrlSet.RegisterUrl, obj, sucessCallback, failCallBack);
}

zQuery.EventOperation = function () { zQuery.Operation.call(this); }
zQuery.EventOperation.prototype = new zQuery.Operation();
zQuery.EventOperation.prototype.eventFactory = new zQuery.EventFactory(); zQuery.re
zQuery.EventOperation.prototype.eventRequestUrlSet = new zQuery.EventRequestUrlSet();
zQuery.EventOperation.prototype.create = function (date, start, end, type, content, sucessCallback, failCallBack) {
    var obj = this.eventFactory.getEventDataToCreate(date, start, end, type, content);
    this.requset.post(this.eventRequestUrlSet.CreateUrl, obj, sucessCallback, failCallBack);
}
zQuery.EventOperation.prototype.delete = function (id, sucessCallback, failCallBack) {
    var obj = this.eventFactory.getEventDataToDelete(id);
    this.requset.post(this.eventRequestUrlSet.DeleteUrl, obj, sucessCallback, failCallBack);
}
zQuery.EventOperation.prototype.get = function (date,sucessCallback, failCallBack) {
    var obj = this.eventFactory.getEventDataToGet(date);
    this.requset.post(this.eventRequestUrlSet.GetUrl, obj, sucessCallback, failCallBack);
}

var $ = function (str) {
    switch (str) {
        case 'account': return new zQuery.AccountOperation();
        case 'event': return new zQuery.EventOperation();
    }
}