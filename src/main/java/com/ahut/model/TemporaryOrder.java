package com.ahut.model;

//存放下单有效到期订单时间
public class TemporaryOrder {
	private String id;//订单号
	private String endtime;//截止时间
	private String uid;//用户

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEndtime() {
		return endtime;
	}

	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}
}
