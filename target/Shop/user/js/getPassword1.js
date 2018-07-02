$(document).ready(function () {
    //密码找回方式选择
    $("#way").change(function () {
        $("#button1").html("获取验证码 ☜");
        var selval = $(this).find('option:selected').val();
        if (selval === "1") {
            $("#select1").hide();
            $("#select2").show();
            $("#waydo").html("您正在使用邮箱验证");
            $("#waydo").css("color", "green");
        } else {
            $("#select1").show();
            $("#select2").hide();
            $("#waydo").html("您正在使用手机验证");
            $("#waydo").css("color", "green");
        }
    });

    //用户名验证
    $("#uid").focus(function () {
        $("#uid").css("background-color", "greenyellow");
    });
    $("#uid").blur(function () {
        $("#uid").css("background-color", "white");
        var uid = $("#uid").val();
        if (uid === "") {
            $("#uiddo").html("请输入您注册时填写的用户名");
            $("#uiddo").css("color", "red");
            $("#uemail").val("");
            $("#utelephone").val("");
        } else {
            var params = {};
            params.uid = $("#uid").val();
            $.ajax({
                type: "post",
                url: "/userConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        $("#uiddo").html("✔");
                        $("#uiddo").css("color", "green");
                        $("#utelephonedo").html("");
                        $("#ucodedo").html("");

                        $("#utelephonehide").val(data.utelephone);
                        $("#utelephone").val(data.utelephone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
                        $("#uemailhide").val(data.uemail);
                        var u = data.uemail.split("@");
                        var u1 = u[0].substr(3);
                        var xing = "";
                        for (var i = 0; i < u1.length; i++) {
                            xing += "*";
                        }
                        var uemail = u[0].substr(0, 4) + xing + u[1];
                        $("#uemail").val(uemail);
                    } else {
                        $("#uiddo").html("该用户名不存在，请检查并修改");
                        $("#uiddo").css("color", "red");
                        $("#utelephone").val("");
                        $("#uemail").val("");
                    }
                }
            })
        }
    });

    //获取验证码
    var validCode = true;
    $("#button1").click(function () {
        if ($("#uiddo").html() !== "✔") {
            $("#utelephonedo").html("信息缺失");
            $("#uemaildo").html("信息缺失");
        } else
            if ($("#waydo").html() === "您正在使用手机验证") {
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
                        $code.html("获取验证码 ☜");
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
                    utelephone: $("#utelephonehide").val()
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
        } else {
            var params = {};
            params.uemail = $("#uemailhide").val();
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
                        $code.html("获取验证码 ☜");
                        validCode = true;
                    }
                }, 1000)
            }
            $.ajax({
                type: "post",
                url: "/emailVer",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        swal("", "验证码已发送至您的邮箱，请查收！", "success");
                    } else {
                        swal("", "获取验证码异常，请重新获取！", "error");
                    }
                }
            })
        }
    });

    //验证码验证
    $("#ucode").focus(function () {
        $("#ucode").css("background-color", "greenyellow");
    });
    $("#ucode").blur(function () {
        $("#ucode").css("background-color", "white");
        var params = {};
        params.ucode = $("#ucode").val();
        if ($("#uiddo").html() !== "✔") {
            $("#ucodedo").html("账户信息存在错误，请检查");
        } else {
            if ($("#waydo").html() === "您正在使用手机验证") params.cway = $("#utelephonehide").val();
            else params.cway = $("#uemailhide").val();
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
        }
    });

    //验证按钮
    $("#button2").click(function () {
        if ($("#uiddo").html() === "✔" && $("#ucodedo").html() === "✔") {
            $.cookie("uid", $("#uid").val());
            swal({
                title: "",
                text: "身份信息验证通过，继续。。。。。。",
                type: "success"
            }, function () {
                window.location.href = "GetPassword2.html";
            });
        } else {
            swal("", "验证未通过，重新验证。。。。。。", "error");
        }
    })

});