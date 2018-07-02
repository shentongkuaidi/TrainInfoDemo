package com.ahut.service.impl;

import com.ahut.dao.RegisterDao;
import com.ahut.model.Code;
import com.ahut.model.User;
import com.ahut.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("registerService")
public class RegisterServiceImpl implements RegisterService {

    @Autowired
    private RegisterDao registerDao;

    @Override
    public void saveCode(Code code){
        registerDao.saveCode(code);
    }

    @Override
    public Boolean saveUser(User user){
        return registerDao.saveUser(user);
    }

    @Override
    public User queryConfirm(String uid,String utelephone,String uemail){
        return registerDao.queryConfirm(uid,utelephone,uemail);
    }

    @Override
    public User updateInfoConfirm(String uid,String utelephone,String uemail){
        return registerDao.updateInfoConfirm(uid,utelephone,uemail);
    }

    @Override
    public  String queryCode(String cway){
        return registerDao.queryCode(cway);
    }
}
