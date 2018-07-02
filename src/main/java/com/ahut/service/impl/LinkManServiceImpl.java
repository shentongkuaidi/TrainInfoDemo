package com.ahut.service.impl;

import com.ahut.dao.LinkManDao;
import com.ahut.model.LinkMan;
import com.ahut.service.LinkManService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("linkManService")
public class LinkManServiceImpl implements LinkManService{

	@Autowired
	private LinkManDao linkManDao;

	@Override
	public List<LinkMan> queryList(Map<String,Object> map){
		return linkManDao.queryList(map);
	}

	@Override
	public int queryTotal(String uid){
		return linkManDao.queryTotal(uid);
	}

	@Override
	public LinkMan queryObject(int lid){
		return linkManDao.queryObject(lid);
	}

	@Override
	public LinkMan queryObject2(String lname,String uid){return linkManDao.queryObject2(lname,uid); }

	@Override
	public int delete(String lnumber){
		return linkManDao.delete(lnumber);
	}

	@Override
	public int deleteBatch(String[] lids){
		return linkManDao.deleteBatch(lids);
	}

	@Override
	public int clear(String uid){
		return linkManDao.clear(uid);
	}

	@Override
	public void save(LinkMan linkMan){
		linkManDao.save(linkMan);
	}

	@Override
	public LinkMan confirmLinkMan(String lnumber, String uid){
		return linkManDao.confirmLinkMan(lnumber,uid);
	}

}
