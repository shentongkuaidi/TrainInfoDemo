package com.ahut.model;

import java.util.Date;

//发送的邮箱消息
public class Email {
    private String eemail;//收件人邮箱地址
    private String etitle;//邮件标题
    private String econtent;//邮件内容
    private Date etime;//发送时间

    public Date getEtime() {
        return etime;
    }

    public void setEtime(Date etime) {
        this.etime = etime;
    }

    public String getEemail() {
        return eemail;
    }

    public void setEemail(String eemail) {
        this.eemail = eemail;
    }

    public String getEtitle() {
        return etitle;
    }

    public void setEtitle(String etitle) {
        this.etitle = etitle;
    }

    public String getEcontent() {
        return econtent;
    }

    public void setEcontent(String econtent) {
        this.econtent = econtent;
    }
}
