package com.ahut.dao;

import com.ahut.model.Code;
import com.ahut.model.User;
import org.apache.ibatis.annotations.Param;

public interface RegisterDao {

    User queryConfirm(@Param(value = "uid") String uid,@Param(value = "utelephone") String utelephone,@Param(value = "uemail") String uemail);
    User updateInfoConfirm(@Param(value = "uid") String uid,@Param(value = "utelephone") String utelephone,@Param(value = "uemail") String uemail);
    String queryCode(String cway);
    void saveCode(Code code);
    Boolean saveUser(User user);
}
