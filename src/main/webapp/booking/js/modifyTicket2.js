//获取url参数
function GetRequest() {
    var url = location.search;
    var theRequest = {};
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//获取车次类型
function GetTid() {
    var Request = GetRequest();
    var tid = Request['tid'];//车次
    var TidType = tid.substr(0, 1);
    return TidType;
}

//订单信息
function Information() {
    // 订票用户信息
    var passengerInfo = [];
    $("#t3").find("tbody tr").each(function () {
        var info = {};
        info.xibie = $(this).children('td').find('span:nth-child(2)').find('option:selected').val();
        info.piaozhong = $(this).children('td').find('span:nth-child(3)').find('option:selected').val();
        info.name = $(this).children('td').find('span:nth-child(4)').find('input:text').val();
        info.idnumber = $(this).children('td').find('span:nth-child(5)').find('input:text').val();
        passengerInfo.push(info);
    });
    $.cookie("passengerInfo", JSON.stringify(passengerInfo));

    //车次信息
    var Request = GetRequest();
    var obj = {
        sday: Request['sday'],//出发日
        tid: Request['tid'],//车次
        origin: Request['origin'],//起点站
        startTime: Request['startTime'],//起始时间
        destination: Request['destination'],//终点站
        endTime: Request['endTime']//终到时间
    };
    return obj;
}

//查看票源是否满足需求
/**
 * @return {boolean}
 */
function Test() {
    var status = true;
    var types = [];//席别
    var counts = [];//对应座位数
    var Request = GetRequest();
    var sday = Request['sday'];//出发日
    var tid = Request['tid'];//车次
    var origin = Request['origin'];//起点站
    var destination = Request['destination'];//终点站
    var startTime = Request['startTime'];//起始时间
    var endTime = Request['endTime'];//终到时间
    //传参
    var params = {};
    params.sday = sday;
    params.tid = tid;
    params.origin = origin;
    params.destination = destination;
    params.startTime = startTime;
    params.endTime = endTime;
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params,
        async: false,
        success: function (data) {
            $.each(data.trainInfoList, function (index, el) {
                $.each(el.list, function (index, item) {
                    types.push(item.ctype);
                    counts.push(item.ccount);
                })
            })
        }
    });
    //比对 对应席位是否满足用户订单需求
    var passengerInfo = [];
    passengerInfo = JSON.parse($.cookie("passengerInfo"));
    $.each(passengerInfo, function (index, el) {
        $.each(types, function (index, item) {
            if (item === el.xibie) {
                counts[index]--;
                return false;
            } else return true;
        })
    });
    $.each(counts, function (index, el) {
        if (el < 0) {
            status = false;
            return false;
        }
    });
    return status;
}

//列车信息
function TrainInfo() {
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    var Request = GetRequest();
    var sday = Request['sday'];//出发日
    var tid = Request['tid'];//车次
    var origin = Request['origin'];//起点站
    var destination = Request['destination'];//终点站
    var startTime = Request['startTime'];//起始时间
    var endTime = Request['endTime'];//终到时间
    //传参
    var params = {};
    params.sday = sday;
    params.tid = tid;
    params.origin = origin;
    params.destination = destination;
    params.startTime = startTime;
    params.endTime = endTime;
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params,
        success: function (data) {
            $("#t1").children('tbody').empty();
            var tbody = "";
            var tr1 = "<tr>";
            tr1 += "<td>" + "<b>" + sday + "</b>" + "（" + str + "）" + "&nbsp;&nbsp;&nbsp;" + "<b>" + tid + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + origin + "</b>" + "站" + "（" + startTime + "）" + "➜➜➜" + "&nbsp;&nbsp;" + "<b>" + destination + "</b>" + "站" + "（" + endTime + "）" + "</td>";
            tr1 += "</tr>";
            tbody += tr1;
            var tr2 = "<tr>";
            var td1 = "<td style='height: 1px;font-size: 4px'>";
            for (var i = 0; i < 10; i++) {
                td1 += "<b>" + "— — — — — — — — — — — — — — — — — — " + "</b>";
            }
            td1 += "</td>";
            tr2 += td1;
            tr2 += "</tr>";
            tbody += tr2;
            var tr3 = "<tr>";
            var td = "<td>";
            $.each(data.trainInfoList, function (index, el) {
                $.each(el.list, function (index, item) {
                    td += item.ctype + "(" + item.ccount + "张" + ")" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                })
            });
            td += "</td>";
            tr3 += td;
            tr3 += "</tr>";
            tbody += tr3;
            $("#t1").children('tbody').append(tbody);
        }
    })
}

//选择结果
function SelectResult() {
    var modifyInfo = [];
    modifyInfo = JSON.parse($.cookie("modifyInfo"));
    var TidType = GetTid();
    $("#t3").children('tbody').empty();
    for (var i = 1; i <= modifyInfo.length; i++) {
        if (TidType === "G" || TidType === "D") {
            var tr = "<tr>";
            tr += "<td>";
            tr += "<span class='orderSpan4'>" + i + "</span>";
            tr += "<span class='orderSpan4'>\n" +
                "      <select id='ctype'  style='width: 150px;height: 25px'>\n" +
                "      <option value='二等座'>二等座</option>\n" +
                "      <option value='一等座'>一等座</option>\n" +
                "      <option value='商务座'>商务座</option>\n" +
                "      <option value='无座'>无座</option>\n" +
                "      </select>\n" +
                "  </span>";
            tr += "<span class='orderSpan4'>\n" +
                "      <select id='type" + i + "' readonly='readonly' style='width: 80px;height: 25px'>\n" +
                "      <option value='成人'>成人</option>\n" +
                "      <option value='学生'>学生</option>\n" +
                "      </select>\n" +
                "  </span>";
            tr += " <span class='orderSpan4'>\n" +
                "       <input type='text' id='name" + i + "' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                "   </span>";
            tr += " <span class='orderSpan4'>\n" +
                "       <input type='text' id='number" + i + "' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                "   </span>";
            tr += "<span class='orderSpan4'>\n" +
                "      <input type='text' id='telephone" + i + "' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                "  </span>";
            tr += "</tr>";
            $("#t3").children('tbody').append(tr);
        } else {
            var tr = "<tr>";
            tr += "<td>";
            tr += "<span class='orderSpan4'>" + i + "</span>";
            tr += "<span class='orderSpan4'>\n" +
                "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                "      <option value='硬座'>硬座</option>\n" +
                "      <option value='软座'>软座</option>\n" +
                "      <option value='硬卧'>硬卧</option>\n" +
                "      <option value='软卧'>软卧</option>\n" +
                "      <option value='无座'>无座</option>\n" +
                "      </select>\n" +
                "  </span>";
            tr += "<span class='orderSpan4'>\n" +
                "      <select id='type" + i + "' readonly='readonly' style='width: 80px;height: 25px'>\n" +
                "      <option value='成人'>成人</option>\n" +
                "      <option value='学生'>学生</option>\n" +
                "      </select>\n" +
                "  </span>";
            tr += " <span class='orderSpan4'>\n" +
                "       <input type='text' id='name" + i + "' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                "   </span>";
            tr += " <span class='orderSpan4'>\n" +
                "       <input type='text' id='number" + i + "' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                "   </span>";
            tr += "<span class='orderSpan4'>\n" +
                "      <input type='text' id='telephone" + i + "' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                "  </span>";
            tr += "</tr>";
            $("#t3").children('tbody').append(tr);
        }
    }

    for (var j = 1; j <= modifyInfo.length; j++) {
        var params = {};
        params.lname = modifyInfo[j - 1].lname;
        $.ajax({
            type: 'post',
            url: '/modifyPassengerInfo',
            dataType: 'json',
            data: params,
            async: false,
            success: function (data) {
                if (data.result === "0") {
                    $("#ctype" + j).val(modifyInfo[j - 1].ctype);
                    $("#type" +j).val(modifyInfo[j - 1].ltype);
                    $("#name" + j).val(data.usr.uname);
                    $("#number" + j).val(data.usr.unumber);
                    $("#telephone" + j).val(data.usr.utelephone);
                } else {
                    $("#ctype" + j).val(modifyInfo[j - 1].ctype);
                    $("#type" +j).val(modifyInfo[j - 1].ltype);
                    $("#name" + j).val(data.linkMan.lname);
                    $("#number" + j).val(data.linkMan.lnumber);
                    $("#telephone" + j).val("");
                }
            }
        })
    }
}


$(document).ready(function () {
    //js中 \" 相当于 '
    window.onload = function () {
        TrainInfo();//加载车次信息
        SelectResult();//选择结果
    };

    //上一步
    $("#lastStep").click(function () {
        history.back(-1);
    });

    //提交
    $("#confirmOrder").click(function () {
        var obj = Information();
        var status = Test();
        var passengerInfo = [];
        passengerInfo = JSON.parse($.cookie("passengerInfo"));
        if (!status) {
            swal("","非常抱歉！所选席别余票不足。。。\n\n请查看【列车信息】更换席别，再提交订单！","warning");
        } else {
            window.location.href = "ModifyTicket3.html?" + parseParam(obj);
        }
    });
});


// 将js对象转成url jquery实现
var parseParam = function (paramObj, key) {
    var paramStr = "";
    if (paramObj instanceof String || paramObj instanceof Number || paramObj instanceof Boolean) {
        paramStr += "&" + key + "=" + encodeURIComponent(paramObj);
    } else {
        $.each(paramObj, function (i) {
            var k = key == null ? i : key + (paramObj instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + parseParam(this, k);
        });
    }
    return paramStr.substr(1);
};


/**
 * paramObj 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * js实现
 * return URL参数字符串
 */
var urlEncode = function (paramObj, key, encode) {
    if (paramObj == null) return '';
    var paramStr = '';
    var t = typeof (paramObj);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(paramObj) : paramObj);
    } else {
        for (var i in paramObj) {
            var k = key == null ? i : key + (paramObj instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(paramObj[i], k, encode);
        }
    }
    return paramStr;
};