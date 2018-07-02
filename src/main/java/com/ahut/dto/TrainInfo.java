package com.ahut.dto;

import java.sql.Time;
import java.util.Date;
import java.util.List;

//车次信息
public class TrainInfo {
	private String tid;//车次
	private String sday;//出发日
	private String origin;//出发站信息
	private String destination;//到达站信息
	private Time startTime;//出发时间
	private Time endTime;//到达时间
	private String costTime;//历时
	private List<CType> list;//席别座位计数

	public String getTid() {
		return tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public String getSday() {
		return sday;
	}

	public void setSday(String sday) {
		this.sday = sday;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Time endTime) {
		this.endTime = endTime;
	}

	public String getCostTime() {
		return costTime;
	}

	public void setCostTime(String costTime) {
		this.costTime = costTime;
	}

	public List<CType> getList() {
		return list;
	}

	public void setList(List<CType> list) {
		this.list = list;
	}
}
