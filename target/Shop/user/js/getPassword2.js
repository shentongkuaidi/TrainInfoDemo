$(document).ready(function () {
    //新密码输入
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

    //新密码确认
    $("#upasswordconfirm").focus(function () {
        $("#upasswordconfirm").css("background-color", "greenyellow");
    });
    $("#upasswordconfirm").blur(function () {
        $("#upasswordconfirm").css("background-color", "white");
        var pwd1 = $("#upassword").val(); //密码
        var pwd2 = $("#upasswordconfirm").val(); //确认密码
        if (pwd1 === pwd2 && pwd2 === "") {
            $("#upassworddo2").html("");
        } else if (pwd1 === pwd2 && pwd2 !== "") {
            $("#upassworddo2").html("✔");
            $("#upassworddo2").css("color", "green");
            $("#button1do").html("");
        } else {
            $("#upassworddo2").html("两次密码不一致");
            $("#upassworddo2").css("color", "red");
        }
    });

    //重置密码按钮
    $("#button1").click(function () {
        if ($("#upassworddo1").html() !== "✔" || $("#upassworddo2").html() !== "✔") {
            swal("", "信息不全或信息有误！", "error");
        } else {
            swal({
                title: "您确定要重置密码？",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "是的，我要重置密码",
                confirmButtonColor: "#ec6c62"
            }, function () {
                $("#button1do").html("");
                var params = {};
                params.uid = $.cookie("uid");
                params.upassword = $("#upassword").val();
                $.ajax({
                    type: "post",
                    url: "/resetPassword",
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        if (data.result === "1") {
                            window.location.href = "GetPassword3.html";
                        } else {
                            swal("", "重置密码异常！", "error");
                        }
                    }
                })
            })
        }
    })
});
