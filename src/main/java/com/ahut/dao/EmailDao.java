package com.ahut.dao;

import com.ahut.model.Email;

public interface EmailDao extends BaseDao<Email>{

    void save(Email email);
}
