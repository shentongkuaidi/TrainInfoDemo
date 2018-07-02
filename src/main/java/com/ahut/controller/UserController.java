package com.ahut.controller;

import com.ahut.model.StudentIdentify;
import com.ahut.model.User;
import com.ahut.service.RegisterService;
import com.ahut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	RegisterService registerService;

	//重置密码（登陆时忘记密码、登陆后修改密码）
	@RequestMapping(value = "/resetPassword")
	public Map<String, Object> resetPassword(String uid, String upassword,HttpSession session) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		User user = (User) session.getAttribute("user");
		if (userService.resetPassword(uid, upassword)) {
			if(user != null){
				User u = registerService.queryConfirm(user.getUid(), null, null);
				session.setAttribute("user", u);
			}
			resultMap.put("result", "1");
		} else resultMap.put("result", "0");
		return resultMap;
	}

	//登陆后修改密码--验证旧密码
	@RequestMapping(value = "/getOldPassword")
	public Map<String, Object> getOldPassword(String oldPassword, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		if (user.getUpassword().equals(oldPassword)) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//修改个人信息
	@RequestMapping(value = "/updateInfo")
	public Map<String, Object> updateInfo(User user, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		if (userService.updateInfo(user)) {
			User u = registerService.queryConfirm(user.getUid(), null, null);
			session.setAttribute("user", u);
			resultMap.put("result", "1");
		} else resultMap.put("result", "0");
		return resultMap;
	}

}
