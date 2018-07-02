package com.ahut.service.impl;

import com.ahut.dao.LoginDao;
import com.ahut.model.User;
import com.ahut.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("loginService")
public class LoginServiceImpl implements LoginService {

    @Autowired
    private LoginDao loginDao;

    @Override
    public User queryUser(User user){
        return loginDao.queryUser(user);
    }
}
