package com.ahut.controller;

import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.ahut.model.Code;
import com.ahut.service.RegisterService;
import com.ahut.utils.AliyunMessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@RestController
public class SmsVerController {

	@Autowired
	private RegisterService registerService;

	//发送短信验证码
	@RequestMapping(value = "/smsVer")
	public String sendMsg(@RequestBody Map<String, String> map) throws ClientException {
		int num = 1;
		String code = AliyunMessageUtil.createRandomNum(6);
		System.out.println(code);
		String jsonContent = "{\"code\":" + code + "}";
		String telephone = map.get("utelephone");
		Map<String, String> paramMap = new HashMap<>();
		paramMap.put("phoneNumber", telephone);
		paramMap.put("msgSign", "S毕业设计T");
		paramMap.put("templateCode", "SMS_119087977");
		paramMap.put("jsonContent", jsonContent);
		SendSmsResponse sendSmsResponse = AliyunMessageUtil.sendSms(paramMap);
//		异常信息
//		System.out.println(sendSmsResponse.getCode());
		if (!(sendSmsResponse.getCode() != null && sendSmsResponse.getCode().equals("OK")))
			num--;
		else {
			Code c = new Code();
			c.setCway(telephone);
			c.setCcode(code);
			c.setCtime(new Date());
			registerService.saveCode(c);
		}
		return String.valueOf(num);
	}

}
