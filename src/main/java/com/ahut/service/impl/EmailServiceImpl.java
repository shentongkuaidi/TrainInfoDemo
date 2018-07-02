package com.ahut.service.impl;

import com.ahut.dao.EmailDao;
import com.ahut.model.Email;
import com.ahut.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("emailService")
public class EmailServiceImpl implements EmailService {

    @Autowired
    private EmailDao emailDao;

    @Override
    public void save(Email email){
        emailDao.save(email);
    }
}
