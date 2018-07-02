$(document).ready(function () {
    window.onload=function () {
        $.ajax({
            type:"post",
            url:"/loginConfirm",
            dataType:"json",
            data:{},
            success:function (data) {
                if(data.result === "1"){
                    $("#login").hide();
                    $("#register").hide();
                    $("#exit").show();
                    $("#user").show();
                    $("#uid").html("欢迎您:"+data.user.uid);
                }else{
                    $("#login").show();
                    $("#register").show();
                    $("#exit").hide();
                    $("#user").hide();
                }
            }
        })
    }
});