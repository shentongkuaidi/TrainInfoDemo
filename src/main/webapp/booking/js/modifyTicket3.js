$(function () {

    window.onload = function () {
        //现订单信息
        NewOrder();
        //原订单信息
        OldOrder();
        //差价
        setTimeout('TotalPrice()', 50);
        //订单生成
        setTimeout('Order()', 50);
        //获取m s
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
            var modifyInfo = [];
            modifyInfo = JSON.parse($.cookie("modifyInfo"));
            var lNames = [];
            for (var i = 0; i < modifyInfo.length; i++) {//改签的乘客信息
                lNames.push(modifyInfo[i].lname);
            }
            var params = {};
            params.otid = modifyInfo[0].otid;
            params.otstatus = "3";
            $.ajax({
                type: "post",
                url: "/queryOrderDetailCount",
                dataType: "json",
                data: params,
                success: function (data) {
                    params.lnames = lNames;
                    if (data.orderDetailCount === modifyInfo.length) {//全部改签
                        $.ajax({
                            type: "post",
                            url: "/modifyOrder2",
                            dataType: "json",
                            data: params,
                            traditional: true,
                            success: function (data) {
                                if (data.result === "1") {
                                    swal({
                                        title: "",
                                        text: "改签成功！",
                                        type: "success"
                                    }, function () {
                                        $.cookie("modifyInfo",'',{expires:-1,path:'/'});
                                        window.location.href = "../index.html";
                                    });
                                } else {
                                    swal("", "系统异常，稍后重试！", "error");
                                }
                            }
                        })
                    } else {
                        $.ajax({
                            type: "post",
                            url: "/modifyOrder1",
                            dataType: "json",
                            data: params,
                            traditional: true,
                            success: function (data) {
                                if (data.result === "1") {
                                    swal({
                                        title: "",
                                        text: "改签成功！",
                                        type: "success"
                                    }, function () {
                                        $.cookie("modifyInfo",'',{expires:-1,path:'/'});
                                        window.location.href = "../index.html";
                                    });
                                } else {
                                    swal("", "系统异常，稍后重试！", "error");
                                }
                            }
                        })
                    }
                }
            })
        })
    })
});

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

//获取车次类型
function GetTid() {
    var obj = GetRequest();
    var tid = obj.tid;//车次
    var TidType = tid.substr(0, 1);
    return TidType;
}

//原订单详细信息
function OldOrder() {
    var modifyInfo = [];
    modifyInfo = JSON.parse($.cookie("modifyInfo"));//需要修改的订单信息
    var passengerInfo = [];
    passengerInfo = JSON.parse($.cookie("passengerInfo"));//上一页面乘客信息
    $("#t2").find("tbody").empty();
    var params = {};
    params.otid = modifyInfo[0].otid;
    $.ajax({
        type: "post",
        url: "/queryModifyOrder",
        dataType: "json",
        data: params,
        success: function (data) {
            var info = data.modifyOrder;
            //车次信息
            var str = "星期" + "日一二三四五六".charAt(new Date(info.otstartday).getDay());
            var td = "<td style='font-size: 16px;height: 35px;background-color: #d9d9d9'>";
            td += "<b>" + info.otstartday + "</b>" + "（" + str + "）" + "&nbsp;&nbsp;&nbsp;" + "<b>" + info.tid + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + info.otorigin + "</b>" + "站" + "（" + info.otstarttime + "）" + "➜➜➜" + "&nbsp;&nbsp;" + "<b>" + info.otdestination + "</b>" + "站" + "（" + info.otendtime + "）" + "</td>";
            $("#t2").find("thead tr:eq(1)").append(td);
            //乘客信息
            var totalPrice = 0;
            for (var i = 0; i < modifyInfo.length; i++) {
                $.each(info.list, function (index, el) {
                    var sort = parseInt(i) + parseInt(1);
                    if (el.lname === modifyInfo[i].lname) {
                        var tbody = "<tr>";
                        if (info.tid.charAt(0) === "G" || info.tid.charAt(0) === "D") {
                            if (el.lname.length === 2) {
                                tbody += "<td style='background-color: #d9d9d9'>" + "<span class='orderSpan2'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.lname + "</span>";
                                tbody += "<span class='orderSpan3'>" + passengerInfo[i].idnumber + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.ltype + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.ctype + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + el.sid + "</span>";
                                tbody += "<span>" + el.odprice + "（元）</span>" + "</td>";
                                totalPrice += parseFloat(el.odprice);
                            } else {
                                tbody += "<td style='background-color: #d9d9d9'>" + "<span class='orderSpan3'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.lname + "</span>";
                                tbody += "<span class='orderSpan3'>" + passengerInfo[i].idnumber + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.ltype + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.ctype + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + el.sid + "</span>";
                                tbody += "<span>" + el.odprice + "（元）</span>" + "</td>";
                                totalPrice += parseFloat(el.odprice);
                            }
                            $("#t2").find("tbody").append(tbody);
                        } else {
                            if (el.lname.length === 2) {
                                tbody += "<td style='background-color: #d9d9d9'>" + "<span class='orderSpan2'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.lname + "</span>";
                                tbody += "<span class='orderSpan3'>" + passengerInfo[i].idnumber + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.ltype + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.ctype + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + el.sid + "</span>";
                                tbody += "<span>" + el.odprice + "（元）</span>" + "</td>";
                                totalPrice += parseFloat(el.odprice);
                            } else {
                                tbody += "<td style='background-color: #d9d9d9'>" + "<span class='orderSpan3'>" + sort + "</span>";
                                tbody += "<span class='orderSpan1'>" + el.lname + "</span>";
                                tbody += "<span class='orderSpan3'>" + passengerInfo[i].idnumber + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.ltype + "</span>";
                                tbody += " <span class='orderSpan1'>" + el.ctype + "</span>";
                                tbody += "<span class='orderSpan3'>" + el.cid + "车</span>";
                                tbody += "<span class='orderSpan1'>" + el.sid + "</span>";
                                tbody += "<span>" + el.odprice + "（元）</span>" + "</td>";
                                totalPrice += parseFloat(el.odprice);
                            }
                            $("#t2").find("tbody").append(tbody);
                        }
                    }
                })
            }
            $("#totalPrice1").html("总计票价：" + totalPrice + "（元）");
        }
    });
}

//现订单详细信息
function NewOrder() {
    //现订单车次信息
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    var obj = GetRequest();
    var sday = obj.sday;//出发日
    var tid = obj.tid;//车次
    var origin = obj.origin;//起点站
    var destination = obj.destination;//终点站
    var startTime = obj.startTime;//起始时间
    var endTime = obj.endTime;//终到时间
    var td = "<td style='font-size: 16px;height: 35px'>";
    td += "<b>" + sday + "</b>" + "（" + str + "）" + "&nbsp;&nbsp;&nbsp;" + "<b>" + tid + "</b>" + "&nbsp;&nbsp;&nbsp;" + "<b>" + origin + "</b>" + "站" + "（" + startTime + "）" + "➜➜➜" + "&nbsp;&nbsp;" + "<b>" + destination + "</b>" + "站" + "（" + endTime + "）" + "</td>";
    $("#t3").find("thead tr:eq(1)").append(td);
    //乘客信息
    $("#t3").find("tbody").empty();
    var passengerInfo = [];
    passengerInfo = JSON.parse($.cookie("passengerInfo"));
    var totalPrice = 0;//票价总计
    var params = {};
    params.sday = sday;
    params.tid = tid;
    params.origin = origin;
    params.destination = destination;
    $.ajax({
        type: "post",
        url: "/ticketInfo",
        dataType: "json",
        data: params,
        success: function (data) {
            var ticketInfoList = data.ticketInfoList;//余座信息
            var TidType = GetTid();
            $.each(passengerInfo, function (index, el) {
                var sort = parseInt(index) + parseInt(1);
                $.each(ticketInfoList, function (index, item) {
                    if (item.ctype === el.xibie) {
                        var tbody = "<tr>";
                        var length = el.name.length;
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
                                    totalPrice += parseFloat(price1);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice += parseFloat(item.price);
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
                                    totalPrice += parseFloat(price1);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice += parseFloat(item.price);
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
                                    totalPrice += parseFloat(price2);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice += parseFloat(item.price);
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
                                    totalPrice += parseFloat(price2);
                                } else {
                                    tbody += "<span>" + item.price + "（元）</span>" + "</td>";
                                    totalPrice += parseFloat(item.price);
                                }
                            }
                        }
                        tbody += "</tr>";
                        $("#t3").find("tbody").append(tbody);
                        ticketInfoList.splice(index, 1);//去除刚刚占用的座位
                        return false;
                    } else return true;
                });
            });
            $("#totalPrice2").html("总计票价：" + totalPrice + "（元）");
        }
    })
}

function TotalPrice() {
    var totalPrice1 = $("#totalPrice1").html().split('：')[1].split("（")[0];
    var totalPrice2 = $("#totalPrice2").html().split('：')[1].split("（")[0];
    var totalPrice = parseFloat(totalPrice2) - parseFloat(totalPrice1);
    $("#totalPrice").html("补差价：" + totalPrice + "（元）");
}

//order信息（插入数据库）
function Order() {
    var passengerList = [];//乘客订单信息
    $("#t3").find("tbody tr").each(function () {
        var orderdetail = {};
        orderdetail.lname = $(this).children('td').find('span:nth-child(2)').html();//乘客姓名
        orderdetail.ltype = $(this).children('td').find('span:nth-child(4)').html();
        orderdetail.ctype = $(this).children('td').find('span:nth-child(5)').html();
        orderdetail.cid = $(this).children('td').find('span:nth-child(6)').html().split('车')[0];
        orderdetail.sid = $(this).children('td').find('span:nth-child(7)').html();
        orderdetail.odprice = $(this).children('td').find('span:nth-child(8)').html().split('（')[0];
        passengerList.push(orderdetail);
    });
    var obj = GetRequest();
    var order = {};//订单
    order.tid = obj.tid;//车次
    order.otstartday = obj.sday;//出发日
    order.otorigin = obj.origin;//起点站
    order.otdestination = obj.destination;//终点站
    order.otstarttime = obj.startTime;//起始时间
    order.otendtime = obj.endTime;//终到时间
    order.otnumber = $("#t3").find("tbody tr").length;//乘客人数
    order.otprice = $("#totalPrice").html().split('：')[1].split('（')[0];//票价总计
    order.list = passengerList;//乘客订单信息
    $.ajax({
        type: "post",
        url: "/saveOrder",
        dataType: "json",
        data: JSON.stringify(order),
        contentType: "application/json; charset=utf-8",//此处不能省略
        success: function (data) {
            if (data.result === "1") {
                console.log("订单已添加!");
            } else {
                console.log("订单未添加!");
            }
        }
    })
}

//根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
}

//获取url参数封装成对象
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent((strs[i].split("=")[1]));
        }
    }
    return theRequest;
}
