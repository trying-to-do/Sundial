var yearSelect = document.getElementById('year');
var monthSelect = document.getElementById('month');
var datesUl = document.getElementById('datesUl');
var item = document.getElementById('item');
var prevButtionDate;
var datevalue;
var timemsg;
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
    parent.appendChild(li);
}

//创建一个输入年月计算出这个月有几天的函数
function getDatesOfMonth(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

datesUl.addEventListener("click", function (e) {
    // var nodetr = document.createElement("tr");
    // var nodetd = document.createElement("td");
    datevalue = e.target;
    timemsg = yearSelect.value + "-" + monthSelect.value + "-" + datevalue.innerHTML;
    prevButtionDate = timemsg;
    // console.log(timemsg);
    $("event").get(timemsg, function (ret) {
        var itemtable = document.getElementById("itemtable");
        while (itemtable.children.length > 1) {
            itemtable.removeChild(itemtable.children[itemtable.children.length - 1]);
        }
        if (ret[0].status == '0' && ret.length > 1) {
            var tds = [];
            var tr;
            var eventDate;
            for (var i = 1; i < ret.length; ++i) {
                eventDate = new Date(ret[i].date);
                tr = document.createElement('tr');
                tds = [];
                tds.push(document.createElement('td'));
                tds.push(document.createElement('td'));
                tds.push(document.createElement('td'));
                tds[0].innerHTML = ret[i].id;
                tds[1].innerHTML = eventDate.toLocaleDateString() + ":" 
                + ret[i].start + '~~' + ret[i].end;
                tds[2].innerHTML = ret[i].content;
                tr.appendChild(tds[0]);
                tr.appendChild(tds[1]);
                tr.appendChild(tds[2]);
                itemtable.appendChild(tr);
            }
            // nodetd.appendChild(document.createTextNode(1));
            // nodetr.appendChild(nodetd);
            // nodetr.appendChild(nodetd);
            // document.getElementById("itemtable").appendChild(nodetr);
        }
    }, function () { alert("连接错误"); })
});


// function createEvent() {
//     var startTime = document.getElementById('txtstarttime').value;
//     var endTime = document.getElementById('txtendtime').value;
//     var content = document.getElementById('txtcontent').value;
//     $('event').create(prevButtionDate, startTime, endTime, 0, content, 
//         function(ret) {
//             if (ret[0].status == '0') {
//                 alert('sucess');
//             }
//             else {
//                 alert('fail');
//             }
//         }
//     , null)
// }
