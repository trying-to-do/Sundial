var yearSelect = document.getElementById('year');
var monthSelect = document.getElementById('month');
var datesUl = document.getElementById('datesUl');
var item = document.getElementById('item');
//初始化
function init() {
    for (var year = 2000; year <= 2100; year++) {    //初始化俩个选项卡
        createOption(year, year, yearSelect);
    }
    for (var month = 1; month <= 12; month++) {
        createOption(month, month, monthSelect);
    }
    var now = new Date();            //获取当前的日期
    showSelect(now.getFullYear(), now.getMonth() + 1);  //引用显示选项卡的函数
    showDates();                  //调用显示日期的函数
    yearSelect.onchange = function () {         //当选项卡改变时
        showDates();
    };
    monthSelect.onchange = function () {
        showDates();
    }
}
init();            //调用初始化函数
//创建option的函数
function createOption(text, value, parent) {
    var option = document.createElement('option');
    option.innerHTML = text;
    option.value = value;
    // option.onclick=function (){alert("!")};
    parent.appendChild(option);
}
//获取当前的日期并显示在选项卡中
function showSelect(year, month) {
    yearSelect.value = year;
    monthSelect.value = month;
}
//获取选择的年月的第一天是星期几
function getDays(year, month) {
    var d = new Date(year, month, 1);
    return d.getDay();
}
//根当前的select中的年和月来显示日期
function showDates() {
    datesUl.innerHTML = "";
    var year = yearSelect.value;
    var month = monthSelect.value;
    //创建空的li
    for (var i = 0; i < getDays(year, month); i++) {
        createLi("", datesUl);
    }
    //创建有日期的li
    for (var j = 1; j <= getDatesOfMonth(year, month); j++) {
        createLi(j, datesUl);
        // document.createElement('li').onclick=function(){
        //     alert("!");
        // }
    }
}
//创建li并添加至对应的容器
function createLi(text, parent) {
    var li = document.createElement('li');
    li.innerHTML = text;
    // 创建日程事件*******************************************************************
    // li.onclick = createItem();
    parent.appendChild(li);
}
//创建一个输入年月计算出这个月有几天的函数
function getDatesOfMonth(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}
//左切换月份
// function leftmonth() {
//     var op = monthSelect.getElementsByTagName("option");
//     monthSelect.value
function createItem(){
    var it=document.getElementById(item);
    it.createElement("ul");
    it.getElementsByTagName.appendChild(document.createTextNode("abc"));
}
// }