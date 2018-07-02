$(document).ready(function () {
    var utelephoneconfirm = /^1[3,4,5,7,8]\d{9}$/; //设置手机号验证规则
    var unumberconfirm = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  //设置身份证号验证规则
    var uemailconfirm = /^\d{5,12}@[qQ][qQ]\.(com|cn)$/;  //设置邮箱验证规则

    //用户名
    $("#uid").focus(function () {
        $("#uid").css("background-color", "greenyellow");
    });
    $("#uid").blur(function () {
        $("#uid").css("background-color", "white");
        var uid = $("#uid").val(); //用户名
        if (uid === "" || uid.replace(/(^\s*)|(\s*$)/g, "") === "") {
            $("#uiddo").html("用户名不能为空");
            $("#uiddo").css("color", "red");
        } else if (uid.length < 4 || uid.length > 10) {
            $("#uiddo").html("用户名长度不符合规定:4-10(中英文、数字、下划线)");
            $("#uiddo").css("color", "red");
        } else {
            var params = {};
            params.uid = $("#uid").val();
            $.ajax({
                type: "post",
                url: "/userConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "0") {
                        $("#uiddo").html("✔");
                        $("#uiddo").css("color", "green");
                    } else {
                        $("#uiddo").html("用户名已被占用");
                        $("#uiddo").css("color", "red");
                    }
                }
            })
        }
    });

    //密码
    $("#upassword").focus(function () {
        $("#upassword").css("background-color", "greenyellow");
    });
    $("#upassword").blur(function () {
        $("#upassword").css("background-color", "white");
        var pwd1 = $("#upassword").val(); //密码
        if (pwd1 === "" || pwd1.replace(/(^\s*)|(\s*$)/g, "") === "") {
            $("#upassworddo1").html("密码不能为空");
            $("#upassworddo1").css("color", "red");
        } else if (pwd1.length < 8 || pwd1.length > 16) {
            $("#upassworddo1").html("密码长度不符合规定：8-16(中英文、数字、下划线)");
            $("#upassworddo1").css("color", "red");
        } else {
            $("#upassworddo1").html("✔");
            $("#upassworddo1").css("color", "green");
        }
    });

    //密码确认
    $("#upasswordconfirm").focus(function () {
        $("#upasswordconfirm").css("background-color", "greenyellow");
    });
    $("#upasswordconfirm").blur(function () {
        $("#upasswordconfirm").css("background-color", "white");
        var pwd1 = $("#upassword").val(); //密码
        var pwd2 = $("#upasswordconfirm").val(); //确认密码
        if (pwd2 === "") {
            $("#upassworddo2").html("");
        } else if (pwd1 === pwd2) {
            $("#upassworddo2").html("✔");
            $("#upassworddo2").css("color", "green");
        } else {
            $("#upassworddo2").html("两次密码不一致");
            $("#upassworddo2").css("color", "red");
        }
    });

    //真实姓名
    $("#uname").focus(function () {
        $("#uname").css("background-color", "greenyellow");
    });
    $("#uname").blur(function () {
        $("#uname").css("background-color", "white");
        var uname = $("#uname").val(); //真实姓名
        if (uname === "" || uname.replace(/(^\s*)|(\s*$)/g, "") === "") {
            $("#unamedo").html("请填写真实姓名");
            $("#unamedo").css("color", "red");
        } else {
            $("#unamedo").html("✔");
            $("#unamedo").css("color", "green");
        }
    });

    //性别
    $("#usex").change(function () {
        var usex = $(this).children('option:selected').val();
        if (usex === "您是先生还是女士？") {
            $("#usexdo").html("您是先生还是女士？");
            $("#usexdo").css("color", "red");
        } else {
            $("#usexdo").html("✔");
            $("#usexdo").css("color", "green");
        }
    });

    //身份
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

    //二代身份证号码
    $("#unumber").focus(function () {
        $("#unumber").css("background-color", "greenyellow");
    });
    $("#unumber").blur(function () {
        $("#unumber").css("background-color", "white");
        var unumber = $("#unumber").val(); //证件号码
        if (unumber === "") {
            $("#unumberdo").html("请输入证件号码");
            $("#unumberdo").css("color", "red");
        } else if (!unumberconfirm.test(unumber)) {
            $("#unumberdo").html("请输入正确的证件号码");
            $("#unumberdo").css("color", "red");
        } else {
            $("#unumberdo").html("✔");
            $("#unumberdo").css("color", "green");
        }
    });

    //邮箱
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
            params.uemail = $("#uemail").val();
            $.ajax({
                type: "post",
                url: "/userConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "0") {
                        $("#uemaildo").html("✔");
                        $("#uemaildo").css("color", "green");
                    } else {
                        $("#uemaildo").html("该邮箱已注册！");
                        $("#uemaildo").css("color", "red");
                    }
                }
            })
        }
    });

    //手机
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
            params.utelephone = $("#utelephone").val();
            $.ajax({
                type: "post",
                url: "/userConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "0") {
                        $("#utelephonedo").html("✔");
                        $("#utelephonedo").css("color", "green");
                    } else {
                        $("#utelephonedo").html("该手机号已注册！");
                        $("#utelephonedo").css("color", "red");
                    }
                }
            })
        }
    });

    //短信验证码获取
    var validCode = true;
    $("#button1").click(function () {
        var utelephone = $("#utelephone").val();
        if (utelephone === "") {
            $("#utelephonedo").html("请输入手机号码");
            $("#utelephonedo").css("color", "red");
        } else {
            var time = 60;
            var $code = $(this);
            if (validCode) {
                validCode = false;
                var t = setInterval(function () {
                    $("#button1").attr('disabled',true);
                    time--;
                    $code.html(time + "秒后重新获取");
                    if (time === 0) {
                        clearInterval(t);
                        $("#button1").attr('disabled',false);
                        $code.html("获取短信验证码 ☜");
                        validCode = true;
                    }
                }, 1000)
            }
            $.ajax({
                type: "post",
                url: "/smsVer",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    utelephone: utelephone
                }),
                success: function (result) {
                    var num = JSON.stringify(result);
                    if (num === "1") {
                        swal("", "验证码已发送至您的手机，请查收！", "success");
                    } else {
                        swal("", "获取验证码异常，请重新获取！", "error");
                    }
                }
            })
        }
    });

    //短信验证码验证
    $("#ucode").focus(function () {
        $("#ucode").css("background-color", "greenyellow");
    });
    $("#ucode").blur(function () {
        $("#ucode").css("background-color", "white");
        var params = {};
        params.ucode = $("#ucode").val();
        params.cway = $("#utelephone").val();
        $.ajax({
            type: "post",
            url: "/getCode",
            dataType: "json",
            data: params,
            success: function (data) {
               if (data.result === "1") {
                    $("#ucodedo").html("✔");
                    $("#ucodedo").css("color", "green");
                } else {
                    $("#ucodedo").html("验证码错误！请确认或重新获取");
                    $("#ucodedo").css("color", "red");
                }
            }
        })
    });

    //协议
    $("#checkbox1").change(function () {
        if (!$('#checkbox1').is(':checked')) {
            $("#ucheckbox").html("请先同意协议");
            $("#ucheckbox").css("color", "red");
        } else {
            $("#ucheckbox").html("");
        }
    });

    //注册按钮
    $("#button2").click(function () {
        if ($("#uiddo").html() !== "✔" || $("#upassworddo1").html() !== "✔" || $("#upassworddo2").html() !== "✔" ||
            $("#unamedo").html() !== "✔" || $("#usexdo").html() !== "✔" || $("#ustatusdo").html() !== "✔" ||
            $("#unumberdo").html() !== "✔" || $("#uemaildo").html() !== "✔" || $("#utelephonedo").html() !== "✔" ||
            $("#ucodedo").html() !== "✔" || !$('#checkbox1').is(':checked')) {
            swal("", "信息不完整或信息有误！", "error");
        } else {
            var params = {};
            params.uid = $("#uid").val();
            params.upassword = $("#upassword").val();
            params.uname = $("#uname").val();
            params.usex = $("#usex").val();
            params.unumber = $("#unumber").val();
            params.utelephone = $("#utelephone").val();
            params.ustatus = $("#ustatus").val();
            params.uemail = $("#uemail").val();
            params.upower = "0";
            $.ajax({
                type: "post",
                url: "/register",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        swal({
                            title: "",
                            text: "恭喜您，注册成功！",
                            type: "success"
                        }, function () {
                            window.location.href = "../index.html";
                        });
                    } else {
                        swal("", "未知异常，注册失败！", "error");
                    }
                }
            })
        }
    })
});
