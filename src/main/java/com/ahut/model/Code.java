package com.ahut.model;

import java.util.Date;

//短信验证码信息存储
public class Code {
    private String cway;//手机号码/邮箱地址
    private String ccode;//验证码
    private Date ctime;//生成时间

    public Date getCtime() {
        return ctime;
    }

    public void setCtime(Date ctime) {
        this.ctime = ctime;
    }

    public String getCway() {
        return cway;
    }

    public void setCway(String cway) {
        this.cway = cway;
    }

    public String getCcode() {
        return ccode;
    }

    public void setCcode(String ccode) {
        this.ccode = ccode;
    }
}
