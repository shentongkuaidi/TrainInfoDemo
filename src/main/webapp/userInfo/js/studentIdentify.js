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
        });

        $.ajax({
            type: "get",
            url: "/getIdentify",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result === "1") {
                    $("#status").html("（已认证）");
                    var info = data.studentIdentify;
                    var arr1 = info.front.split('/');
                    var arr2 = info.opposite.split('/');
                    var fileName1 = arr1[arr1.length - 1];
                    var fileName2 = arr2[arr2.length - 1];
                    $('#collegeName').val(info.collegename);
                    $('#studentID').val(info.studentid);
                    $("#front").attr('src', '../img/upload/'+fileName1);
                    $("#opposite").attr('src', '../img/upload/'+fileName2);
                    $("#submit").attr('disabled',true);
                } else if(data.result ==="-1"){
                    $('#collegeName').attr('disabled',true);
                    $('#studentID').attr('disabled',true);
                    $("#status").html("（抱歉，您的身份是成人）");
                    $("#submit").attr('disabled',true);
                }
            }
        })
    };

    var collegeName = $('#collegeName');//学校名称
    var collegeNameInfo = $('#collegeNameInfo');
    collegeName.focus(function () {
        $("#collegeName").css("background-color", "greenyellow");
    });
    collegeName.blur(function () {
        collegeName.css("background-color", "white");
        var collegeNameVal = $('#collegeName').val();
        if (collegeNameVal === "" || collegeNameVal.replace(/(^\s*)|(\s*$)/g, "") === "") {
            collegeNameInfo.html("学校名称不能为空");
            collegeNameInfo.css("color", "red");
        } else {
            collegeNameInfo.html("");
        }
    });

    var studentID = $('#studentID');//学生证号
    var studentIDInfo = $("#studentIDInfo");
    studentID.focus(function () {
        $("#studentID").css("background-color", "greenyellow");
    });
    studentID.blur(function () {
        studentID.css("background-color", "white");
        var studentIDVal = $('#studentID').val();
        if (studentIDVal === "" || studentIDVal.replace(/(^\s*)|(\s*$)/g, "") === "") {
            studentIDInfo.html("学生证号不能为空");
            studentIDInfo.css("color", "red");
        } else {
            studentIDInfo.html("");
        }
    });

    $("#upload1").on("change", "input[type='file']", function () {
        var filePath = $(this).val();
        console.log(filePath);
        if (filePath.indexOf("jpg") !== -1 || filePath.indexOf("png") !== -1) {
            var arr = filePath.split('\\');
            var fileName = arr[arr.length - 1];
            $("#selectFile1").html(fileName);
            $("#front").attr('src', filePath);
        } else {
            $("#selectFile1").html("未选中图片");
            return false;
        }
    });

    $("#upload2").on("change", "input[type='file']", function () {
        var filePath = $(this).val();
        console.log(filePath);
        if (filePath.indexOf("jpg") !== -1 || filePath.indexOf("png") !== -1) {
            var arr = filePath.split('\\');
            var fileName = arr[arr.length - 1];
            $("#selectFile2").html(fileName);
            $("#opposite").attr('src', filePath);
        } else {
            $("#selectFile2").html("未选中图片");
            return false;
        }
    });

    $("form").submit(function (e) {
        var collegeName = $('#collegeName').val();//学校名称
        var studentID = $('#studentID').val();//学生证号
        var selectFile1 = $("#selectFile1").html();//是否选中图片--正面
        var selectFile2 = $("#selectFile2").html();//是否选中图片--反面
        if (collegeName === "" || studentID === "" || $('#studentIDInfo').html() !== "" || $('#collegeNameInfo').html() !== "") {
            swal("", "信息不完整或有误！", "warning");
            return false;
        }
        if (selectFile1 === "未选中图片" || selectFile1 === "选择图片" ||
            selectFile2 === "未选中图片" || selectFile2 === "选择图片" || selectFile1 === selectFile2) {
            swal("", "请先选择证件的正反面图片！", "warning");
            return false;
        }
    });
});