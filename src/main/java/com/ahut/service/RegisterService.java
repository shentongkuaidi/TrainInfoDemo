package com.ahut.service;

import com.ahut.model.Code;
import com.ahut.model.User;

public interface RegisterService {

    User queryConfirm(String uid,String utelephone,String uemail);
    User updateInfoConfirm(String uid,String utelephone,String uemail);
    String queryCode(String cway);
    void saveCode(Code code);
    Boolean saveUser(User user);
}
