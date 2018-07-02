package com.ahut.dao;

import com.ahut.model.StudentIdentify;
import com.ahut.model.User;
import org.apache.ibatis.annotations.Param;

public interface UserDao {

	Boolean resetPassword(@Param(value = "uid") String uid,@Param(value = "upassword") String upassword);

	Boolean updateInfo(User user);

	void identify(StudentIdentify studentIdentify);

	StudentIdentify getIdentify(String id);
}
