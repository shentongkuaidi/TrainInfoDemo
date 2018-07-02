function getDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
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
            type:"post",
            url:"/loginConfirm",
            dataType:"json",
            data:{},
            success:function (data) {
                if(data.result=="1"){
                    $("#login").hide();
                    $("#register").hide();
                    $("#exit").show();
                    $("#user").show();
                    $("#uid").html("您好:"+data.user.uid);
                }else{
                    $("#login").show();
                    $("#register").show();
                    $("#exit").hide();
                    $("#user").hide();
                }
            }
        });
        var Request = GetRequest();
        $('#fromStationText').val(Request.origin); //出发地
        $('#toStationText').val(Request.destination); //目的地
        $('#train_start_date').val(Request.sday); //出发日
    };

    $("#fromStationText").focus(function () {
        $("#fromStationText").css("background-color", "greenyellow");
    });
    $("#fromStationText").blur(function () {
        $("#fromStationText").css("background-color", "white");
    });
    $("#toStationText").focus(function () {
        $("#toStationText").css("background-color", "greenyellow");
    });
    $("#toStationText").blur(function () {
        $("#toStationText").css("background-color", "white");
    });
    $("#midStationText").focus(function () {
        $("#midStationText").css("background-color", "greenyellow");
    });
    $("#midStationText").blur(function () {
        $("#midStationText").css("background-color", "white");
    });

    $('#train_start_date').val(getDate());
    $('#train_start_date').click(function () {
        WdatePicker({
            doubleCalendar: true,
            dateFmt: 'yyyy-MM-dd',
            minDate: getDate(),
            maxDate: endDate()
        })
    })

});

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

function searchTrain() {
    var fromStationText = $('#fromStationText').val(); //出发地
    var toStationText = $('#toStationText').val(); //目的地
    var train_start_date = $('#train_start_date').val(); //出发日
    var midStationText = $('#midStationText').val();//中转站点
    if (fromStationText === '') {
        swal("", "出发地不能为空！", "warning");
        $('#fromStationText').focus();
        return;
    }
    if (toStationText === '') {
        swal("", "目的地不能为空！", "warning");
        $('#toStationText').focus();
        return;
    }
    if (train_start_date === '') {
        swal("", "出发日不能为空！", "warning");
        $('#train_start_date').focus();
        return;
    }
    if (station_names.indexOf(fromStationText) < 0) {
        swal("", "请输入正确的出发地！", "error");
        $('#fromStationText').focus();
        $('#fromStationText').select();
        return;
    }
    if (station_names.indexOf(toStationText) < 0) {
        swal("", "请输入正确的目的地！", "error");
        $('#toStationText').focus();
        $('#toStationText').select();
        return;
    }
    if (station_names.indexOf(midStationText) < 0) {
        swal("", "请输入正确的中转站点！", "error");
        $('#midStation').focus();
        $('#midStation').select();
        return;
    }

    $("#listTable").children('tbody').empty();
    $.ajax({
        type: "post",
        url: "/queryTurnInfo",
        dataType: "json",
        data: {
            "origin": $('#fromStationText').val(),
            "destination": $('#toStationText').val(),
            "sday": $('#train_start_date').val(),
            "midStationName": $('#midStationText').val().trim() === "" ? null : $('#midStationText').val()
        },
        success: function (data) {
            var arr = ['商务座', '一等座', '二等座', '软卧', '硬卧', '软座', '硬座', '无座'];
            var dataList = [];
            var count = data.turnInfoList.length / 2;
            document.getElementById('left').innerHTML =
                $('#fromStationText').val() + "➜➜➜" + $('#toStationText').val()
                + " (" + $('#train_start_date').val() + ") 共计" + "&nbsp;" + count + "&nbsp;" + "个接续方案";
            var tbody = "";
            if (count === 0) {
                var tr = "<tr style='height: 100px'>";
                tr += "<td colspan='13' style='text-align: center;font-size: 15px;color: #7F9DB9'>"
                    + "——很抱歉，按您的查询条件，当前未找到 " + $('#fromStationText').val() + "➜➜➜" + $('#toStationText').val() + " 的接续换乘方案——" + "</td>";
                tr += "</tr>";
                tbody += tr;
            } else {
                $.each(data.turnInfoList, function (index, el) {
                    var order = index / 2 + 1;
                    var turnTimeList = data.result;
                    if (index % 2 === 0) {
                        var elNext = data.turnInfoList[index + 1];//转乘的车次信息
                        var dataInfo = {};
                        dataInfo.sday = el.sday;
                        dataInfo.tid1 = el.tid;
                        dataInfo.tid2 = elNext.tid;
                        dataInfo.origin = el.origin;
                        dataInfo.midStation = el.destination;
                        dataInfo.destination = elNext.destination;
                        dataInfo.startTime = el.startTime;
                        dataInfo.midEndTime = el.endTime;
                        dataInfo.midStartTime = elNext.startTime;
                        dataInfo.endTime = elNext.endTime;
                        dataList.push(dataInfo);
                        var th = "<tr style='margin-top: 20px'>";
                        th += "<td colspan='13' style='font-size: 17px;line-height: 50px'>" +
                            order + "<span>" + el.origin + "</span>" +
                            "<font size='2px'>" + el.startTime + "开</font>" +
                            "<span>➜" + el.tid + "," + el.costTime + "➜</span>" +
                            "<span><font size='2px'>" + el.endTime + "到</font></span>" +
                            "<span>" + el.destination + "<font size='2px'>(接续换乘:" + turnTimeList[order - 1] + ")</font></span>" +
                            "<span><font size='2px'>" + elNext.startTime + "开</font></span>" +
                            "<span>➜" + elNext.tid + "," + elNext.costTime + "➜</span>" +
                            "<span><font size='2x'>" + elNext.endTime + "到</font></span>" +
                            elNext.destination + "</td>";
                        th += "</tr>";
                    }
                    tbody += th;
                    var tr = "<tr>";
                    tr += "<td>" + el.tid + "</td>";
                    tr += "<td>" + el.origin + "<br>" + el.destination + "</td>";
                    tr += "<td>" + el.startTime + "<br>" + el.endTime + "</td>";
                    tr += "<td>" + el.costTime + "</td>";
                    var j = 0;
                    $.each(el.list, function (index, item) {
                        for (var i = j; i < arr.length; i++) {
                            if (item.ctype === arr[i]) {
                                tr += "<td>" + item.ccount + "</td>";
                                j = ++i;
                                break;
                            } else {
                                tr += "<td>" + "--" + "</td>";
                            }
                        }
                    });
                    if (index % 2 === 0) {
                        tr += "<td rowspan='2'>" + "<a shape='rect' class='btn12222s' href='#'><font color='#ffffff'><b>预定</b></font></a>" + "</td>";
                    }
                    tr += "</tr>";
                    tbody += tr;
                })
            }
            $("#listTable").children('tbody').append(tbody);

            $("#listTable").find("tbody tr a").each(function (i) {
                var sday, tid1, tid2, origin, midStation, destination, startTime, midEndTime, midStartTime, endTime;
                sday = dataList[i].sday;
                tid1 = dataList[i].tid1;
                tid2 = dataList[i].tid2;
                origin = dataList[i].origin;
                midStation = dataList[i].midStation;
                destination = dataList[i].destination;
                startTime = dataList[i].startTime;
                midEndTime = dataList[i].midEndTime;
                midStartTime = dataList[i].midStartTime;
                endTime = dataList[i].endTime;
                $(this).click(function () {
                    $.ajax({
                        type: "post",
                        url: "/loginConfirm",
                        dataType: "json",
                        data: {},
                        success: function (data) {
                            if (data.result === "0") {
                                window.location.href = "../user/Login.html";
                            } else {
                                //检测取消订单次数是否超出限额：3
                                $.ajax({
                                    type: "post",
                                    url: "/cancelOrderCount",
                                    dataType: "json",
                                    data: {},
                                    success: function (data) {
                                        if (data.result === "0") {
                                            swal("", "您今天已取消三次订单，该日无法继续购票！", "warning");
                                        } else {
                                            //检测是否存在未支付订单
                                            var params = {};
                                            params.otstatus = "0";
                                            $.ajax({
                                                type: "post",
                                                url: "/continueOrder",
                                                dataType: "json",
                                                data: params,
                                                success: function (data) {
                                                    if (data.result === "1") {
                                                        swal({
                                                            title: "",
                                                            text: "当前存在未支付订单，请先完成！",
                                                            type: "warning"
                                                        }, function () {
                                                            window.location.href = "../userInfo/OrderContinue.html";
                                                        });
                                                    } else {
                                                        window.location.href = "TurnTicket2.html?sday=" + sday + "&tid1=" + tid1 + "&tid2=" + tid2 + "&origin=" + origin + "&midStation=" + midStation +
                                                            "&destination=" + destination + "&startTime=" + startTime + "&midEndTime=" + midEndTime + "&midStartTime=" + midStartTime + "&endTime=" + endTime;
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                })
            })
        }
    })
}