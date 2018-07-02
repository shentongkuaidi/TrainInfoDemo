$(function () {
    window.onload = function () {
        var second = 3;
        var t = setInterval(function () {
            second--;
            $("#second").html(second);
            if (second === 0) {
                clearInterval(t);
                window.location.href = "Login.html";
            }
        }, 1000)
    }
});