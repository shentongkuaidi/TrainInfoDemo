$(document).ready(function () {
    //登录名
    $("#loginName").focus(function () {
        $("#loginName").css("background-color", "greenyellow");
    });
    $("#loginName").blur(function () {
        $("#loginName").css("background-color", "white");
        var loginName = $("#loginName").val();
        if (loginName === "") {
            $("#loginName").css("border-color", "red");
        } else {
            $("#loginName").css("border-color", "#c3c3c3");
        }
    });

    //登陆密码
    $("#loginPassword").focus(function () {
        $("#loginPassword").css("background-color", "greenyellow");
    });
    $("#loginPassword").blur(function () {
        $("#loginPassword").css("background-color", "white");
        var loginPassword = $("#loginPassword").val();
        if (loginPassword === "") {
            $("#loginPassword").css("border-color", "red");
        } else {
            $("#loginPassword").css("border-color", "#c3c3c3");
        }
    });

    //字符验证码
    $("#loginCode").focus(function () {
        $("#loginCode").css("background-color", "greenyellow");
    });
    $("#loginCode").blur(function () {
        $("#loginCode").css("background-color", "white");
        var loginCode = $("#loginCode").val();
        if (loginCode === "") {
            $("#loginCode").css("border-color", "red");
        } else {
            var params = {};
            params.loginCode = $("#loginCode").val();
            $.ajax({
                type: "post",
                url: "/verifyCodeConfirm",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        $("#loginCode").css("border-color", "#c3c3c3");
                        $("#changeVerifyCode").html("✔");
                    } else {
                        $("#loginCode").css("border-color", "red");
                        $('#changeVerifyCode').html("<img src='/getVerifyCode' style='width: 80px;height: 30px' id='verifyCodeImage' class='help-inline3'>看不清");
                    }
                }
            })
        }
    });

    //切换验证码
    $("#changeVerifyCode").click(function () {
        VerifyCodeChange();
    });

    //登陆按钮
    $("#loginButton").click(function () {
        if ($("#loginName").val() === "" || $("#loginPassword").val() === "") {
            swal("", "登陆信息不完整，需补充！", "warning");
        } else if ($("#changeVerifyCode").html() !== "✔") {
            swal("", "验证码不正确，请修改！", "error");
        } else {
            var params = {};
            if ($("#loginName").val().length > 10) {
                params.utelephone = $("#loginName").val();
            } else {
                params.uid = $("#loginName").val();
            }
            params.upassword = $("#loginPassword").val();
            $.ajax({
                type: "post",
                url: "/login",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "0") {
                        swal("", "登陆失败，密码账户不匹配！", "error");
                        $("#loginPassword").val("");
                        $("#loginCode").val("");
                        $('#changeVerifyCode').html("<img src='/getVerifyCode' style='width: 80px;height: 30px' id='verifyCodeImage' class='help-inline3'>看不清");
                    } else {
                        swal({
                            title: "Success!",
                            text: '登陆成功。。。正在跳转至<a href="../index.html"> 火车网首页</a>',
                            imageUrl: "../img/success.png",
                            html: true,
                            timer: 2000,
                            showConfirmButton: false
                        }, function () {
                            window.location.href = "../index.html";
                        });
                    }
                }
            })
        }
    })
});

//验证码切换
function VerifyCodeChange() {
    $('#verifyCodeImage').attr('src', '../getVerifyCode?timestamp=' + new Date().getTime());
}

