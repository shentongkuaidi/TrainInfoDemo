package com.ahut.model;

//订单表ordertable
public class OrderTable {
	private String otid;//订单号(uid+datetime)
	private String ottime;//订单日期
	private String tid;//车次
	private String otorigin;//起始站
	private String otmidstation;//中转站
	private String otdestination;//终到站
	private String otstartday;//出发日
	private String otstarttime;//出发时间
	private String otendtime;//终到时间
	private int otnumber;//乘客人数
	private double otprice;//订单总价
	private String uid;//购买人
	private String otstatus;//订单状态

	public String getOtid() {
		return otid;
	}

	public void setOtid(String otid) {
		this.otid = otid;
	}

	public String getOttime() {
		return ottime;
	}

	public void setOttime(String ottime) {
		this.ottime = ottime;
	}

	public String getTid() {
		return tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public String getOtorigin() {
		return otorigin;
	}

	public void setOtorigin(String otorigin) {
		this.otorigin = otorigin;
	}

	public String getOtmidstation() {
		return otmidstation;
	}

	public void setOtmidstation(String otmidstation) {
		this.otmidstation = otmidstation;
	}

	public String getOtdestination() {
		return otdestination;
	}

	public void setOtdestination(String otdestination) {
		this.otdestination = otdestination;
	}

	public String getOtstartday() {
		return otstartday;
	}

	public void setOtstartday(String otstartday) {
		this.otstartday = otstartday;
	}

	public String getOtstarttime() {
		return otstarttime;
	}

	public void setOtstarttime(String otstarttime) {
		this.otstarttime = otstarttime;
	}

	public String getOtendtime() {
		return otendtime;
	}

	public void setOtendtime(String otendtime) {
		this.otendtime = otendtime;
	}

	public int getOtnumber() {
		return otnumber;
	}

	public void setOtnumber(int otnumber) {
		this.otnumber = otnumber;
	}

	public double getOtprice() {
		return otprice;
	}

	public void setOtprice(double otprice) {
		this.otprice = otprice;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getOtstatus() {
		return otstatus;
	}

	public void setOtstatus(String otstatus) {
		this.otstatus = otstatus;
	}
}
