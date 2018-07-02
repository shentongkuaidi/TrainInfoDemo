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

//获取需要改签的车次信息
function TrainInformation() {
    var Request = GetRequest();
    var obj = {
        origin: Request['origin'],//起点站
        destination: Request['destination'],//终点站
        sday: Request['sday'],//出发日
        tid: Request['tid']//车次
    };
    return obj;
}

//获取需要改签的车次类型
function GetTid() {
    //可以改签车次类型判断
    var info = TrainInformation();
    var tid = info.tid.slice(0,1);
    $(":checkbox").attr("disabled",true);
    $("#checi").attr("disabled",true);
    if(tid === "G"){
        $("#GC").attr("checked",true);
    }else if(tid === "D"){
        $("#D").attr("checked",true);
    }else{
        $("#Z").attr("checked",true);
        $("#T").attr("checked",true);
        $("#k").attr("checked",true);
        $("#other").attr("checked",true);
    }
    //加载车次信息
    $("#fromStationText").val(info.origin);
    $("#toStationText").val(info.destination);
    var now = new Date();
    var sday = new Date(info.sday);
    if (sday.getDate() === now.getDate()) {
        $('#train_start_date').attr("disabled",true);
    }
}

$(document).ready(function () {
    //加载信息
    window.onload = function () {
        GetTid();
        SearchTrain();
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

});

//搜索列车信息
function SearchTrain() {
    var fromStationText = $('#fromStationText').val(); //出发地
    var toStationText = $('#toStationText').val(); //目的地
    var train_start_date = $('#train_start_date').val(); //出发日
    var tid1, tid2, tid3, tid4, tid5;
    if ($("#GC").is(":checked")) {
        tid1 = $("#GC").val();
    } else {
        tid1 = "";
    }
    if ($("#D").is(":checked")) {
        tid2 = $("#D").val();
    } else {
        tid2 = "";
    }
    if ($("#Z").is(":checked")) {
        tid3 = $("#Z").val();
    } else {
        tid3 = "";
    }
    if ($("#T").is(":checked")) {
        tid4 = $("#T").val();
    } else {
        tid4 = "";
    }
    if ($("#K").is(":checked")) {
        tid5 = $("#K").val();
    } else {
        tid5 = "";
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
            var count = 0;
            var info = TrainInformation();
            if(data.trainInfoList.length !== 0 && info.sday === $('#train_start_date').val()){
               count = parseInt(data.trainInfoList.length)-parseInt(1);
            }else {
                count = parseInt(data.trainInfoList.length);
            }
            document.getElementById('left').innerHTML =
                $('#fromStationText').val() + "➜➜➜" + $('#toStationText').val()
                + " (" + $('#train_start_date').val() + ") 共计" + "&nbsp;" + count + "&nbsp;" + "个车次" + "<span style='color: red'>（改签）</span>";
            var tbody = "";
            var arr = ['商务座', '一等座', '二等座', '软卧', '硬卧', '软座', '硬座', '无座'];
            var dataList = [];
            if (count === 0) {
                var tr = "<tr style='height: 100px'>";
                tr += "<td colspan='15' style='text-align: center;font-size: 15px;color: #7F9DB9'>"
                    // + "<img src='images/sorry.jpg' style='width: 150px;height: 100px'>" +"<br>"
                    + "——很抱歉，按您的查询条件，当前未找到 " + fromStationText + "➜➜➜" + toStationText + " 可以改签的列车——" + "</td>";
                tr += "</tr>";
                tbody += tr;
            } else {
                $.each(data.trainInfoList, function (index, el) {
                    if(info.tid !== el.tid || info.sday !== el.sday){//不能改签同班车次
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
                    }
                });
            }
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
                    window.location.href = "ModifyTicket2.html?sday=" + sday + "&tid=" + tid + "&origin=" + origin + "" +
                        "&destination=" + destination + "&startTime=" + startTime + "&endTime=" + endTime;
                })
            })
        }
    })

}
