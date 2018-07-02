package com.ahut.dao;

import com.ahut.model.LinkMan;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface LinkManDao extends BaseDao<LinkMan> {

	List<LinkMan> queryList(Map<String,Object> map);
	int queryTotal(String uid);
	int clear(String uid);
	LinkMan confirmLinkMan(@Param(value = "lnumber") String lnumber, @Param(value = "uid") String uid);
	LinkMan queryObject2(@Param(value = "lname") String lname,@Param(value = "uid") String uid);
}
