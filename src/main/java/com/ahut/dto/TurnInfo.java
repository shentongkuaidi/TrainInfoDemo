package com.ahut.dto;

//中转信息
public class TurnInfo {
	private int rowNum;
	private String firstTid;
	private String lastTid;
	private int midSid;

	public int getRowNum() {
		return rowNum;
	}

	public void setRowNum(int rowNum) {
		this.rowNum = rowNum;
	}

	public String getFirstTid() {
		return firstTid;
	}

	public void setFirstTid(String firstTid) {
		this.firstTid = firstTid;
	}

	public String getLastTid() {
		return lastTid;
	}

	public void setLastTid(String lastTid) {
		this.lastTid = lastTid;
	}

	public int getMidSid() {
		return midSid;
	}

	public void setMidSid(int midSid) {
		this.midSid = midSid;
	}
}
