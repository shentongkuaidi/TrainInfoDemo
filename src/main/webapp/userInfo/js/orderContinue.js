$(function () {
    window.onload = function () {
        $.ajax({
            type: "post",
            url: "/loginConfirm",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result === "1") {
                    $("#userName").html("<b>" + data.user.uid + "</b>");
                } else {
                    $("#exit").hide();
                }
            }
        });

        LoadOrder();
        GetLeftTime();

        //取消订单
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
                                if($.cookie("modifyInfo") !== undefined || $.cookie("modifyInfo") !== ""){
                                    $.cookie("modifyInfo",'',{expires:-1,path:'/'});
                                }
                                window.location.reload();
                            });
                        } else {
                            swal("", "系统异常，稍后重试！", "error");
                        }
                    }
                })
            })
        });

        //继续支付
        $("#continueOrder").click(function () {
            swal({
                title: "",
                text: '支付中。。。。。。请稍等',
                imageUrl: "../booking/images/loading.gif",
                html: true,
                timer: 3000,
                showConfirmButton: false
            }, function () {
                var params = {};
                console.log($.cookie("modifyInfo"));
                if ($.cookie("modifyInfo") === undefined  || $.cookie("modifyInfo") === "") {
                    //网上支付
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
                                    window.location.href = "OrderContinue.html";
                                })
                            } else {
                                swal("", "系统异常，稍后重试！", "error");
                            }
                        }
                    })
                } else {
                    //改签
                    var modifyInfo = [];
                    modifyInfo = JSON.parse($.cookie("modifyInfo"));
                    console.log(modifyInfo);
                    var lNames = [];
                    for (var i = 0; i < modifyInfo.length; i++) {//改签的乘客信息
                        lNames.push(modifyInfo[i].lname);
                    }
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
                                    traditional: true,
                                    data: params,
                                    success: function (data) {
                                        if (data.result === "1") {
                                            swal({
                                                title: "",
                                                text: "改签成功！",
                                                type: "success"
                                            }, function () {
                                                $.cookie("modifyInfo",'',{expires:-1,path:'/'});
                                                window.location.reload();
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
                                    traditional: true,
                                    data: params,
                                    success: function (data) {
                                        if (data.result === "1") {
                                            swal({
                                                title: "",
                                                text: "改签成功！",
                                                type: "success"
                                            }, function () {
                                                $.cookie("modifyInfo",'',{expires:-1,path:'/'});
                                                window.location.reload();
                                            });
                                        } else {
                                            swal("", "系统异常，稍后重试！", "error");
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        })
    }
});


//获取订单剩余有效时间
function GetLeftTime() {
    $.ajax({
        type: "post",
        url: "/queryTemporaryOrderEndTime",
        dataType: "json",
        data: {},
        success: function (data) {
            if (data.result !== "0") {
                var leftTime = data.result;
                var m = leftTime.split(",")[0];
                var s = leftTime.split(",")[1];
                //订单有效时间 倒计时
                var t = setInterval(function () {
                    s--;
                    if (s < 0) {
                        s = 59;
                        m--;
                    }
                    if (m < 0) {
                        clearInterval(t);
                        $("#orderDetail").empty("");
                        var order = "";
                        order += "<table>" +
                            "<tr style='height: 283px'>" +
                            "<td style='text-align: center;font-size: 20px;color: #7F9DB9'>您当前并无未完成订单<br>如需购票，请前往&nbsp;&nbsp;<a href='/booking/SearchTicket.html' style='color: #149bdf'>车票预定</a></td>" +
                            "</tr>" +
                            "</table>";
                        $("#orderDetail").append(order);
                    }
                    if (s < 10) {
                        $("#left").html("◷&nbsp;" + "0" + m + "&nbsp;分钟&nbsp;" + "0" + s + "&nbsp;秒");
                    } else {
                        $("#left").html("◷&nbsp;" + "0" + m + "&nbsp;分钟&nbsp;" + s + "&nbsp;秒");
                    }
                }, 1000);
            } else {
                $("#orderDetail").empty("");
                var order = "";
                order += "<table>" +
                    "<tr style='height: 283px'>" +
                    "<td style='text-align: center;font-size: 20px;color: #7F9DB9'>您当前并无未完成订单<br>如需购票，请前往&nbsp;&nbsp;<a href='../booking/SearchTicket.html' style='color: #149bdf'>车票预定</a></td>" +
                    "</tr>" +
                    "</table>";
                $("#orderDetail").append(order);
            }
        }
    })
}

//加载对应订单
function LoadOrder() {
    var params = {};
    params.otstatus = "0";
    $.ajax({
        type: "post",
        url: "/continueOrder",
        dataType: "json",
        data: params,
        async: false,
        success: function (data) {
            var order = "";
            if (data.result === "1") {
                $("#orderDetail").empty("");
                var table = "";
                table += "<div id='head'>";
                if (data.orderInfo.otmidstation === "" || data.orderInfo.otmidstation === null)
                    table += "<p class='head'>&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "订单日期:" + data.orderInfo.ottime + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "" + data.orderInfo.otorigin + "➜" + data.orderInfo.otdestination + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "" + data.orderInfo.otnumber + "人&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "乘车日期:" + data.orderInfo.otstartday + "&nbsp;&nbsp;" + data.orderInfo.otstarttime + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "订单总价:" + data.orderInfo.otprice + "(元)&nbsp;&nbsp;&nbsp;" +
                        "<a id='left' style='color: red;text-decoration: none;outline: none;cursor: pointer;'></a></p>";
                else
                    table += "<p class='head'>&nbsp;&nbsp;" +
                        "订单日期:" + data.orderInfo.ottime + "&nbsp;&nbsp;" +
                        "" + data.orderInfo.otorigin + "➜" + data.orderInfo.otmidstation + "➜" + data.orderInfo.otdestination + "&nbsp;&nbsp;" +
                        "" + data.orderInfo.otnumber + "人&nbsp;&nbsp;" +
                        "乘车日期:" + data.orderInfo.otstartday + "&nbsp;" + data.orderInfo.otstarttime + "&nbsp;&nbsp;" +
                        "总价:" + data.orderInfo.otprice + "(元)&nbsp;&nbsp;" +
                        "<a id='left' style='color: red;text-decoration: none;outline: none;cursor: pointer;'></a></p>";
                table += "</div>";
                table += "<div id='body'>";
                table += "<table border='1' style='border-color: #149bdf;font-size: 12px'>" +
                    "<thead>" +
                    "<tr>" +
                    "<td>序号</td>" +
                    "<td>车次信息</td>" +
                    "<td>座位信息</td>" +
                    "<td>旅客信息</td>" +
                    "<td>票款金额</td>" +
                    "<td>车票状态</td>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";
                $.each(data.orderInfo.list, function (index, item) {
                        var orderId = parseInt(index) + parseInt(1);
                        if (item.origin === "" || item.origin === null)
                            table += "<tr>" +
                                "<td>" + orderId + "</td>" +
                                "<td>" + data.orderInfo.otstarttime + "开<br>" + item.tid + data.orderInfo.otorigin + "➜" + data.orderInfo.otdestination + "</td>" +
                                "<td>" + item.cid + "车&nbsp;" + item.sid + "<br>" + item.ctype + "</td>" +
                                "<td>" + item.lname + "<br>二代身份证</td>" +
                                "<td>" + item.ltype + "<br>" + item.odprice + "(元)</td>" +
                                "<td>" + data.orderInfo.sname + "</td>";
                        else {
                            table += "<tr>";
                            if (index % 2 === 0) {
                                var num = parseInt(index / 2) + parseInt(1);
                                table += "<td rowspan='2'>" + num + "</td>";
                            }
                            table += "<td>" + item.starttime + "开<br>" + item.tid + item.origin + "➜" + item.destination + "</td>" +
                                "<td>" + item.cid + "车&nbsp;" + item.sid + "<br>" + item.ctype + "</td>" +
                                "<td>" + item.lname + "<br>二代身份证</td>" +
                                "<td>" + item.ltype + "<br>" + item.odprice + "(元)</td>";
                            if (index % 2 === 0)
                                table += "<td rowspan='2'>" + data.orderInfo.sname + "</td>";
                        }
                        table += "</tr>";
                    }
                );
                table += "</tbody>";
                table += "</table>" +
                    "</div>";
                table += "<div style='line-height: 35px;font-size: 18px;text-align: center;margin-bottom: 5px;'>" +
                    "<hr>" +
                    "<a id='cancelOrder' style='text-decoration: none;outline: none;cursor: pointer;margin-right: 30px'>取消订单</a>" +
                    "<a id='continueOrder' style='text-decoration: none;outline: none;cursor: pointer;margin-left: 30px'>继续支付</a>" +
                    "<hr>" +
                    "</div>";
                order += table;

                $("#orderDetail").append(order);
            }

            else {
                $("#orderDetail").empty("");
                var table = "";
                table += "<table>" +
                    "<tr style='height: 283px'>" +
                    "<td style='text-align: center;font-size: 20px;color: #7F9DB9'>您当前并无未完成订单<br>如需购票，请前往&nbsp;&nbsp;<a href='/booking/SearchTicket.html' style='color: #149bdf'>车票预定</a></td>" +
                    "</tr>" +
                    "</table>";
                order += table;
                $("#orderDetail").append(order);
            }
        }
    })
}