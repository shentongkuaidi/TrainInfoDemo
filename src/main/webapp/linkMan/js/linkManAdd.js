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

    var lnumberconfirm = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  //设置身份证号验证规则

    //联系人姓名
    $("#lname").focus(function () {
        $("#lname").css("background-color", "greenyellow");
    });
    $("#lname").blur(function () {
        $("#lname").css("background-color", "white");
        var lname = $("#lname").val(); //真实姓名
        if (lname === "" || lname.replace(/(^\s*)|(\s*$)/g, "") === "") {
            $("#lnamedo").html("请填写真实姓名");
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
            $("#lsexdo").html("您是先生还是女士？");
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
            $("#ltypedo").html("请选择您的身份");
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
            $("#lnumberdo").html("请输入证件号码");
            $("#lnumberdo").css("color", "red");
        } else if (!lnumberconfirm.test(lnumber)) {
            $("#lnumberdo").html("请输入正确的证件号码");
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
                        $("#lnumberdo").html("该号码已存在");
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
            swal("","信息不全或有误","error");
        } else {
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
                        swal({
                            title: "",
                            text: "联系人添加成功！",
                            type: "success"
                        }, function () {
                            window.location.href = "LinkManList.html";
                        });
                    } else {
                        swal("","系统异常！","error");
                    }
                }
            })
        }
    });

    //取消返回联系人列表页面
    $("#cancel").click(function () {
        window.location.href = "LinkManList.html";
    })
});