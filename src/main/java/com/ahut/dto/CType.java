package com.ahut.dto;

//席别座位计数
public class CType {
	private String ctype;//席别
	private int ccount;//剩余座位数

	public String getCtype() {
		return ctype;
	}

	public void setCtype(String ctype) {
		this.ctype = ctype;
	}

	public int getCcount() {
		return ccount;
	}

	public void setCcount(int ccount) {
		this.ccount = ccount;
	}
}
