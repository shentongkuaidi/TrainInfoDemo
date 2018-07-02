package com.ahut.model;

//用户表/管理员表
public class User {

    private String uid;//用户名
    private String upassword;//密码
    private String uname;//姓名
    private String usex;//性别
    private  String unumber;//二代身份证号码
    private  String utelephone;//手机号码
    private  String ustatus;//身分类型/附加信息
    private  String uemail;//qq邮箱
    private  String upower;//身份级别/权限

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getUpassword() {
        return upassword;
    }

    public void setUpassword(String upassword) {
        this.upassword = upassword;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getUsex() {
        return usex;
    }

    public void setUsex(String usex) {
        this.usex = usex;
    }

    public String getUnumber() {
        return unumber;
    }

    public void setUnumber(String unumber) {
        this.unumber = unumber;
    }

    public String getUtelephone() {
        return utelephone;
    }

    public void setUtelephone(String utelephone) {
        this.utelephone = utelephone;
    }

    public String getUstatus() {
        return ustatus;
    }

    public void setUstatus(String ustatus) {
        this.ustatus = ustatus;
    }

    public String getUemail() {
        return uemail;
    }

    public void setUemail(String uemail) {
        this.uemail = uemail;
    }

    public String getUpower() {
        return upower;
    }

    public void setUpower(String upower) {
        this.upower = upower;
    }
}