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

$(document).ready(function () {
    //加载信息
    window.onload = function () {
        $.ajax({
            type: "post",
            url: "/loginConfirm",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result === "1") {
                    $("#login").hide();
                    $("#register").hide();
                    $("#exit").show();
                    $("#user").show();
                    $("#uid").html("您好:" + data.user.uid);
                } else {
                    $("#login").show();
                    $("#register").show();
                    $("#exit").hide();
                    $("#user").hide();
                }
            }
        });

        if ($("#fromStationText").val() !== '') {
            searchTrain();
        }

    };

    $('#train_start_date').val(getDate());
    $('#train_start_date').click(function () {
        WdatePicker({
            doubleCalendar: true,
            dateFmt: 'yyyy-MM-dd',
            minDate: getDate(),
            maxDate: endDate()
        });
    });

    $(window).resize(function () { //窗口改变大小事件
        var listTableWidth = $('#listTable').width();
        $('#floatTable').width(listTableWidth);
    });

    $(window).scroll(function () { //鼠标滚轮事件
        var scrollPos;
        if (window.pageYOffset) {
            scrollPos = window.pageYOffset;
        } else if (document.compatMode && document.compatMode !== 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollPos = document.body.scrollTop;
        }
        if (scrollPos > 355) {
            $('#floatTable').css('display', 'block');
        } else {
            $('#floatTable').css('display', 'none');
        }
    });

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

    $("#GC").change(function () {
        searchTrain();
    });
    $("#D").change(function () {
        searchTrain();
    });
    $("#Z").change(function () {
        searchTrain();
    });
    $("#T").change(function () {
        searchTrain();
    });
    $("#K").change(function () {
        searchTrain();
    });
    $("#other").change(function () {
        if ($("#other").is(":checked")) {
            $("#GC").removeAttr("checked");
            $("#D").removeAttr("checked");
            $("#Z").removeAttr("checked");
            $("#T").removeAttr("checked");
            $("#K").removeAttr("checked");
        }
        searchTrain();
    });

    $("#checi").focus(function () {
        $("#checi").css("background-color", "greenyellow");
        $("#GC").removeAttr("checked");
        $("#D").removeAttr("checked");
        $("#Z").removeAttr("checked");
        $("#T").removeAttr("checked");
        $("#K").removeAttr("checked");
        $("#other").removeAttr("checked");
        $("#all").removeAttr("checked");
    });
    $("#checi").blur(function () {
        $("#checi").css("background-color", "white");
    });
    $("#checi").keyup(function () {
        searchTrain();
    });

    $("#all").change(function () {
        if ($("#all").is(":checked")) {
            $("#GC").removeAttr("checked");
            $("#D").removeAttr("checked");
            $("#Z").removeAttr("checked");
            $("#T").removeAttr("checked");
            $("#K").removeAttr("checked");
            $("#other").removeAttr("checked");
            searchTrain();
        }
    });

});

//搜索列车信息
function searchTrain() {
    var fromStationText = $('#fromStationText').val(); //出发地
    var toStationText = $('#toStationText').val(); //目的地
    var train_start_date = $('#train_start_date').val(); //出发日
    var tid1, tid2, tid3, tid4, tid5;
    if ($("#GC").is(":checked")) tid1 = $("#GC").val(); else tid1 = "";
    if ($("#D").is(":checked")) tid2 = $("#D").val(); else tid2 = "";
    if ($("#Z").is(":checked")) tid3 = $("#Z").val(); else tid3 = "";
    if ($("#T").is(":checked")) tid4 = $("#T").val(); else tid4 = "";
    if ($("#K").is(":checked")) tid5 = $("#K").val(); else tid5 = "";
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
    var params = {};
    params.origin = fromStationText;
    params.destination = toStationText;
    params.sday = train_start_date.toString();
    params.tid = $("#checi").val();
    params.tid1 = tid1;
    params.tid2 = tid2;
    params.tid3 = tid3;
    params.tid4 = tid4;
    params.tid5 = tid5;
    $("#listTable").children('tbody').empty();
    $.ajax({
        type: 'post',
        url: '/trainInfo',
        dataType: 'json',
        data: params,
        onbeforeunload: $('.dhx_modal_cover').css('display', 'block'),
        success: function (data) {
            $('.dhx_modal_cover').css('display', 'none');
            var count = data.trainInfoList.length;
            document.getElementById('left').innerHTML =
                $('#fromStationText').val() + "➜➜➜" + $('#toStationText').val()
                + " (" + $('#train_start_date').val() + ") 共计" + "&nbsp;" + count + "&nbsp;" + "个车次";
            var tbody = "";
            var arr = ['商务座', '一等座', '二等座', '软卧', '硬卧', '软座', '硬座', '无座'];
            var dataList = [];
            if (count === 0) {
                var tr = "<tr style='height: 100px'>";
                tr += "<td colspan='13' style='text-align: center;font-size: 15px;color: #7F9DB9'>"
                    + "——很抱歉，按您的查询条件，当前未找到 " + fromStationText + "➜➜➜" + toStationText + " 的列车——" + "</td>";
                tr += "</tr>";
                tbody += tr;
            } else {
                $.each(data.trainInfoList, function (index, el) {
                    var dataInfo = {};
                    dataInfo.sday = el.sday;
                    dataInfo.tid = el.tid;
                    dataInfo.origin = el.origin;
                    dataInfo.destination = el.destination;
                    dataInfo.startTime = el.startTime;
                    dataInfo.endTime = el.endTime;
                    dataList.push(dataInfo);
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
                    tr += "<td>" + "<a shape='rect' class='btn12222s' href='#'><font color='#ffffff'><b>预定</b></font></a>" + "</td>";
                    tr += "</tr>";
                    tbody += tr;
                });
            }
            tbody += "<tr style='background-color: palegoldenrod'><td colspan='13' style='text-align: center;font-size: 15px'>如未找到合适的车次，您还可以选择接续换乘：" +
                "<a href='TurnTicket1.html?origin=" + $('#fromStationText').val() + "&destination=" + $('#toStationText').val() + "&sday=" + $('#train_start_date').val() + "' " +
                "id='turn' style='text-decoration: none; outline: none;'>" + $('#fromStationText').val() + "➜➜➜" + $('#toStationText').val() + "</a></td></tr>";
            $("#listTable").children('tbody').append(tbody);

            $("#listTable").find("tbody tr a").each(function (i) {
                var sday, tid, origin, destination, startTime, endTime;
                sday = dataList[i].sday;
                tid = dataList[i].tid;
                origin = dataList[i].origin;
                destination = dataList[i].destination;
                startTime = dataList[i].startTime;
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
                                    async: false,
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
                                                async: false,
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
                                                        window.location.href = "OrderTicket.html?sday=" + sday + "&tid=" + tid + "&origin=" + origin + "" +
                                                            "&destination=" + destination + "&startTime=" + startTime + "&endTime=" + endTime;
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

