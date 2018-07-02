package com.ahut.model;

//车厢表
public class Carriage {

    private  String cid;//车厢号
    private  String ctype;//席别
    private  String tid;//车次号

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getCtype() {
        return ctype;
    }

    public void setCtype(String ctype) {
        this.ctype = ctype;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }
}
