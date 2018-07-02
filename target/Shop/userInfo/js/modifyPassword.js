$(document).ready(function () {
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

    //旧密码
    $("#oldPassword").focus(function () {
        $("#oldPassword").css("background-color", "greenyellow");
    });
    $("#oldPassword").blur(function () {
        $("#oldPassword").css("background-color", "white");
        var oldPassword = $("#oldPassword").val(); //旧密码
        if (oldPassword === "") {
            $("#oldPassworddo").html("请填写旧密码");
            $("#oldPassworddo").css("color", "red");
        } else {
            var params = {};
            params.oldPassword = $("#oldPassword").val();
            $.ajax({
                type: "post",
                url: "/getOldPassword",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        $("#oldPassworddo").html("✔");
                        $("#oldPassworddo").css("color", "green");
                    } else {
                        $("#oldPassworddo").html("旧密码有误");
                        $("#oldPassworddo").css("color", "red");
                    }
                }
            })
        }
    });

    //新密码
    $("#newPassword").focus(function () {
        $("#newPassword").css("background-color", "greenyellow");
    });
    $("#newPassword").blur(function () {
        $("#newPassword").css("background-color", "white");
        var newPassword = $("#newPassword").val(); //新密码
        var oldPassword = $("#oldPassword").val(); //旧密码
        if (newPassword === "" || newPassword.replace(/(^\s*)|(\s*$)/g, "") === "") {
            $("#newPassworddo").html("新密码不能为空");
            $("#newPassworddo").css("color", "red");
        } else if (newPassword.length < 8 || newPassword.length > 16) {
            $("#newPassworddo").html("不符合规定：8-16(中英文、数字、下划线)");
            $("#newPassworddo").css("color", "red");
        } else if (newPassword === oldPassword) {
            $("#newPassworddo").html("新密码不能与旧密码相同");
            $("#newPassworddo").css("color", "red");
        } else {
            $("#newPassworddo").html("✔");
            $("#newPassworddo").css("color", "green");
        }
    });

    //新密码确认
    $("#newPasswordConfirm").focus(function () {
        $("#newPasswordConfirm").css("background-color", "greenyellow");
    });
    $("#newPasswordConfirm").blur(function () {
        $("#newPasswordConfirm").css("background-color", "white");
        var pwd1 = $("#newPassword").val(); //新密码
        var pwd2 = $("#newPasswordConfirm").val(); //确认新密码
        if (pwd2 === "") {
            $("#newPasswordConfirmdo").html("");
        } else if (pwd1 === pwd2) {
            $("#newPasswordConfirmdo").html("✔");
            $("#newPasswordConfirmdo").css("color", "green");
        } else {
            $("#newPasswordConfirmdo").html("两次密码不一致");
            $("#newPasswordConfirmdo").css("color", "red");
        }
    });

    //密码修改按钮
    $("#confirmButton").click(function () {
        if ($("#oldPassworddo").html() !== "✔" || $("#newPassworddo").html() !== "✔" ||
            $("#newPasswordConfirmdo").html() !== "✔") {
            swal("","信息不全或有误！","error");
        } else {
            var params = {};
            params.uid = $("#userName").html().split('>')[1].split('<')[0];
            params.upassword = $("#newPassword").val();
            $.ajax({
                type: "post",
                url: "/resetPassword",
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.result === "1") {
                        swal({
                            title: "",
                            text: "密码修改成功！",
                            type: "success"
                        }, function () {
                            window.location.href = "PersonalInfo.html";
                        });
                    } else {
                        swal("", "密码修改失败！", "error");
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