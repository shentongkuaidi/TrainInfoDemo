package com.ahut.model;

import java.util.Date;

//联系人表
public class LinkMan {

    private  String lid;//联系人编号
    private  Date ltime;//添加时间
    private  String lname;//联系人真实姓名
    private  String lsex;//联系人性别
    private  String ltype;//身份类型
    private  String lnumber;//证件号码
    private  String uid;//用户名

    public String getLid() {
        return lid;
    }

    public Date getLtime() {
        return ltime;
    }

    public void setLtime(Date ltime) {
        this.ltime = ltime;
    }

    public String getLsex() {
        return lsex;
    }

    public void setLsex(String lsex) {
        this.lsex = lsex;
    }

    public void setLid(String lid) {
        this.lid = lid;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getLtype() {
        return ltype;
    }

    public void setLtype(String ltype) {
        this.ltype = ltype;
    }

    public String getLnumber() {
        return lnumber;
    }

    public void setLnumber(String lnumber) {
        this.lnumber = lnumber;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
