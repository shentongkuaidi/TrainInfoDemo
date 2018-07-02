package com.ahut.controller;

import com.ahut.model.User;
import com.ahut.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RegisterController {

	@Autowired
	private RegisterService registerService;

	//注册
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public Map<String, Object> register(User user, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		if (registerService.saveUser(user)) {
			session.setAttribute("user", user);
			resultMap.put("result", "1");
		} else resultMap.put("result", "0");
		return resultMap;
	}

	//注册时：判断用户名是否存在、手机号是否注册过、邮箱是否注册过
	@RequestMapping(value = "/userConfirm", method = RequestMethod.POST)
	public Map<String, Object> queryConfirm(String uid, String utelephone, String uemail) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		User user = registerService.queryConfirm(uid, utelephone, uemail);
		if (user == null)
			resultMap.put("result", "0");
		else {
			resultMap.put("result", "1");
			resultMap.put("utelephone", user.getUtelephone()); //用于找回密码Step1
			resultMap.put("uemail", user.getUemail().trim()); //用于找回密码Step1
		}
		return resultMap;
	}

	//修改个人信息：判断手机号是否注册过、邮箱是否注册过（非本人使用的手机号、邮箱）
	@RequestMapping(value = "/updateInfoConfirm", method = RequestMethod.POST)
	public Map<String, Object> updateInfoConfirm(String uid, String utelephone, String uemail) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		User user = registerService.updateInfoConfirm(uid, utelephone, uemail);
		if (user == null)
			resultMap.put("result", "1");
		else
			resultMap.put("result", "0");
		return resultMap;
	}

	//短信、邮箱验证码匹配
	@RequestMapping(value = "/getCode", method = RequestMethod.POST)
	public Map<String, Object> queryCode(String ucode, String cway) {
		Map<String, Object> resultMap = new HashMap<>();
		String code = registerService.queryCode(cway);
		System.out.println(code.equals(ucode));
		if (code.equals(ucode))
			resultMap.put("result", "1");
		else
			resultMap.put("result", "0");
		return resultMap;
	}


}
