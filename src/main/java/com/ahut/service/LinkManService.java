package com.ahut.service;

import com.ahut.model.LinkMan;

import java.util.List;
import java.util.Map;

public interface LinkManService {
	List<LinkMan> queryList(Map<String,Object> map);
	int queryTotal(String uid);
	LinkMan queryObject(int lid);
	LinkMan queryObject2(String lname,String uid);
	LinkMan confirmLinkMan(String lnumber, String uid);
	int delete(String lnumber);
	int deleteBatch(String[] lids);
	int clear(String uid);
	void save(LinkMan linkMan);
}
