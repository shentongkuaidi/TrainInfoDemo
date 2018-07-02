package com.ahut.service.impl;

import com.ahut.dao.UserDao;
import com.ahut.model.StudentIdentify;
import com.ahut.model.User;
import com.ahut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("userServiceImpl")
public class UserServiceImpl implements UserService {
	@Autowired
	private UserDao userDao;

	@Override
	public Boolean resetPassword(String uid,String upassword){
		return userDao.resetPassword(uid,upassword);
	}

	@Override
	public Boolean updateInfo(User user){
		return userDao.updateInfo(user);
	}

	@Override
	public void identify(StudentIdentify studentIdentify){
		userDao.identify(studentIdentify);
	}

	@Override
	public StudentIdentify getIdentify(String id){
		return userDao.getIdentify(id);
	}
}
