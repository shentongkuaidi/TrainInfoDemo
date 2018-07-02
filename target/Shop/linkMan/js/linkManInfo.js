$(document).ready(function () {

    //加载联系人详细信息
    window.onload = function () {
        var url = window.location.href;
        var index = url.indexOf('=');
        if (index === -1) return "";
        lid = url.substring(index + 1);
        var params = {};
        params.lid = lid;
        $.ajax({
            type: "get",
            url: "/linkManInfo",
            dataType: "json",
            data: params,
            success: function (data) {
                $("#lname").val(data.lname);
                $("#lsex").val(data.lsex);
                $("#ltype").val(data.ltype);
                $("#lnumber").val(data.lnumber);
            }
        });

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

    //删除联系人
    $("#delete").click(function () {
        var params = {};
        params.lnumber = $("#lnumber").val();
        swal({
            title: "您真的确定要删除吗？",
            text: "请确认！",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "是的，我要删除",
            confirmButtonColor: "#ec6c62"
        }, function () {
            $.ajax({
                type: "post",
                url: "/linkManDeleteOne",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        window.location.href = "LinkManList.html";
                    } else {
                        swal("", "系统异常，删除联系人失败！", "error");
                    }
                }
            })
        })
    });

    //取消返回联系人列表页面
    $("#back").click(function () {
        window.location.href = "LinkManList.html";
    });

});