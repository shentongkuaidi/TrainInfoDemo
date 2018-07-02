$(function () {

    window.onload = function () {
        //车次信息
        TrainInfo();
        //订单信息
        PassengerInfo();
        // 订单生成
        setTimeout('Order()', 50);
        swal({
            title: "",
            text: '占座中。。。。。。请稍等',
            imageUrl: "../booking/images/loading.gif",
            html: true,
            timer: 3000,
            showConfirmButton: false
        }, function () {
            //获取订单剩余有效时间
            GetLeftTime();
            swal.close();
        });
    };

    //用户主动取消订单
    $("#cancelOrder").click(function () {
        swal({
            title: "",
            text: "确认取消订单！",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "是的，我要取消",
            confirmButtonColor: "#ec6c62"
        }, function () {
            $.ajax({
                type: "get",
                url: "/cancelOrder",
                dataType: "json",
                data: {},
                success: function (data) {
                    if (data.result === "1") {
                        swal({
                            title: "",
                            text: "取消订单成功！",
                            type: "success"
                        }, function () {
                            window.location.href = "../index.html";
                        });
                    } else {
                        swal("", "系统异常！", "error");
                    }
                }
            })
        })
    });

    //网上支付
    $("#payOnline").click(function () {
        swal({
            title: "",
            text: '支付中。。。。。。请稍等',
            imageUrl: "../booking/images/loading.gif",
            html: true,
            timer: 3000,
            showConfirmButton: false
        }, function () {
            var params = {};
            params.otstatus = "1";
            $.ajax({
                type: "post",
                url: "/payOrder",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        swal({
                            title: "",
                            text: "支付成功！",
                            type: "success"
                        }, function () {
                            window.location.href = "../index.html";
                        })
                    } else {
                        swal("", "系统异常，稍后重试！", "error");
                    }
                }
            })
        })
    })

});


//获取车次类型
/**
 * @return {string}
 */
function GetTid1() {
    var obj = GetRequest();
    var tid = obj.tid1;//车次
    return tid.substr(0, 1);
}

/**
 * @return {string}
 */
function GetTid2() {
    var obj = GetRequest();
    var tid = obj.tid2;//车次
    return tid.substr(0, 1);
}

//列车信息
function TrainInfo() {
    // $("#t2 thead tr:eq(1)").empty();
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    var obj = GetRequest();
    var sday = obj['sday'];//出发日
    var tid1 = obj['tid1'];//车次1
    var tid2 = obj['tid2'];//车次2
    var origin1 = obj['origin1'];//起点站
    var destination1 = obj['destination1'];//接续站点
    var origin2 = obj['origin2'];//接续站点
    var destination2 = obj['destination2'];//终点站
    var startTime1 = obj['startTime1'];//起始时间
    var endTime1 = obj['endTime1'];//接续到站时间
    var startTime2 = obj['startTime2'];//接续出发时间
    var endTime2 = obj['endTime2'];//终到时间
    var td1 = "<td style='font-size: 16px;height: 35px'>";
    td1 += "<b>" + sday + "</b>" + "（" + str + "）" + "&nbsp;&nbsp;&nbsp;" + "<b>" + tid1 + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + origin1 + "</b>" + "站" + "（" + startTime1 + "）" + "➜➜➜" + "&nbsp;&nbsp;" + "<b>" + destination1 + "</b>" + "站" + "（" + endTime1 + "）" + "</td>";
    $("#t2").find("thead tr:eq(1)").append(td1);
    var td2 = "<td style='font-size: 16px;height: 35px'>";
    td2 += "<b>" + sday + "</b>" + "（" + str + "）" + "&nbsp;&nbsp;&nbsp;" + "<b>" + tid2 + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + origin2 + "</b>" + "站" + "（" + startTime2 + "）" + "➜➜➜" + "&nbsp;&nbsp;" + "<b>" + destination2 + "</b>" + "站" + "（" + endTime2 + "）" + "</td>";
    $("#t3").find("thead tr:eq(1)").append(td2);
}

//订单详细信息（显示到页面上）
function PassengerInfo() {
    $("#t2").find("tbody").empty();
    $("#t3").find("tbody").empty();
    var passengerInfo1, passengerInfo2;
    passengerInfo1 = JSON.parse($.cookie("passengerInfo1"));
    passengerInfo2 = JSON.parse($.cookie("passengerInfo2"));
    var obj = GetRequest();
    var sday = obj['sday'];//出发日
    var tid1 = obj['tid1'];//车次1
    var tid2 = obj['tid2'];//车次2
    var origin1 = obj['origin1'];//起点站
    var destination1 = obj['destination1'];//接续站点
    var origin2 = obj['origin2'];//接续站点
    var destination2 = obj['destination2'];//终点站
    var totalPrice1 = 0;//车程一票价小计
    var totalPrice2 = 0;//车程二票价小计
    var totalPrice = 0;//票价总计
    var params1 = {};
    params1.sday = sday;
    params1.tid = tid1;
    params1.origin = origin1;
    params1.destination = destination1;
    $.ajax({
        type: "post",
        url: "/ticketInfo",
        dataType: "json",
        data: params1,
        success: function (data) {
            var ticketInfoList = data.ticketInfoList;
            var TidType = GetTid1();
            $.each(passengerInfo1, function (index, el) {
                var sort = parseInt(index) + parseInt(1);
                $.each(ticketInfoList, function (index, item) {
                    if (item.ctype === el.xibie) {
                        var tbody = "<tr>";
                        var length = el.name.toString().length;
                        var price1 = (parseFloat(item.price) * parseFloat(0.75)).toFixed(1);//学生票打折G、D
                        var price2 = (parseFloat(item.price) * parseFloat(0.5)).toFixed(1);//K、T等
                        if (TidType === "G" || TidType === "D") {
                            if (length === 2) {
                                tbody += "<td>" + "<span class='orderSpan2'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.piaozhong + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                tbody += "<span class='orderSpan1'>" + item.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                if (el.xibie === "二等座" && el.piaozhong === "学生") {
                                    tbody += "<span>" + price1 + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(price1);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(item.price);
                                }
                            } else {
                                tbody += "<td>" + "<span class='orderSpan3'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.piaozhong + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                tbody += "<span class='orderSpan1'>" + item.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                if (el.xibie === "二等座" && el.piaozhong === "学生") {
                                    tbody += "<span>" + price1 + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(price1);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(item.price);
                                }
                            }
                        } else {
                            if (length === 2) {
                                tbody += "<td>" + "<span class='orderSpan2'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.piaozhong + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                tbody += "<span class='orderSpan3'>" + item.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                if (el.xibie === "硬座" && el.piaozhong === "学生") {
                                    tbody += "<span>" + price2 + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(price2);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(item.price);
                                }
                            } else {
                                tbody += "<td>" + "<span class='orderSpan3'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.piaozhong + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                tbody += "<span class='orderSpan3'>" + item.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                if (el.xibie === "硬座" && el.piaozhong === "学生") {
                                    tbody += "<span>" + price2 + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(price2);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice1 += parseFloat(item.price);
                                }
                            }
                        }
                        tbody += "</tr>";
                        $("#t2").find("tbody").append(tbody);
                        ticketInfoList.splice(index, 1);
                        return false;
                    } else return true;
                });
            });
            totalPrice += totalPrice1;
            $("#totalPrice1").html("小计：" + totalPrice1 + "（元）");
            //车程二
            var params2 = {};
            params2.sday = sday;
            params2.tid = tid2;
            params2.origin = origin2;
            params2.destination = destination2;
            $.ajax({
                type: "post",
                url: "/ticketInfo",
                dataType: "json",
                data: params2,
                success: function (data) {
                    var ticketInfoList = data.ticketInfoList;
                    var TidType = GetTid2();
                    $.each(passengerInfo2, function (index, el) {
                        var sort = parseInt(index) + parseInt(1);
                        $.each(ticketInfoList, function (index, item) {
                            if (item.ctype === el.xibie) {
                                var tbody = "<tr>";
                                var length = el.name.toString().length;
                                var price1 = (parseFloat(item.price) * parseFloat(0.75)).toFixed(1);//学生票打折G、D
                                var price2 = (parseFloat(item.price) * parseFloat(0.5)).toFixed(1);//K、T等
                                if (TidType === "G" || TidType === "D") {
                                    if (length === 2) {
                                        tbody += "<td>" + "<span class='orderSpan2'>" + sort + "</span>";
                                        tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                        tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                        tbody += "<span class='orderSpan1'>" + el.piaozhong + "</span>";
                                        tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                        tbody += "<span class='orderSpan1'>" + item.cid + "车</span>";
                                        tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                        if (el.xibie === "二等座" && el.piaozhong === "学生") {
                                            tbody += "<span>" + price1 + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(price1);
                                        } else {
                                            tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(item.price);
                                        }
                                    } else {
                                        tbody += "<td>" + "<span class='orderSpan3'>" + sort + "</span>";
                                        tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                        tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                        tbody += "<span class='orderSpan1'>" + el.piaozhong + "</span>";
                                        tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                        tbody += "<span class='orderSpan1'>" + item.cid + "车</span>";
                                        tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                        if (el.xibie === "二等座" && el.piaozhong === "学生") {
                                            tbody += "<span>" + price1 + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(price1);
                                        } else {
                                            tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(item.price);
                                        }
                                    }
                                } else {
                                    if (length === 2) {
                                        tbody += "<td>" + "<span class='orderSpan2'>" + sort + "</span>";
                                        tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                        tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                        tbody += "<span class='orderSpan3'>" + el.piaozhong + "</span>";
                                        tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                        tbody += "<span class='orderSpan3'>" + item.cid + "车</span>";
                                        tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                        if (el.xibie === "硬座" && el.piaozhong === "学生") {
                                            tbody += "<span>" + price2 + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(price2);
                                        } else {
                                            tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(item.price);
                                        }
                                    } else {
                                        tbody += "<td>" + "<span class='orderSpan3'>" + sort + "</span>";
                                        tbody += "<span class='orderSpan1'>" + el.name + "</span>";
                                        tbody += "<span class='orderSpan3'>" + el.idnumber + "</span>";
                                        tbody += "<span class='orderSpan3'>" + el.piaozhong + "</span>";
                                        tbody += " <span class='orderSpan1'>" + el.xibie + "</span>";
                                        tbody += "<span class='orderSpan3'>" + item.cid + "车</span>";
                                        tbody += "<span class='orderSpan1'>" + item.sid + "</span>";
                                        if (el.xibie === "硬座" && el.piaozhong === "学生") {
                                            tbody += "<span>" + price2 + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(price2);
                                        } else {
                                            tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                            totalPrice2 += parseFloat(item.price);
                                        }
                                    }
                                }
                                tbody += "</tr>";
                                $("#t3").find("tbody").append(tbody);
                                ticketInfoList.splice(index, 1);
                                return false;
                            } else return true;
                        });
                    });
                    totalPrice += totalPrice2;
                    $("#totalPrice2").html("小计：" + totalPrice2 + "（元）");
                    $("#totalPrice").html("总计票价：" + totalPrice + "（元）");
                }
            })
        }
    })
}

//order信息（插入数据库）
function Order() {
    var passengerList = [];
    $("#t2").find("tbody tr").each(function () {
        var orderDetail = {};
        orderDetail.lname = $(this).children('td').find('span:nth-child(2)').html();//乘客姓名
        orderDetail.ltype = $(this).children('td').find('span:nth-child(4)').html();
        orderDetail.ctype = $(this).children('td').find('span:nth-child(5)').html();
        orderDetail.cid = $(this).children('td').find('span:nth-child(6)').html().split('车')[0];
        orderDetail.sid = $(this).children('td').find('span:nth-child(7)').html();
        orderDetail.odprice = $(this).children('td').find('span:nth-child(8)').html().split('（')[0];
        passengerList.push(orderDetail);
    });
    $("#t3").find("tbody tr").each(function () {
        var orderDetail = {};
        orderDetail.lname = $(this).children('td').find('span:nth-child(2)').html();//乘客姓名
        orderDetail.ltype = $(this).children('td').find('span:nth-child(4)').html();
        orderDetail.ctype = $(this).children('td').find('span:nth-child(5)').html();
        orderDetail.cid = $(this).children('td').find('span:nth-child(6)').html().split('车')[0];
        orderDetail.sid = $(this).children('td').find('span:nth-child(7)').html();
        orderDetail.odprice = $(this).children('td').find('span:nth-child(8)').html().split('（')[0];
        passengerList.push(orderDetail);
    });

    var obj = GetRequest();
    var order = {};//订单
    order.tid = obj.tid1 + "," + obj.tid2;//车次
    order.otstartday = obj.sday;//出发日
    order.otorigin = obj.origin1;//起点站
    order.otmidstation = obj.destination1;//中转站
    order.otdestination = obj.destination2;//终点站
    order.otstarttime = obj.startTime1;//起始时间
    order.midendtime = obj.endTime1;//中转到达时间
    order.midstarttime = obj.startTime2;//中转出发时间
    order.otendtime = obj.endTime2;//终到时间
    order.otnumber = $("#t2").find("tbody tr").length;//乘客人数
    order.otprice = $("#totalPrice").html().split('：')[1].split('（')[0];//票价总计
    order.list = passengerList;//乘客订单信息
    $.ajax({
        type: "post",
        url: "/saveOrder",
        dataType: "json",
        data: JSON.stringify(order),
        contentType: "application/json; charset=utf-8",//此处不能省略
        async: false,
        success: function (data) {
            if (data.result === "1") {
                console.log("订单已添加!");
            } else {
                console.log("订单未添加!");
            }
        }
    })
}

//获取订单剩余有效时间
function GetLeftTime() {
    $.ajax({
        type: "post",
        url: "/queryTemporaryOrderEndTime",
        dataType: "json",
        data: {},
        success: function (data) {
            var leftTime = data.result;
            var m = leftTime.split(",")[0];
            var s = leftTime.split(",")[1];
            //订单有效时间 倒计时
            var t = setInterval(function () {
                $("#minute").html(m);
                if (s < 10) {
                    $("#second").html("0" + s);
                } else {
                    $("#second").html(s);
                }
                s--;
                if (s < 0) {
                    s = 59;
                    m--;
                }
                if (m < 0) {
                    clearInterval(t);
                    $("#time").html("订单已失效，请重新下单!");
                    $("#confirmOrder").attr("disabled", true);
                }
            }, 1000);
        }
    })
}

//获取url参数封装成对象
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent((strs[i].split("=")[1]));
        }
    }
    return theRequest;
}
