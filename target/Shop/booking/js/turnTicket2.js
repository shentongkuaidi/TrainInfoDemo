//获取url参数
function GetRequest() {
    var url = location.search;
    var theRequest = {};
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//获取车次类型
/**
 * @return {string}
 */
function GetTid1() {
    var Request = GetRequest();
    var tid = Request['tid1'];//车次1
    var TidType = tid.substr(0, 1);
    return TidType;
}

/**
 * @return {string}
 */
function GetTid2() {
    var Request = GetRequest();
    var tid = Request['tid2'];//车次2
    var TidType = tid.substr(0, 1);
    return TidType;
}

//列车信息
function TrainInfo() {
    $("#t1").children('tbody').empty();
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    var Request = GetRequest();
    var sday = Request['sday'];//出发日
    var tid1 = Request['tid1'];//车次1
    var tid2 = Request['tid2'];//车次2
    var origin1 = Request['origin'];//起点站
    var destination1 = Request['midStation'];//接续站点
    var origin2 = Request['midStation'];//接续站点
    var destination2 = Request['destination'];//终点站
    var startTime1 = Request['startTime'];//起始时间
    var endTime1 = Request['midEndTime'];//接续到站时间
    var startTime2 = Request['midStartTime'];//接续出发时间
    var endTime2 = Request['endTime'];//终到时间

    //车次一
    var params1 = {};
    params1.sday = sday;
    params1.tid = tid1;
    params1.origin = origin1;
    params1.destination = destination1;
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params1,
        async: false,
        success: function (data) {
            var tbody = "";
            var tr = "<tr>";
            tr += "<td>" + "<b>" + sday + "</b>" + "(" + str + ")" + "&nbsp;&nbsp;&nbsp;" + "<b>" + tid1 + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + origin1 + "</b>" + "站" + "(" + startTime1 + ")" + "➜➜➜" + "<b>" + destination1 + "</b>" + "站" + "(" + endTime1 + ")" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            $.each(data.trainInfoList, function (index, el) {
                $.each(el.list, function (index, item) {
                    tr += item.ctype + "(" + item.ccount + "张" + ")" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                })
            });
            tr += "</td></tr>";
            tbody += tr;
            1
            var tr2 = "<tr>";
            var td1 = "<td style='height: 1px;font-size: 4px'>";
            for (var i = 0; i < 10; i++) {
                td1 += "<b>" + "— — — — — — — — — — — — — — — — — — " + "</b>";
            }
            td1 += "</td></tr>";
            tr2 += td1;
            tbody += tr2;
            $("#t1").children('tbody').append(tbody);
        }
    });
    //车次二
    var params2 = {};
    params2.sday = sday;
    params2.tid = tid2;
    params2.origin = origin2;
    params2.destination = destination2;
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params2,
        async: false,
        success: function (data) {
            var tbody = "";
            var tr = "<tr>";
            tr += "<td>" + "<b>" + sday + "</b>" + "(" + str + ")" + "&nbsp;&nbsp;&nbsp;" + "<b>" + tid2 + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + origin2 + "</b>" + "站" + "(" + startTime2 + ")" + "➜➜➜" + "<b>" + destination2 + "</b>" + "站" + "(" + endTime2 + ")" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            $.each(data.trainInfoList, function (index, el) {
                $.each(el.list, function (index, item) {
                    tr += item.ctype + "(" + item.ccount + "张" + ")" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                })
            });
            tr += "</td></tr>";
            tbody += tr;
            $("#t1").children('tbody').append(tbody);
        }
    })
}

//乘客信息
function PassengerInfo() {
    $("#t2").children('tbody').empty();
    var params = {};
    params.lname = $("#linkManSearch").val();
    $.ajax({
        type: "post",
        url: "/passengerList",
        dataType: "json",
        data: params,
        async: false,
        success: function (data) {
            var length = parseInt(data.linkmanList.length) + parseInt(1);
            var count = (length % 8 === 0) ? (length / 8) : (parseInt(length / 8) + parseInt(1));
            var tbody = "";
            if (length <= 8) { //仅有一行乘客
                var tr = "<tr>";
                tr += "<td>" + "<img src='images/linkman.jpg'>" + "<input type='checkbox' name='checkbox' style='margin: 0 5px 4px 10px' value='" + data.u.uid + "'/><span>" + data.u.uname + "(当前用户)</span>";
                $.each(data.linkmanList, function (index, el) {
                    tr += "<input type='checkbox' name='checkbox' style='margin: 0 5px 4px 50px' value='" + el.lid + "'/><span>" + el.lname + "</span>";
                });
                tr += "</td>";
                tr += "</tr>";
                tbody += tr;
            } else {  //乘客数超过一行，进行排版
                var tr1 = "<tr>";
                tr1 += "<td>" + "<img src='images/linkman.jpg'>" + "<input type='checkbox' name='checkbox' style='margin: 0 5px 4px 10px' value='" + data.u.uid + "'/><span>" + data.u.uname + "(当前用户)</span>";
                for (var i = 0; i < 7; i++) {
                    tr1 += "<input type='checkbox' name='checkbox' style='margin: 0 5px 4px 50px' value='" + data.linkmanList[i].lid + "'/><span>" + data.linkmanList[i].lname + "</span>";
                }
                tr1 += "</td>";
                tr1 += "</tr>";
                tbody += tr1;
                for (var i = 1; i < count; i++) {
                    var k = parseInt(i * 8) - parseInt(1);
                    var m = ((parseInt(k) + parseInt(8)) > data.linkmanList.length) ? data.linkmanList.length : (parseInt(k) + parseInt(8));
                    var tr = "<tr>";
                    tr += "<td>" + "<input type='checkbox' name='checkbox' style='margin: 0 5px 4px 35px' value='" + data.linkmanList[k].lid + "'/><span>" + data.linkmanList[k].lname + "</span>";
                    for (var j = k + 1; j < m; j++) {
                        tr += "<input type='checkbox' name='checkbox' style='margin: 0 5px 4px 50px' value='" + data.linkmanList[j].lid + "'/><span>" + data.linkmanList[j].lname + "</span>";
                    }
                    tr += "</td>";
                    tr += "</tr>";
                    tbody += tr;
                }
            }
            $("#t2").children('tbody').append(tbody);
        }
    })
}

//选择结果
function SelectResult() {
    var s = $("input[name='checkbox']");
    var tr_length = $("#t3").find("tbody tr").length;
    var number = tr_length;
    s.each(function () {
        $(this).click(function () {
            var name = $(this).next().text().length <= 6 ? $(this).next().text() : $(this).next().text().split('(')[0];
            var TidType1 = GetTid1();
            var TidType2 = GetTid2();
            if (this.checked === true) {
                var params = {};
                params.lid = isNaN(this.value) === false ? this.value : 11111;
                var tr_new = parseInt(number) + parseInt(1);
                var tr_new2 = parseInt(tr_new) * 10 + parseInt(2);
                var tr_new_num = parseInt($("#t3").find("tbody tr").length) + parseInt(1);
                if ($('input:checkbox:checked').length > tr_length) { //添加乘客tr
                    var tr1 = "<tr>";
                    var tr2 = "<tr>";
                    if (TidType1 === "G" || TidType1 === "D") {
                        tr1 += "<td>";
                        tr1 += "<span class='orderSpan4'>" + tr_new_num + "</span>";
                        tr1 += "<span class='orderSpan4'>\n" +
                            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                            "      <option value='二等座'>二等座</option>\n" +
                            "      <option value='一等座'>一等座</option>\n" +
                            "      <option value='商务座'>商务座</option>\n" +
                            "      <option value='无座'>无座</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr1 += "<span class='orderSpan4'>\n" +
                            "      <select id='type" + tr_new + "' style='width: 80px;height: 25px'>\n" +
                            "      <option value='成人'>成人</option>\n" +
                            "      <option value='学生'>学生</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr1 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='name" + tr_new + "' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                            "   </span>";
                        tr1 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='number" + tr_new + "' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                            "   </span>";
                        tr1 += "<span class='orderSpan4'>\n" +
                            "       <input type='text' id='telephone" + tr_new + "' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                            "  </span>";
                        tr1 += "</tr>";
                        $("#t3").children('tbody').append(tr1);
                    } else {
                        tr1 += "<td>";
                        tr1 += "<span class='orderSpan4'>" + tr_new_num + "</span>";
                        tr1 += "<span class='orderSpan4'>\n" +
                            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                            "      <option value='硬座'>硬座</option>\n" +
                            "      <option value='软座'>软座</option>\n" +
                            "      <option value='硬卧'>硬卧</option>\n" +
                            "      <option value='软卧'>软卧</option>\n" +
                            "      <option value='无座'>无座</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr1 += "<span class='orderSpan4'>\n" +
                            "      <select id='type" + tr_new + "' style='width: 80px;height: 25px'>\n" +
                            "      <option value='成人'>成人</option>\n" +
                            "      <option value='学生'>学生</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr1 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='name" + tr_new + "' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                            "   </span>";
                        tr1 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='number" + tr_new + "' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                            "   </span>";
                        tr1 += "<span class='orderSpan4'>\n" +
                            "      <input type='text' id='telephone" + tr_new + "' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                            "  </span>";
                        tr1 += "</tr>";
                        $("#t3").children('tbody').append(tr1);
                    }
                    if (TidType2 === "G" || TidType2 === "D") {
                        tr2 += "<td>";
                        tr2 += "<span class='orderSpan4'>" + tr_new_num + "</span>";
                        tr2 += "<span class='orderSpan4'>\n" +
                            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                            "      <option value='二等座'>二等座</option>\n" +
                            "      <option value='一等座'>一等座</option>\n" +
                            "      <option value='商务座'>商务座</option>\n" +
                            "      <option value='无座'>无座</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr2 += "<span class='orderSpan4'>\n" +
                            "      <select id='type" + tr_new2 + "' style='width: 80px;height: 25px'>\n" +
                            "      <option value='成人'>成人</option>\n" +
                            "      <option value='学生'>学生</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr2 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='name" + tr_new2 + "' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                            "   </span>";
                        tr2 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='number" + tr_new2 + "' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                            "   </span>";
                        tr2 += "<span class='orderSpan4'>\n" +
                            "      <input type='text' id='telephone" + tr_new2 + "' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                            "  </span>";
                        tr2 += "</tr>";
                        $("#t4").children('tbody').append(tr2);
                    } else {
                        tr2 += "<td>";
                        tr2 += "<span class='orderSpan4'>" + tr_new_num + "</span>";
                        tr2 += "<span class='orderSpan4'>\n" +
                            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                            "      <option value='硬座'>硬座</option>\n" +
                            "      <option value='软座'>软座</option>\n" +
                            "      <option value='硬卧'>硬卧</option>\n" +
                            "      <option value='软卧'>软卧</option>\n" +
                            "      <option value='无座'>无座</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr2 += "<span class='orderSpan4'>\n" +
                            "      <select id='type" + tr_new2 + "' style='width: 80px;height: 25px'>\n" +
                            "      <option value='成人'>成人</option>\n" +
                            "      <option value='学生'>学生</option>\n" +
                            "      </select>\n" +
                            "  </span>";
                        tr2 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='name" + tr_new2 + "' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                            "   </span>";
                        tr2 += " <span class='orderSpan4'>\n" +
                            "       <input type='text' id='number" + tr_new2 + "' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                            "   </span>";
                        tr2 += "<span class='orderSpan4'>\n" +
                            "      <input type='text' id='telephone" + tr_new2 + "' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                            "  </span>";
                        tr2 += "</tr>";
                        $("#t4").children('tbody').append(tr2);
                    }
                    $.ajax({
                        type: "post",
                        url: "/passengerInfo",
                        dataType: "json",
                        data: params,
                        success: function (data) {
                            if (data.result === "1") {
                                if(data.usr.ustatus === "成人"){
                                    $("#type" + tr_new).attr("disabled", true);
                                    $("#type" + tr_new2).attr("disabled", true);
                                }
                                $("#type" + tr_new).val(data.usr.ustatus);
                                $("#name" + tr_new).val(data.usr.uname);
                                $("#number" + tr_new).val(data.usr.unumber);
                                $("#telephone" + tr_new).val(data.usr.utelephone);
                                $("#type" + tr_new2).val(data.usr.ustatus);
                                $("#name" + tr_new2).val(data.usr.uname);
                                $("#number" + tr_new2).val(data.usr.unumber);
                                $("#telephone" + tr_new2).val(data.usr.utelephone);
                            } else {
                                if(data.linkMan.ltype === "成人"){
                                    $("#type" + tr_new).attr("disabled", true);
                                    $("#type" + tr_new2).attr("disabled", true);
                                }
                                $("#type" + tr_new).val(data.linkMan.ltype);
                                $("#name" + tr_new).val(data.linkMan.lname);
                                $("#number" + tr_new).val(data.linkMan.lnumber);
                                $("#telephone" + tr_new).val("");
                                $("#type" + tr_new2).val(data.linkMan.ltype);
                                $("#name" + tr_new2).val(data.linkMan.lname);
                                $("#number" + tr_new2).val(data.linkMan.lnumber);
                                $("#telephone" + tr_new2).val("");
                            }
                        }
                    });
                    number = tr_new;
                } else {
                    $.ajax({
                        type: "post",
                        url: "/passengerInfo",
                        dataType: "json",
                        data: params,
                        success: function (data) {
                            if (data.result === "1") {
                                if(data.usr.ustatus === "成人"){
                                    $("#type1").attr("disabled", true);
                                    $("#type11").attr("disabled", true);
                                }
                                $("#type1").val(data.usr.ustatus);
                                $("#name1").val(data.usr.uname);
                                $("#number1").val(data.usr.unumber);
                                $("#telephone1").val(data.usr.utelephone);
                                $("#type11").val(data.usr.ustatus);
                                $("#name11").val(data.usr.uname);
                                $("#number11").val(data.usr.unumber);
                                $("#telephone11").val(data.usr.utelephone);
                            } else {
                                if(data.linkMan.ltype === "成人"){
                                    $("#type1").attr("disabled", true);
                                    $("#type11").attr("disabled", true);
                                }
                                $("#type1").val(data.linkMan.ltype);
                                $("#name1").val(data.linkMan.lname);
                                $("#number1").val(data.linkMan.lnumber);
                                $("#telephone1").val("");
                                $("#type11").val(data.linkMan.ltype);
                                $("#name11").val(data.linkMan.lname);
                                $("#number11").val(data.linkMan.lnumber);
                                $("#telephone11").val("");
                            }
                        }
                    })
                }
            } else { //取消乘客tr
                $("#t3").find("tbody tr").each(function () {
                    if ($(this).find('input:first').val() === name && $("#t3").find("tbody tr").length > 1) {
                        $(this).remove();
                    } else if ($('input:checkbox:checked').length === 0) {
                        $(this).remove();
                        if (TidType1 === "G" || TidType1 === "D") {
                            var tr = "<tr>";
                            tr += "<td>";
                            tr += "<span class='orderSpan4'>1</span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                                "      <option value='二等座'>二等座</option>\n" +
                                "      <option value='一等座'>一等座</option>\n" +
                                "      <option value='商务座'>商务座</option>\n" +
                                "      <option value='无座'>无座</option>\n" +
                                "      </select>\n" +
                                "  </span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <select id='type1' style='width: 80px;height: 25px'>\n" +
                                "      <option value='成人'>成人</option>\n" +
                                "      <option value='学生'>学生</option>\n" +
                                "      </select>\n" +
                                "  </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='name1' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                                "   </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='number1' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                                "   </span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <input type='text' id='telephone1' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                                "  </span>";
                            tr += "</tr>";
                            $("#t3").children('tbody').append(tr);
                        } else {
                            var tr = "<tr>";
                            tr += "<td>";
                            tr += "<span class='orderSpan4'>1</span>";
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
                                "      <select id='type1' style='width: 80px;height: 25px'>\n" +
                                "      <option value='成人'>成人</option>\n" +
                                "      <option value='学生'>学生</option>\n" +
                                "      </select>\n" +
                                "  </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='name1' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                                "   </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='number1' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                                "   </span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <input type='text' id='telephone1' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                                "  </span>";
                            tr += "</tr>";
                            $("#t3").children('tbody').append(tr);
                        }
                    }
                });
                $("#t3").find("tbody tr").each(function (i) { //重新排序
                    var num = parseInt(i) + parseInt(1);
                    $(this).children('td').children('span:first').text(num);
                });

                $("#t4").find("tbody tr").each(function () {
                    if ($(this).find('input:first').val() === name && $("#t4").find("tbody tr").length > 1) {
                        $(this).remove();
                    } else if ($('input:checkbox:checked').length === 0) {
                        $(this).remove();
                        if (TidType2 === "G" || TidType2 === "D") {
                            var tr = "<tr>";
                            tr += "<td>";
                            tr += "<span class='orderSpan4'>1</span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
                                "      <option value='二等座'>二等座</option>\n" +
                                "      <option value='一等座'>一等座</option>\n" +
                                "      <option value='商务座'>商务座</option>\n" +
                                "      <option value='无座'>无座</option>\n" +
                                "      </select>\n" +
                                "  </span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <select id='type11' style='width: 80px;height: 25px'>\n" +
                                "      <option value='成人'>成人</option>\n" +
                                "      <option value='学生'>学生</option>\n" +
                                "      </select>\n" +
                                "  </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='name11' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                                "   </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='number11' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                                "   </span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <input type='text' id='telephone11' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                                "  </span>";
                            tr += "</tr>";
                            $("#t4").children('tbody').append(tr);
                        } else {
                            var tr = "<tr>";
                            tr += "<td>";
                            tr += "<span class='orderSpan4'>1</span>";
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
                                "      <select id='type11' style='width: 80px;height: 25px'>\n" +
                                "      <option value='成人'>成人</option>\n" +
                                "      <option value='学生'>学生</option>\n" +
                                "      </select>\n" +
                                "  </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='name11' readonly='readonly' style='width: 80px;height: 16px'/>\n" +
                                "   </span>";
                            tr += " <span class='orderSpan4'>\n" +
                                "       <input type='text' id='number11' readonly='readonly' style='width: 165px;height: 16px'/>\n" +
                                "   </span>";
                            tr += "<span class='orderSpan4'>\n" +
                                "      <input type='text' id='telephone11' readonly='readonly' style='width: 110px;height: 16px'/>\n" +
                                "  </span>";
                            tr += "</tr>";
                            $("#t4").children('tbody').append(tr);
                        }
                    }
                });
                $("#t4").find("tbody tr").each(function (i) { //重新排序
                    var num2 = parseInt(i) + parseInt(1);
                    $(this).children('td').children('span:first').text(num2);
                })
            }
        })
    })
}

//订单信息
function Information() {
    // 订票用户信息
    var passengerInfo1 = [];
    var passengerInfo2 = [];
    $("#t3").find("tbody tr").each(function () {
        var info = {};
        info.xibie = $(this).children('td').find('span:nth-child(2)').find('option:selected').val();
        info.piaozhong = $(this).children('td').find('span:nth-child(3)').find('option:selected').val();
        info.name = $(this).children('td').find('span:nth-child(4)').find('input:text').val();
        info.idnumber = $(this).children('td').find('span:nth-child(5)').find('input:text').val();
        passengerInfo1.push(info);
    });
    $.cookie("passengerInfo1", JSON.stringify(passengerInfo1));
    $("#t4").find("tbody tr").each(function () {
        var info = {};
        info.xibie = $(this).children('td').find('span:nth-child(2)').find('option:selected').val();
        info.piaozhong = $(this).children('td').find('span:nth-child(3)').find('option:selected').val();
        info.name = $(this).children('td').find('span:nth-child(4)').find('input:text').val();
        info.idnumber = $(this).children('td').find('span:nth-child(5)').find('input:text').val();
        passengerInfo2.push(info);
    });
    $.cookie("passengerInfo2", JSON.stringify(passengerInfo2));

    //车次信息
    var Request = GetRequest();
    var obj = {
        sday: Request['sday'],//出发日
        tid1: Request['tid1'],//车次1
        tid2: Request['tid2'],//车次2
        origin1: Request['origin'],//起点站
        destination1: Request['midStation'],//接续站点
        origin2: Request['midStation'],//接续站点
        destination2: Request['destination'],//终点站
        startTime1: Request['startTime'],//起始时间
        endTime1: Request['midEndTime'],//接续到站时间
        startTime2: Request['midStartTime'],//接续出发时间
        endTime2: Request['endTime']//终到时间
    };
    return obj;
}

//查看票源是否满足需求
/**
 * @return {boolean}
 */
function Test() {
    var status = true;
    var types1 = [];//席别
    var counts1 = [];//对应座位数
    var types2 = [];
    var counts2 = [];
    var Request = GetRequest();
    var sday = Request['sday'];//出发日
    var tid1 = Request['tid1'];//车次1
    var tid2 = Request['tid2'];//车次2
    var origin1 = Request['origin'];//起点站
    var destination1 = Request['midStation'];//接续站点
    var origin2 = Request['midStation'];//接续站点
    var destination2 = Request['destination'];//终点站
    //传参
    var params1 = {};
    params1.sday = sday;
    params1.tid = tid1;
    params1.origin = origin1;
    params1.destination = destination1;
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params1,
        async: false,
        success: function (data) {
            $.each(data.trainInfoList, function (index, el) {
                $.each(el.list, function (index, item) {
                    types1.push(item.ctype);
                    counts1.push(item.ccount);
                })
            })
        }
    });
    var params2 = {};
    params2.sday = sday;
    params2.tid = tid2;
    params2.origin = origin2;
    params2.destination = destination2;
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params2,
        async: false,
        success: function (data) {
            $.each(data.trainInfoList, function (index, el) {
                $.each(el.list, function (index, item) {
                    types2.push(item.ctype);
                    counts2.push(item.ccount);
                })
            })
        }
    });
    //比对 对应席位是否满足用户订单需求
    var passengerInfo1,passengerInfo2;
    passengerInfo1 = JSON.parse($.cookie("passengerInfo1"));
    passengerInfo2 = JSON.parse($.cookie("passengerInfo2"));
    //验证余票是否足够
    var i = passengerInfo1.length;
    var j = passengerInfo2.length;
    $.each(passengerInfo1, function (index, el) {
        $.each(types1, function (index, item) {
            if (item === el.xibie) {
                i--;
                counts1[index]--;
                return false;
            } else return true;
        })
    });
    $.each(passengerInfo2, function (index, el) {
        $.each(types2, function (index, item) {
            if (item === el.xibie) {
                j--;
                counts2[index]--;
                return false;
            } else return true;
        })
    });
    $.each(counts1, function (index, el) {
        if (el < 0) {
            status = false;
            return false;
        }
    });
    $.each(counts2, function (index, el) {
        if (el < 0) {
            status = false;
            return false;
        }
    });
    if (i !== 0) {
        status = false;
    }
    return status;
}


//重置t3_tbody,t3_tbody
function Reset_tbody() {
    $("#t3").find("tbody tr").each(function () {
        $(this).remove();
    });
    $("#t4").find("tbody tr").each(function () {
        $(this).remove();
    });
    var TidType1 = GetTid1();
    var TidType2 = GetTid2();
    var tr = "<tr>";
    var tr2 = "<tr>";
    if (TidType1 === "G" || TidType1 === "D") {
        tr += "<td>";
        tr += "<span class='orderSpan4'>1</span>";
        tr += "<span class='orderSpan4'>\n" +
            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
            "      <option value='二等座'>二等座</option>\n" +
            "      <option value='一等座'>一等座</option>\n" +
            "      <option value='商务座'>商务座</option>\n" +
            "      <option value='无座'>无座</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr += "<span class='orderSpan4'>\n" +
            "      <select id='type1' style='width: 80px;height: 25px'>\n" +
            "      <option value='成人'>成人</option>\n" +
            "      <option value='学生'>学生</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='name1' style='width: 80px;height: 16px'/>\n" +
            "   </span>";
        tr += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='number1' style='width: 165px;height: 16px'/>\n" +
            "   </span>";
        tr += "<span class='orderSpan4'>\n" +
            "      <input type='text' id='telephone1' style='width: 110px;height: 16px'/>\n" +
            "  </span>";
        tr += "</tr>";
        $("#t3").children('tbody').append(tr);
    } else {
        tr += "<td>";
        tr += "<span class='orderSpan4'>1</span>";
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
            "      <select id='type1' style='width: 80px;height: 25px'>\n" +
            "      <option value='成人'>成人</option>\n" +
            "      <option value='学生'>学生</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='name1' style='width: 80px;height: 16px'/>\n" +
            "   </span>";
        tr += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='number1' style='width: 165px;height: 16px'/>\n" +
            "   </span>";
        tr += "<span class='orderSpan4'>\n" +
            "      <input type='text' id='telephone1' style='width: 110px;height: 16px'/>\n" +
            "  </span>";
        tr += "</tr>";
        $("#t3").children('tbody').append(tr);
    }
    if (TidType2 === "G" || TidType2 === "D") {
        tr2 += "<td>";
        tr2 += "<span class='orderSpan4'>1</span>";
        tr2 += "<span class='orderSpan4'>\n" +
            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
            "      <option value='二等座'>二等座</option>\n" +
            "      <option value='一等座'>一等座</option>\n" +
            "      <option value='商务座'>商务座</option>\n" +
            "      <option value='无座'>无座</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr2 += "<span class='orderSpan4'>\n" +
            "      <select id='type11' style='width: 80px;height: 25px'>\n" +
            "      <option value='成人'>成人</option>\n" +
            "      <option value='学生'>学生</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr2 += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='name11' style='width: 80px;height: 16px'/>\n" +
            "   </span>";
        tr2 += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='number11' style='width: 165px;height: 16px'/>\n" +
            "   </span>";
        tr2 += "<span class='orderSpan4'>\n" +
            "      <input type='text' id='telephone11' style='width: 110px;height: 16px'/>\n" +
            "  </span>";
        tr2 += "</tr>";
        $("#t4").children('tbody').append(tr2);
    } else {
        tr2 += "<td>";
        tr2 += "<span class='orderSpan4'>1</span>";
        tr2 += "<span class='orderSpan4'>\n" +
            "      <select id='ctype' style='width: 150px;height: 25px'>\n" +
            "      <option value='硬座'>硬座</option>\n" +
            "      <option value='软座'>软座</option>\n" +
            "      <option value='硬卧'>硬卧</option>\n" +
            "      <option value='软卧'>软卧</option>\n" +
            "      <option value='无座'>无座</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr2 += "<span class='orderSpan4'>\n" +
            "      <select id='type11' style='width: 80px;height: 25px'>\n" +
            "      <option value='成人'>成人</option>\n" +
            "      <option value='学生'>学生</option>\n" +
            "      </select>\n" +
            "  </span>";
        tr2 += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='name11' style='width: 80px;height: 16px'/>\n" +
            "   </span>";
        tr2 += " <span class='orderSpan4'>\n" +
            "       <input type='text' id='number11' style='width: 165px;height: 16px'/>\n" +
            "   </span>";
        tr2 += "<span class='orderSpan4'>\n" +
            "      <input type='text' id='telephone11' style='width: 110px;height: 16px'/>\n" +
            "  </span>";
        tr2 += "</tr>";
        $("#t4").children('tbody').append(tr2);
    }
}

//重置"增加联系人页面"
function ResetAdd() {
    $("#lname").val("");
    $("#lnamedo").html("");
    $("#lsex").val("您是先生还是女士？");
    $("#lsexdo").html("");
    $("#ltype").val("请选择您的身份");
    $("#ltypedo").html("");
    $("#lnumber").val("");
    $("#lnumberdo").html("");
    $("#msg").html("");
    $("#alert").css('display', 'none');
}

$(document).ready(function () {
    //js中 \" 相当于 '
    window.onload = function () {
        var TidType1 = GetTid1();
        var TidType2 = GetTid2();
        if (TidType1 === "G" || TidType1 === "D") {
            $('#one').css('display', 'inline');
            $('#two').css('display', 'none');
            $('#two').remove();
        } else {
            $('#two').css('display', 'inline');
            $('#one').css('display', 'none');
            $('#one').remove();
        }
        if (TidType2 === "G" || TidType2 === "D") {
            $('#three').css('display', 'inline');
            $('#four').css('display', 'none');
            $('#four').remove();
        } else {
            $('#four').css('display', 'inline');
            $('#three').css('display', 'none');
            $('#three').remove();
        }
        TrainInfo();//加载车次信息
        PassengerInfo();//加载乘客信息
        SelectResult();//选择结果
    };

    //搜索联系人
    $("#linkManSearch").keyup(function () {
        Reset_tbody();
        PassengerInfo();
        SelectResult();
    });

    //新增联系人
    $("#addLinkMan").click(function () {
        var alert = $("#alert");
        var shade = $('.shade');
        shade.css('height',$('body').height());
        shade.show();
        alert.css('display', 'block');
        alert.css('position', 'absolute');
        alert.css('top', '30%');
        alert.css('left', '40%');
        alert.css('marginTop', '-20px');
        alert.css('marginLeft', '-100px');
        alert.css('background', 'white');
    });

    var lnumberconfirm = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  //设置身份证号验证规则
    //联系人姓名
    $("#lname").focus(function () {
        $("#lname").css("background-color", "greenyellow");
    });
    $("#lname").blur(function () {
        $("#lname").css("background-color", "white");
        var lname = $("#lname").val(); //真实姓名
        if (lname === "" || lname.replace(/(^\s*)|(\s*$)/g, "") === "") {
            $("#lnamedo").html("请填写");
            $("#lnamedo").css("color", "red");
        } else {
            $("#lnamedo").html("✔");
            $("#lnamedo").css("color", "green");
        }
    });

    //联系人性别
    $("#lsex").change(function () {
        var lsex = $(this).children('option:selected').val();
        if (lsex === "您是先生还是女士？") {
            $("#lsexdo").html("请选择");
            $("#lsexdo").css("color", "red");
        } else {
            $("#lsexdo").html("✔");
            $("#lsexdo").css("color", "green");
        }
    });

    //联系人身份
    $("#ltype").change(function () {
        var ltype = $(this).children('option:selected').val();
        if (ltype === "请选择您的身份") {
            $("#ltypedo").html("请选择");
            $("#ltypedo").css("color", "red");
        } else {
            $("#ltypedo").html("✔");
            $("#ltypedo").css("color", "green");
        }
    });

    //联系人证件号
    $("#lnumber").focus(function () {
        $("#lnumber").css("background-color", "greenyellow");
    });
    $("#lnumber").blur(function () {
        $("#lnumber").css("background-color", "white");
        var lnumber = $("#lnumber").val(); //证件号码
        if (lnumber === "") {
            $("#lnumberdo").html("请输入");
            $("#lnumberdo").css("color", "red");
        } else if (!lnumberconfirm.test(lnumber)) {
            $("#lnumberdo").html("不正确");
            $("#lnumberdo").css("color", "red");
        } else {
            var params = {};
            params.lnumber = $("#lnumber").val();
            $.ajax({
                type: "post",
                url: "/confirmLinkMan",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "0") {
                        $("#lnumberdo").html("✔");
                        $("#lnumberdo").css("color", "green");
                    } else {
                        $("#lnumberdo").html("已存在");
                        $("#lnumberdo").css("color", "red");
                    }
                }
            })
        }
    });

    //保存联系人
    $("#save").click(function () {
        if ($("#lnamedo").html() !== "✔" || $("#lsexdo").html() !== "✔" || $("#ltypedo").html() !== "✔" ||
            $("#lnumberdo").html() !== "✔") {
            $("#msg").html("信息不完整");
            $("#msg").css("color", "red");
        } else {
            $("#msg").html("");
            var params = {};
            params.lname = $("#lname").val();
            params.lsex = $("#lsex").val();
            params.ltype = $("#ltype").val();
            params.lnumber = $("#lnumber").val();
            $.ajax({
                type: "post",
                url: "/addLinkMan",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        swal("", "添加成功！", "success");
                        $("#lname").val("");
                        $("#lnamedo").html("");
                        $("#lsex").val("您是先生还是女士？");
                        $("#lsexdo").html("");
                        $("#ltype").val("请选择您的身份");
                        $("#ltypedo").html("");
                        $("#lnumber").val("");
                        $("#lnumberdo").html("");
                        $("#msg").html("");
                        $("#alert").css('display', 'none');
                        Reset_tbody();
                        PassengerInfo();
                        SelectResult();
                    } else {
                        swal("", "系统异常！", "error");
                    }
                }
            })
        }
    });

    //关闭
    $("#close").click(function () {
        ResetAdd();
        $('.shade').hide();
    });
    //取消返回
    $("#cancel").click(function () {
        ResetAdd();
        $('.shade').hide();
    });

    //上一步
    $("#lastStep").click(function () {
        history.back(-1);
    });

    //提交
    $("#confirmOrder").click(function () {
        TrainInfo();//更新余票信息
        var obj = Information();
        var status = Test();
        var passengerInfo1;
        passengerInfo1 = JSON.parse($.cookie("passengerInfo1"));
        if (passengerInfo1[0].name === null || passengerInfo1[0].name === "") {
            swal("", "请选择乘客！", "warning");
        } else if (!status) {
            swal("", "非常抱歉！所选席别余票不足。。。\n\n请查看【列车信息】更换席别，再提交订单！", "warning");
        } else {
            window.location.href = "TurnTicket3.html?" + parseParam(obj);
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