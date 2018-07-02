package com.ahut.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class ExitController {

	//退出
	@RequestMapping("/exit")
	public String exit(HttpServletRequest request) {
		request.getSession().invalidate();
		return "redirect:index.html";
	}
}
