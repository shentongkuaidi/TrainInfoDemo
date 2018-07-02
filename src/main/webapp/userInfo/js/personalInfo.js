$(document).ready(function () {
    var utelephoneconfirm = /^1[3,4,5,7,8]\d{9}$/; //设置手机号验证规则
    var uemailconfirm = /^\d{5,12}@[qQ][qQ]\.(com|cn)$/;  //设置邮箱验证规则
    //加载个人信息
    window.onload = function () {
        $("#ustatusdo").html("✔");
        $("#ustatusdo").css("color", "green");
        $("#uemaildo").html("✔");
        $("#uemaildo").css("color", "green");
        $("#utelephonedo").html("✔");
        $("#utelephonedo").css("color", "green");
        $.ajax({
            type: "post",
            url: "/loginConfirm",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result === "1") {
                    $("#userName").html("<b>" + data.user.uid + "</b>");
                    //展示个人信息
                    $("#uid").val(data.user.uid); //昵称/用户名
                    $("#uname").val(data.user.uname); //真实姓名
                    $("#usex").val(data.user.usex); //性别
                    $("#ustatus").val(data.user.ustatus); //身份类型
                    $("#unumber").val(data.user.unumber); //身份证号
                    $("#uemail").val(data.user.uemail); //邮箱
                    $("#utelephone").val(data.user.utelephone); //手机号码
                } else {
                    $("#exit").hide();
                }
            }
        })
    };

    //修改按钮
    $("#modify").click(function () {
        //按钮可见与否
        $("#save").css({"display": "inline"});
        $("#cancel").css({"display": "inline"});
        $("#modify").css({"display": "none"});
        //信息可更改与否
        $("#ustatus").removeAttr("disabled");
        $("#uemail").removeAttr("disabled");
        $("#utelephone").removeAttr("disabled");
    });

    //修改身份
    $("#ustatus").change(function () {
        var ustatus = $(this).children('option:selected').val();
        if (ustatus === "请选择您的身份") {
            $("#ustatusdo").html("请选择您的身份");
            $("#ustatusdo").css("color", "red");
        } else {
            $("#ustatusdo").html("✔");
            $("#ustatusdo").css("color", "green");
        }
    });

    //修改邮箱
    $("#uemail").focus(function () {
        $("#uemail").css("background-color", "greenyellow");
    });
    $("#uemail").blur(function () {
        $("#uemail").css("background-color", "white");
        var uemail = $("#uemail").val(); //邮箱地址
        if (uemail === "") {
            $("#uemaildo").html("请输入您常用的邮箱");
            $("#uemaildo").css("color", "red");
        } else if (!uemailconfirm.test(uemail)) {
            $("#uemaildo").html("请输入正确的邮箱地址");
            $("#uemaildo").css("color", "red");
        } else {
            var params = {};
            params.uid = $("#uid").val();
            params.uemail = $("#uemail").val();
            $.ajax({
                type: "post",
                url: "/updateInfoConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        $("#uemaildo").html("✔");
                        $("#uemaildo").css("color", "green");
                    } else {
                        $("#uemaildo").html("该邮箱已注册");
                        $("#uemaildo").css("color", "red");
                    }
                }
            })
        }
    });

    //修改手机号
    $("#utelephone").focus(function () {
        $("#utelephone").css("background-color", "greenyellow");
    });
    $("#utelephone").blur(function () {
        $("#utelephone").css("background-color", "white");
        var utelephone = $("#utelephone").val(); //手机号码
        if (utelephone === "") {
            $("#utelephonedo").html("请输入您常用的手机号码");
            $("#utelephonedo").css("color", "red");
        } else if (!utelephoneconfirm.test(utelephone)) {
            $("#utelephonedo").html("请输入正确的手机号");
            $("#utelephonedo").css("color", "red");
        } else {
            var params = {};
            params.uid = $("#uid").val();
            params.utelephone = $("#utelephone").val();
            $.ajax({
                type: "post",
                url: "/updateInfoConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        $("#utelephonedo").html("✔");
                        $("#utelephonedo").css("color", "green");
                    } else {
                        $("#utelephonedo").html("该手机号已注册");
                        $("#utelephonedo").css("color", "red");
                    }
                }
            })
        }
    });

    //确认修改
    $("#save").click(function () {
        if ($("#ustatusdo").html() === "请选择您的身份" || $("#uemaildo").html() !== "✔" || $("#utelephonedo").html() !== "✔") {
            swal("", "信息填写不全或有误！", "error");
        } else {
            var params = {};
            params.uid = $("#uid").val();
            params.ustatus = $("#ustatus").val();
            params.uemail = $("#uemail").val();
            params.utelephone = $("#utelephone").val();
            $.ajax({
                type: "post",
                url: "/updateInfo",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        swal({
                            title: "",
                            text: "个人信息修改成功！",
                            type: "success"
                        }, function () {
                            window.location.href = "PersonalInfo.html";
                        });
                    } else {
                        swal("", "未知异常，修改失败！", "error");
                    }
                }
            })
        }
    });

    //取消
    $("#cancel").click(function () {
        window.location.href = "PersonalInfo.html";
    });

});