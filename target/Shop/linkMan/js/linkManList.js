$(document).ready(function () {
    //加载联系人列表
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
        $("#linkManList").children('tbody').empty();
        var params = {};
        params.page = 1;
        $.ajax({
            type: "post",
            url: "/linkManList",
            dataType: "json",
            data: params,
            success: function (data) {
                if (data.totalCount >= 1) {
                    var tbody = "";
                    $.each(data.linkmanList, function (index, el) {
                        var index = parseInt(index) + parseInt(1);
                        var tr = "<tr>";
                        tr += "<td>" + "<input type='checkbox' value='" + el.lid + "'>" + "</td>";
                        tr += "<td>" + index + "</td>";
                        tr += "<td>" + el.lname + "</td>";
                        tr += "<td>" + el.ltype + "</td>";
                        tr += "<td>" + el.lnumber + "</td>";
                        tr += "</tr>";
                        tbody += tr;
                    });
                    if (data.totalPage === 1) {
                        $("#firstPage").hide();//隐藏首页
                        $("#lastPage").hide(); //隐藏上一页
                        $("#finalPage").hide();//隐藏尾页
                        $("#nextPage").hide(); //隐藏下一页
                    } else {
                        $("#firstPage").hide();//隐藏首页
                        $("#lastPage").hide(); //隐藏上一页
                    }
                    $("#currPage").html(data.currPage);
                    $("#totalPage").html(data.totalPage);
                    $("#totalCount").html(data.totalCount);
                } else {
                    $("#linkManList").children('thead').hide();
                    $("#linkManList").children('tfoot').hide();
                    var tr = "<tr>";
                    tr += "<td class='body'>" + "<h3>——暂未添加任何联系人，" + "<a href='LinkManAdd.html' style='color: #149bdf'>添加联系人</a>——</h3>" + "</td>";
                    tr += "</tr>";
                    tbody += tr;
                }
                $("#linkManList").children('tbody').append(tbody);
            }
        })
    };

    // 全选、取消全选
    var isCheckAll = false;
    $("#all").click(function () {
        if (isCheckAll) {
            $("input[type='checkbox']").each(function () {
                this.checked = false;
            });
            isCheckAll = false;
        } else {
            $("input[type='checkbox']").each(function () {
                this.checked = true;
            });
            isCheckAll = true;
        }
    });

    // 联系人详细信息
    $("#detail").click(function () {
        var length = $('input:checkbox:checked').length;
        if (length <= 0) {
            swal("", "请选择一个要查看的联系人！", "warning");
        } else if (length > 1) {
            swal("", "只能选择一个！", "warning");
        } else {
            window.location.href = "LinkManInfo.html?lid=" + $('input:checkbox:checked').val();
        }
    });

    // 增加联系人
    $("#add").click(function () {
        window.location.href = "LinkManAdd.html";
    });

    // 删除一个、多个联系人
    $("#delete").click(function () {
        var lids = [];
        $('input:checkbox:checked').each(function (index, item) {
            lids.push($(this).val());
        });
        if ($("#all").is(":checked")) {
            lids.splice(0, 1);
        }
        if ($('input:checkbox:checked').length <= 0) {
            swal("", "请至少选择一个！", "warning");
        } else {
            swal({
                title: "您真的确定要删除吗？",
                text: "请确认！",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "是的，我要删除",
                confirmButtonColor: "#ec6c62"
            }, function () {
                var params = {};
                params.lids = lids;
                $.ajax({
                    type: "get",
                    url: "/linkManDelete",
                    dataType: "json",
                    traditional: true,
                    data: params,
                    success: function (data) {
                        if (data.result === "1") {
                            window.location.reload();
                        } else{
                            swal("","未知异常！","error");
                        }
                    }
                })
            })
        }
    });

    //清空
    $("#clear").click(function () {
        swal({
            title: "您真的确定要清空吗？",
            text: "请确认！",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "是的，我要清空",
            confirmButtonColor: "#ec6c62"
        }, function () {
            $.ajax({
                type: "get",
                url: "/linkManClear",
                dataType: "json",
                data: {},
                success: function (data) {
                    if (data.result === "1") {
                        window.location.reload();
                    } else{
                        swal("","未知异常！","error");
                    }
                }
            })
        })
    });

    //首页
    $("#firstPage").click(function () {
        $("#linkManList").children('tbody').empty();
        var params = {};
        params.page = 1;
        $.ajax({
            type: "post",
            url: "/linkManList",
            dataType: "json",
            data: params,
            success: function (data) {
                if (data.totalCount >= 1) {
                    var tbody = "";
                    $.each(data.linkmanList, function (index, el) {
                        var index = parseInt(index) + parseInt(1);
                        var tr = "<tr>";
                        tr += "<td>" + "<input type='checkbox' value='" + el.lid + "'>" + "</td>";
                        tr += "<td>" + index + "</td>";
                        tr += "<td>" + el.lname + "</td>";
                        tr += "<td>" + el.ltype + "</td>";
                        tr += "<td>" + el.lnumber + "</td>";
                        tr += "</tr>";
                        tbody += tr;
                    });
                    $("#finalPage").show();//显示尾页
                    $("#nextPage").show(); //显示下一页
                    $("#firstPage").hide();//隐藏首页
                    $("#lastPage").hide(); //隐藏上一页
                    $("#currPage").html(data.currPage);
                    $("#totalPage").html(data.totalPage);
                    $("#totalCount").html(data.totalCount);
                } else {
                    $("#linkManList").children('thead').hide();
                    $("#linkManList").children('tfoot').hide();
                }
                $("#linkManList").children('tbody').append(tbody);
            }
        })
    });

    //上一页
    $("#lastPage").click(function () {
        $("#linkManList").children('tbody').empty();
        var currPage = $("#currPage").html();
        var params = {};
        params.page = --currPage;
        $.ajax({
            type: "post",
            url: "/linkManList",
            dataType: "json",
            data: params,
            success: function (data) {
                console.log(data.totalCount);
                if (data.totalCount >= 1) {
                    var tbody = "";
                    $.each(data.linkmanList, function (index, el) {
                        var index = parseInt(index) + parseInt(1);
                        var tr = "<tr>";
                        tr += "<td>" + "<input type='checkbox' value='" + el.lid + "'>" + "</td>";
                        tr += "<td>" + index + "</td>";
                        tr += "<td>" + el.lname + "</td>";
                        tr += "<td>" + el.ltype + "</td>";
                        tr += "<td>" + el.lnumber + "</td>";
                        tr += "</tr>";
                        tbody += tr;
                    });
                    $("#finalPage").show();//显示尾页
                    $("#nextPage").show(); //显示下一页
                    if (currPage == 1) {
                        $("#firstPage").hide();//隐藏首页
                        $("#lastPage").hide(); //隐藏上一页
                    } else {
                        $("#firstPage").show();//显示首页
                        $("#lastPage").show(); //显示上一页
                    }
                    $("#currPage").html(data.currPage);
                    $("#totalPage").html(data.totalPage);
                    $("#totalCount").html(data.totalCount);
                } else {
                    $("#linkManList").children('thead').hide();
                    $("#linkManList").children('tfoot').hide();
                }
                $("#linkManList").children('tbody').append(tbody);
            }
        })
    });

    //下一页
    $("#nextPage").click(function () {
        $("#linkManList").children('tbody').empty();
        var currPage = $("#currPage").html();
        var totalPage = $("#totalPage").html();
        var params = {};
        params.page = ++currPage;
        $.ajax({
            type: "post",
            url: "/linkManList",
            dataType: "json",
            data: params,
            success: function (data) {
                console.log(data.totalCount);
                if (data.totalCount >= 1) {
                    var tbody = "";
                    $.each(data.linkmanList, function (index, el) {
                        var index = parseInt(index) + parseInt(1);
                        var tr = "<tr>";
                        tr += "<td>" + "<input type='checkbox' value='" + el.lid + "'>" + "</td>";
                        tr += "<td>" + index + "</td>";
                        tr += "<td>" + el.lname + "</td>";
                        tr += "<td>" + el.ltype + "</td>";
                        tr += "<td>" + el.lnumber + "</td>";
                        tr += "</tr>";
                        tbody += tr;
                    });
                    $("#firstPage").show();//显示首页
                    $("#lastPage").show(); //显示上一页
                    if (currPage == totalPage) {
                        $("#finalPage").hide();//隐藏尾页
                        $("#nextPage").hide(); //隐藏下一页
                    } else {
                        $("#finalPage").show();//显示尾页
                        $("#nextPage").show(); //显示下一页
                    }
                    $("#currPage").html(data.currPage);
                    $("#totalPage").html(data.totalPage);
                    $("#totalCount").html(data.totalCount);
                } else {
                    $("#linkManList").children('thead').hide();
                    $("#linkManList").children('tfoot').hide();
                }
                $("#linkManList").children('tbody').append(tbody);
            }
        })
    });

    //尾页
    $("#finalPage").click(function () {
        $("#linkManList").children('tbody').empty();
        var params = {};
        params.page = $("#totalPage").html();
        $.ajax({
            type: "post",
            url: "/linkManList",
            dataType: "json",
            data: params,
            success: function (data) {
                console.log(data.totalCount);
                if (data.totalCount >= 1) {
                    var tbody = "";
                    $.each(data.linkmanList, function (index, el) {
                        var index = parseInt(index) + parseInt(1);
                        var tr = "<tr>";
                        tr += "<td>" + "<input type='checkbox' value='" + el.lid + "'>" + "</td>";
                        tr += "<td>" + index + "</td>";
                        tr += "<td>" + el.lname + "</td>";
                        tr += "<td>" + el.ltype + "</td>";
                        tr += "<td>" + el.lnumber + "</td>";
                        tr += "</tr>";
                        tbody += tr;
                    });
                    $("#firstPage").show();//显示首页
                    $("#lastPage").show(); //显示上一页
                    $("#finalPage").hide();//隐藏尾页
                    $("#nextPage").hide(); //隐藏下一页
                    $("#currPage").html(data.currPage);
                    $("#totalPage").html(data.totalPage);
                    $("#totalCount").html(data.totalCount);
                } else {
                    $("#linkManList").children('thead').hide();
                    $("#linkManList").children('tfoot').hide();
                }
                $("#linkManList").children('tbody').append(tbody);
            }
        })
    })

});


