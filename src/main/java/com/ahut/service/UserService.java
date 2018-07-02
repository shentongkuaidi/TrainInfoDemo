package com.ahut.service;

import com.ahut.model.StudentIdentify;
import com.ahut.model.User;

public interface UserService {

	Boolean resetPassword(String uid,String upassword);
	Boolean updateInfo(User user);
	void identify(StudentIdentify studentIdentify);
	StudentIdentify getIdentify(String id);
}
