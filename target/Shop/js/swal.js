window.onload = function () {
    swal("这是一个信息提示框!");
    swal("弹出了一个操作成功的提示框");
    swal("Good", "弹出了一个错误提示框", "warning");
    swal({
        title: "",
        text: "请确认！",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "是的，我要删除",
        confirmButtonColor: "#ec6c62"
    }, function () {
    });
    swal({
        title: "Good!",
        text: '自定义<span style="color:red">图片</span>、<a href="#">HTML内容</a>。<br/>3秒后自动关闭。',
        imageUrl: "images/thumbs-up.jpg",
        html: true,
        timer: 3000,
        showConfirmButton: false
    });
    swal({
        title: "输入框来了",
        text: "这里可以输入并确认:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "填点东西到这里面吧"
    }, function (inputValue) {
    });
};