package com.ahut.model;

import java.util.Date;

//列车表
public class Train {

    private  String tid;//车次号
    private  String tmileage;//总里程数
    private  Date tstarttime;//起始时间
    private  Date tendtime;//终到时间
    private  String torigin;//起始站
    private  String tdestination;//终到站

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getTmileage() {
        return tmileage;
    }

    public void setTmileage(String tmileage) {
        this.tmileage = tmileage;
    }

    public Date getTstarttime() {
        return tstarttime;
    }

    public void setTstarttime(Date tstarttime) {
        this.tstarttime = tstarttime;
    }

    public Date getTendtime() {
        return tendtime;
    }

    public void setTendtime(Date tendtime) {
        this.tendtime = tendtime;
    }

    public String getTorigin() {
        return torigin;
    }

    public void setTorigin(String torigin) {
        this.torigin = torigin;
    }

    public String getTdestination() {
        return tdestination;
    }

    public void setTdestination(String tdestination) {
        this.tdestination = tdestination;
    }
}
