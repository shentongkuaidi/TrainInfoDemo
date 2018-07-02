package com.ahut.controller;

import com.ahut.model.User;
import com.ahut.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;


@RestController
public class LoginController {

	@Autowired
	private LoginService loginService;

	//是否登陆验证
	@RequestMapping(value = "/loginConfirm")
	public Map<String, Object> loginConfirm(HttpSession session) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		User user = (User) session.getAttribute("user");
		if (user == null)
			resultMap.put("result", "0");
		else {
			resultMap.put("result", "1");
			resultMap.put("user", user);
		}
		return resultMap;
	}

	//登陆
	@RequestMapping(value = "/login")
	public Map<String, Object> login(User u, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		User user = loginService.queryUser(u);
		if (user == null)
			resultMap.put("result", "0");
		else {
			session.setAttribute("user", user);
			resultMap.put("result", "1");
		}
		return resultMap;
	}

}
