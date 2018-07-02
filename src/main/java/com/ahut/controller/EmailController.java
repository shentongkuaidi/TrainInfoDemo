package com.ahut.controller;

import com.ahut.model.Code;
import com.ahut.model.Email;
import com.ahut.service.EmailService;
import com.ahut.service.RegisterService;
import com.ahut.utils.AliyunMessageUtil;
import com.ahut.utils.JavaEmailSenderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
public class EmailController {
	@Autowired
	private EmailService emailService;

	@Autowired
	private RegisterService registerService;

	/**
	 * test 发送邮箱消息
	 *
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/sendEmail", produces = "application/json;charset=UTF-8")
	public String sendEmail(HttpServletRequest request) throws Exception {
		//发送状态
		String msg = "1";
		//对方邮箱
		String email = "993047454@qq.com";
		//标题
		String title = "沈通";
		//内容
		String content = "您好，沈通先生！您已购2018年1月8日 G1011马鞍山东 至 丹阳 9：30开 二等座5车5F号  票价：62元";
		JavaEmailSenderUtil.sendEmail(email, title, content);
		//邮箱消息存入数据库
		Email e = new Email();
		e.setEemail(email);
		e.setEtitle(title);
		e.setEcontent(content);
		e.setEtime(new Date());
		emailService.save(e);
		return msg;
	}

	/*
	邮箱方式找回密码，发送邮箱验证消息
	 */
	@RequestMapping(value = "/emailVer", produces = "application/json;charset=UTF-8")
	public Map<String, Object> sendEmailConfirm(String uemail) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String code = AliyunMessageUtil.createRandomNum(6);
		String title = "密码找回验证";
		String content = "请保管好您的验证码：" + code + "请勿告诉他人！";
		JavaEmailSenderUtil.sendEmail(uemail, title, content);

		Code c = new Code();
		c.setCway(uemail);
		c.setCcode(code);
		c.setCtime(new Date());
		registerService.saveCode(c);
		resultMap.put("result", "1");
		return resultMap;
	}

}
