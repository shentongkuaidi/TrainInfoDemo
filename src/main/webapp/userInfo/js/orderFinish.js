function startDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth();
    var d = now.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
}

function endDate() {
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 29);
    var y = endDate.getFullYear();
    var m = endDate.getMonth() + 1;
    var d = endDate.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
}

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
        })
    };

    $("#future").click(function () {
        $("#orderDetail").empty("");
        $("#search1").css({"display": "inline"});
        $("#status").css({"display": "inline"});
        $("#search2").css({"display": "none"});
    });

    $("#history").click(function () {
        $("#orderDetail").empty("");
        $("#all").attr("checked", "checked");//设置为全部
        $("#search1").css({"display": "none"});
        $("#status").css({"display": "none"});
        $("#search2").css({"display": "inline"});
    });

    $('#startDay1').click(function () {
        WdatePicker({
            doubleCalendar: true,
            dateFmt: 'yyyy-MM-dd',
            minDate: startDate(),
            maxDate: endDate()
        });
    });
    $('#endDay1').click(function () {
        WdatePicker({
            doubleCalendar: true,
            dateFmt: 'yyyy-MM-dd',
            minDate: startDate(),
            maxDate: endDate()
        });
    });
    $('#startDay2').click(function () {
        WdatePicker({
            doubleCalendar: true,
            dateFmt: 'yyyy-MM-dd',
            minDate: startDate(),
            maxDate: endDate()
        });
    });
    $('#endDay2').click(function () {
        WdatePicker({
            doubleCalendar: true,
            dateFmt: 'yyyy-MM-dd',
            minDate: startDate(),
            maxDate: endDate()
        });
    });

    $("#button1").click(function () {
        if ($("#startDay1").val() !== "" && $("#endDay1").val() !== "" || $("#tidOrName1").val() !== "") {
            LoadOrder();
            Slow();
        }
    });

    $("#button2").click(function () {
        if ($("#startDay2").val() !== "" && $("#endDay2").val() !== "" || $("#tidOrName2").val() !== "") {
            LoadOrder();
            Slow();
        }
    });

    $(":radio").click(function () {
        if ($("#startDay1").val() !== "" || $("#endDay1").val() !== "" || $("#tidOrName1").val() !== "") {
            LoadOrder();
            Slow();
        }
    })

});

function GetParams() {
    var params = {};
    params.status = $("#selectType").find("option:selected").val();//乘车日期  or 订单日期
    params.method = $("input:radio:checked").val();//全部、可改签、可退票
    if ($(".active a:first").html() === "未出行订单") {
        params.tidOrName1 = $("#tidOrName1").val();//乘客姓名 or 车次
        params.start1 = $("#startDay1").val();//未出行：开始日期
        params.end1 = $("#endDay1").val();//未出行：结束日期
        params.start2 = "";//历史：开始日期
        params.end2 = "";//历史：结束日期
        params.future = "+1";//未出行订单
    } else {
        params.tidOrName2 = $("#tidOrName2").val();//乘客姓名 or 车次
        params.start1 = "";//未出行：开始日期
        params.end1 = "";//未出行：结束日期
        params.start2 = $("#startDay2").val();//历史：开始日期
        params.end2 = $("#endDay2").val();//历史：结束日期
        params.history = "-1";//历史订单
    }
    return params;
}

//加载对应订单
function LoadOrder() {
    var params = GetParams();
    var otidList = [];//订单号
    var time = [];//出发日期
    var tidList = [];//车次号
    var originList = [];//起始站
    var destinationList = [];//终点站
    var sdayList = [];//出发日
    $.ajax({
        type: "post",
        url: "/queryOrder",
        dataType: "json",
        data: params,
        async: false,
        success: function (data) {
            var order = "";
            if (data.result === "1") {
                $("#orderDetail").empty("");
                $.each(data.orderList, function (index, el) {
                    otidList.push(el.otid);//订单号列表
                    tidList.push(el.tid);//车次号列表
                    originList.push(el.otorigin);//起始站列表
                    destinationList.push(el.otdestination);//终点站列表
                    sdayList.push(el.otstartday);//出发日列表
                    var number = parseInt(index) + parseInt(1);
                    var startTime = new Date(el.otstartday + " " + el.otstarttime);
                    var now = new Date();
                    var leftTime = startTime.getTime() - now.getTime();
                    time.push(leftTime);//剩余时间加入时间数组
                    var leave = parseInt(leftTime / (24 * 3600 * 1000));//计算天数
                    var leave1 = leftTime % (24 * 3600 * 1000);//计算天数后剩余的毫秒数
                    var hours = Math.floor(leave1 / (3600 * 1000));//距出发时间剩余小时数
                    var table = "";
                    table += "<div id='head" + number + "'>";
                    if (el.otmidstation === "" || el.otmidstation === null)
                        table += "<p class='head'>" +
                            "<span>订单日期:" + el.ottime + "</span>" +
                            "<span>" + el.otorigin + "➜" + el.otdestination + "</span>" +
                            "<span>" + el.otnumber + "人</span>" +
                            "<span>乘车日期:" + el.otstartday + "&nbsp;&nbsp;" + el.otstarttime + "</span>" +
                            "<span>总价:" + el.otprice + "(元)</span>" +
                            "<a style='color: red'>详情☜</a>";
                    else {
                        table += "<p class='head'>" +
                            "<span>订单日期:" + el.ottime + "</span>" +
                            "<span>" + el.otorigin + "➜" + el.otmidstation + "➜" + el.otdestination + "</span>" +
                            "<span>" + el.otnumber + "人</span>" +
                            "<span>乘车日期:" + el.otstartday + "&nbsp;&nbsp;" + el.otstarttime + "</span>";
                        if (el.list.length > 2)
                            table += "<span>总价:" + el.otprice + "(元)</span><br>";
                        else
                            table += "<span>总价:" + el.otprice + "(元)</span>";
                        table += "<a style='color: red'>详情☜</a>";
                    }
                    if (el.otmidstation === "" || el.otmidstation === null) {
                        if ((hours >= 2 || leave >= 1) && el.list.length > 1 && el.sname === "已改签") {
                            table += "<a id='quit' href='#'>退票</a>";
                        } else if ((hours >= 2 || leave >= 1) && el.list.length > 1) {
                            table += "<a id='quit' href='#'>退票</a><a id='modify' href='#'>改签</a>";
                        } else if (hours >= 1 && el.list.length > 1 && el.sname !== "已改签") {
                            table += "<a id='modify' href='#'>改签</a>";
                        }
                    } else {
                        if ((hours >= 2 || leave >= 1) && el.list.length > 2 && el.sname === "已改签") {
                            table += "<a id='quit' href='#'>退票</a>";
                        } else if ((hours >= 2 || leave >= 1) && el.list.length > 2) {
                            table += "<a id='quit' href='#'>退票</a><a id='modify' href='#'>改签</a>";
                        } else if (hours >= 1 && el.list.length > 2 && el.sname !== "已改签") {
                            table += "<a id='modify' href='#'>改签</a>";
                        }
                    }
                    table += "</p></div>";
                    table += "<div id='body" + number + "'>";
                    table += "<table border='1' style='border-color: #149bdf;font-size: 12px'>" +
                        "<thead>" +
                        "<tr>" +
                        "<td>序号</td>" +
                        "<td>车次信息</td>" +
                        "<td>座位信息</td>" +
                        "<td>旅客信息</td>" +
                        "<td>票款金额</td>" +
                        "<td>车票状态</td>" +
                        "<td>操作</td>" +
                        "</tr>" +
                        "</thead>" +
                        "<tbody>";
                    $.each(el.list, function (index, item) {
                        var orderId = parseInt(index) + parseInt(1);
                        var detail = "";
                        if (item.origin === "" || item.origin === null) {
                            if (el.list.length === 1 || (leave <= 0 && hours < 1)) {
                                detail += "<tr><td>" + orderId + "</td>";
                            } else {
                                detail += "<tr><td><input type='checkbox' style='margin-bottom: 6px'/>" + orderId + "</td>";
                            }
                            detail += "<td>" + el.otstarttime + "开<br>" + item.tid + " " + el.otorigin + "➜" + el.otdestination + "</td>" +
                                "<td>" + item.cid + "车&nbsp;" + item.sid + "<br>" + item.ctype + "</td>" +
                                "<td>" + item.lname + "<br>二代身份证</td>" +
                                "<td>" + item.ltype + "<br>" + item.odprice + "（元）</td>" +
                                "<td>" + el.sname + "</td>";
                            if (data.history === "-1") {//历史订单（无操作）
                                detail += "<td>--</td></tr>";
                            } else if (el.sname === "已改签" && (hours >= 2 || leave >= 1)) {
                                detail += "<td><a id='quit' href='#'>退票</a><br></td></tr>";
                            } else if (hours >= 2 || leave >= 1) {
                                detail += "<td><a id='quit' href='#'>退票</a><br>" +
                                    "<a id='modify' href='#'>改签</a></td></tr>";
                            } else if (hours >= 1 && el.sname !== "已改签") {
                                detail += "<td><a id='modify' href='#'>改签</a></td></tr>";
                            } else {
                                detail += "<td>--</td></tr>";
                            }
                        } else {
                            var num = parseInt(index / 2) + parseInt(1);
                            if (index % 2 === 0) {
                                if (el.list.length === 2 || (leave <= 0 && hours < 1)) {
                                    detail += "<tr><td rowspan='2'>" + num + "</td>";
                                } else {
                                    detail += "<tr><td rowspan='2'><input type='checkbox' style='margin-bottom: 6px'/>" + num + "</td>";
                                }
                            }
                            detail += "<td>" + item.starttime + "开<br>" + item.tid + " " + item.origin + "➜" + item.destination + "</td>" +
                                "<td>" + item.cid + "车&nbsp;" + item.sid + "<br>" + item.ctype + "</td>" +
                                "<td>" + item.lname + "<br>二代身份证</td>" +
                                "<td>" + item.ltype + "<br>" + item.odprice + "（元）</td>";
                            if (index % 2 === 0)
                                detail += "<td rowspan='2'>" + el.sname + "</td>";
                            if (index % 2 === 0) {
                                if (data.history === "-1") {//历史订单（无操作）
                                    detail += "<td rowspan='2'>--</td></tr>";
                                } else if (el.sname === "已改签" && (hours >= 2 || leave >= 1)) {
                                    detail += "<td rowspan='2'><a id='quit' href='#'>退票</a><br></td></tr>";
                                } else if (hours >= 2 || leave >= 1) {
                                    detail += "<td rowspan='2'><a id='quit' href='#'>退票</a><br>" +
                                        "<a id='modify' href='#'>改签</a></td></tr>";
                                } else if (hours >= 1 && el.sname !== "已改签") {
                                    detail += "<td rowspan='2'><a id='modify' href='#'>改签</a></td></tr>";
                                } else {
                                    detail += "<td rowspan='2'>--</td></tr>";
                                }
                            }
                        }
                        table += detail;
                    });
                    table += "</tbody>" +
                        "</table>" +
                        "</div>";
                    order += table;
                });
                $("#orderDetail").append(order);
            } else {
                $("#orderDetail").empty("");
                var table = "";
                table += "<table>" +
                    "<tr style='height: 150px'>" +
                    "<td style='text-align: center;font-size: 20px;color: #7F9DB9'>暂未添加任何订单</td>" +
                    "</tr>" +
                    "</table>";
                order += table;
                $("#orderDetail").append(order);
            }
        }
    });

    var date = new Date();
    date.setTime(date.getTime() + (10 * 60 * 1000));//cookie过期时间10分钟
    var percent = 1;//手续百分比
    var price;//对应手续费
    var leftPrice;//退款
    //获取需要操作的参数列表——多个乘客
    $('#orderDetail').find('div:nth-child(odd)').each(function (index) {
        var number = parseInt(index) + parseInt(1);
        //改签
        $(this).find('#modify').click(function () {
            var modifyInfo = [];
            $('#body' + number).find('table tbody tr').each(function () {
                var passenger = {};
                if ($(this).find(':checkbox').is(':checked')) {
                    passenger.lname = $(this).find('td:nth-child(4)').html().split('<')[0];//乘客
                    passenger.ctype = $(this).find('td:nth-child(3)').html().split('>')[1];//席别
                    passenger.ltype = $(this).find('td:nth-child(5)').html().split('<')[0];//乘客类型
                    passenger.otid = otidList[index];
                    modifyInfo.push(passenger);
                }
            });
            if ($('#body' + number).find(':checkbox').is(':checked') === false) {
                swal("", "请选择需要修改的车票！", "warning");
            } else {
                $.cookie("modifyInfo", JSON.stringify(modifyInfo), {expires: date, path: "/"});
                window.location.href = "/booking/ModifyTicket1.html?tid=" + tidList[index] + '&origin=' +
                    originList[index] + '&destination=' + destinationList[index] + '&sday=' + sdayList[index];
            }
        });
        //退票
        $(this).find('#quit').click(function () {
            var lnames = [];//乘客数组
            var totalPrice = 0;//需要退订的票面总价
            $('#body' + number).find('table tbody tr').each(function () {
                if ($(this).find(':checkbox').is(':checked')) {
                    lnames.push($(this).find('td:nth-child(4)').html().split('<')[0]);//乘客加入数组
                    if ($(this).next('tr').html() !== null)
                        if ($(this).next('tr').find('td:nth-child(1)').html().indexOf('<br>') === -1)
                            totalPrice += parseFloat($(this).find('td:nth-child(5)').html().split('>')[1].split('（')[0]);//票价
                        else
                            totalPrice += parseFloat($(this).find('td:nth-child(5)').html().split('>')[1].split('（')[0]) +
                                parseFloat($(this).next('tr').find('td:nth-child(4)').html().split('>')[1].split('（')[0]);
                    else
                        totalPrice += parseFloat($(this).find('td:nth-child(5)').html().split('>')[1].split('（')[0]);
                }
            });
            //获取退票手续费百分比、手续费
            var leave = parseInt(time[index] / (24 * 3600 * 1000));//计算天数
            var leave1 = time[index] % (24 * 3600 * 1000);//计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));//距出发时间剩余小时数
            if (leave > 15) {
                percent = 0.05;
            } else if (leave >= 2) {
                percent = 0.1;
            } else {
                percent = 0.2;
            }
            price = parseFloat((parseFloat(totalPrice) * parseFloat(percent)).toFixed(2));
            leftPrice = parseFloat((parseFloat(totalPrice) - price).toFixed(2));
            var msg = "— — — — —距本车次出发时间还剩 " + leave + " 天 " + hours + " 小时！— — — — —\n\n" +
                "您本次退订的票面总价为：" + totalPrice + "（元）\n\n" +
                "手续费百分比为：" + percent + "   对应手续费为：" + price + "（元）\n\n" +
                "退回原支付账户：" + leftPrice + "（元）\n\n" +
                "— — — — — — — — — — 请确认！— — — — — — — — — —";
            var params = {};
            params.otid = otidList[index];//订单号
            params.lnames = lnames;//退票的乘客数组
            console.log(lnames.length);
            if ($('#body' + number).find(':checkbox').is(':checked') === false) {
                swal("", "请选择需要退订的车票！", "warning");
            } else {
                swal({
                    title: "",
                    text: msg,
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: "是的，我要退票",
                    confirmButtonColor: "#ec6c62"
                }, function () {
                    if ($('#body' + number).find('table tbody tr').length === lnames.length || $('#body' + number).find('table tbody tr').length/2 === lnames.length) {//全部退票
                        $.ajax({
                            type: "post",
                            url: "/quitOrder2",
                            dataType: "json",
                            data: params,
                            traditional: true,
                            success: function (data) {
                                if (data.result === "1") {
                                    swal("", "退票成功!\n\n退款将在1-7个工作日退回原支付账户", "success");
                                    LoadOrder();
                                } else {
                                    swal("", "系统异常，稍后重试！", "error");
                                }
                            }
                        })
                    } else {//部分退票
                        $.ajax({
                            type: "post",
                            url: "/quitOrder1",
                            dataType: "json",
                            data: params,
                            traditional: true,
                            success: function (data) {
                                if (data.result === "1") {
                                    swal("", "退票成功!\n\n退款将在1-7个工作日退回原支付账户", "success");
                                    LoadOrder();
                                } else {
                                    swal("", "系统异常，稍后重试！", "error");
                                }
                            }
                        })
                    }
                })
            }
        })
    });

    //获取需要操作的参数列表——单个乘客
    $("#orderDetail").find('div:nth-child(even)').each(function (index) {
        var modifyInfo = [];
        var passenger = {};
        //改签
        $(this).find('table tbody tr').find('#modify').click(function () {
            passenger.lname = $(this).parent().parent().find('td:nth-child(4)').html().split('<')[0];
            passenger.ctype = $(this).parent().parent().find('td:nth-child(3)').html().split('>')[1];
            passenger.ltype = $(this).parent().parent().find('td:nth-child(5)').html().split('<')[0];
            passenger.otid = otidList[index];
            modifyInfo.push(passenger);
            $.cookie("modifyInfo", JSON.stringify(modifyInfo), {expires: date, path: "/"});
            window.location.href = "/booking/ModifyTicket1.html?tid=" + tidList[index] + '&origin=' +
                originList[index] + '&destination=' + destinationList[index] + '&sday=' + sdayList[index];
        });

        //退票
        $(this).find('table tbody tr').find('#quit').click(function () {
                var lnames = [];
                lnames.push($(this).parent().parent().find('td:nth-child(4)').html().split('<')[0]);
                var params = {};
                params.lnames = lnames;
                params.otid = otidList[index];
                //获取退票手续费百分比、手续费
                var leave = parseInt(time[index] / (24 * 3600 * 1000));//计算天数
                var leave1 = time[index] % (24 * 3600 * 1000);//计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));//距出发时间剩余小时数
                if (leave > 15) {
                    percent = 0.05;
                } else if (leave >= 2) {
                    percent = 0.1;
                } else {
                    percent = 0.2;
                }
                var totalPrice;
                if ($(this).parent().parent().next('tr').html() !== null)
                    if ($(this).parent().parent().next('tr').find('td:nth-child(1)').html().indexOf('<br>') === -1)
                        totalPrice = parseFloat($(this).parent().parent().find('td:nth-child(5)').html().split('>')[1].split('（')[0]);
                    else
                        totalPrice = parseFloat($(this).parent().parent().find('td:nth-child(5)').html().split('>')[1].split('（')[0]) +
                            parseFloat($(this).parent().parent().next('tr').find('td:nth-child(4)').html().split('>')[1].split('（')[0]);
                else
                    totalPrice = parseFloat($(this).parent().parent().find('td:nth-child(5)').html().split('>')[1].split('（')[0]);
                price = parseFloat((parseFloat(totalPrice) * parseFloat(percent)).toFixed(2));
                leftPrice = parseFloat((parseFloat(totalPrice) - price).toFixed(2));
                var msg = "— — — — —距本车次出发时间还剩 " + leave + " 天 " + hours + " 小时！— — — — —\n\n" +
                    "您本次退订的票面总价为：" + totalPrice + "（元）\n\n" +
                    "手续费百分比为：" + percent + "  对应手续费为：" + price + "（元）\n\n" +
                    "退回原支付账户：" + leftPrice + "（元）\n\n" +
                    "— — — — — — — — — — 请确认！— — — — — — — — — —";
                //确认退票
                var tr_length = $(this).parent().parent().parent().parent().find('tbody tr').length;
                var length1 = $(this).parent().parent().find('td').length;
                var length2 = $(this).parent().parent().next('tr').find('td').length;
                console.log(length1 + " " + length2);
                swal({
                    title: "",
                    text: msg,
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: "是的，我要退票",
                    confirmButtonColor: "#ec6c62"
                }, function () {
                    if (tr_length === 1 || length1 !== length2 && length2 !== 0 && tr_length/2 === 1) {//全部退票
                        $.ajax({
                            type: "post",
                            url: "/quitOrder2",
                            dataType: "json",
                            data: params,
                            traditional: true,
                            success: function (data) {
                                if (data.result === "1") {
                                    swal("", "退票成功!\n\n退款将在1-7个工作日退回原支付账户", "success");
                                    LoadOrder();
                                } else {
                                    swal("", "系统异常，稍后重试！", "error");
                                }
                            }
                        })
                    } else {//部分退票
                        $.ajax({
                            type: "post",
                            url: "/quitOrder1",
                            dataType: "json",
                            data: params,
                            traditional: true,
                            success: function (data) {
                                if (data.result === "1") {
                                    swal("", "退票成功!\n\n退款将在1-7个工作日退回原支付账户", "success");
                                    LoadOrder();
                                } else {
                                    swal("", "系统异常，稍后重试！", "error");
                                }
                            }
                        })
                    }
                })
            }
        )
    })
}


//下滑、上滑事件
function Slow() {
    $('#orderDetail').find('div:nth-child(odd)').each(function (index) {
        var number = parseInt(index) + parseInt(1);
        $(this).click(function () {
            $('#body' + number).slideToggle("slow");
        });
    })
}
