package com.ahut.model;

import java.sql.Time;

//座位表
public class Seat {

    private  String sid;//座位号
    private  String tid;//车次号
    private  String cid;//车厢号
    private  String sday;//当日日期(为了方便使用String，使用date报400错误)
    private Time soccupystart;//占用开始时间
    private  Time soccupyend;//占用结束时间

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getSday() {
        return sday;
    }

    public void setSday(String sday) {
        this.sday = sday;
    }

    public Time getSoccupystart() {
        return soccupystart;
    }

    public void setSoccupystart(Time soccupystart) {
        this.soccupystart = soccupystart;
    }

    public Time getSoccupyend() {
        return soccupyend;
    }

    public void setSoccupyend(Time soccupyend) {
        this.soccupyend = soccupyend;
    }
}
