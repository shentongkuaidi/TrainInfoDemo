package com.ahut.controller;

import org.springframework.web.bind.annotation.RestController;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class VerifyCodeController {
	/*
	 获取验证码
	 */
	@RequestMapping("/getVerifyCode")
	public void generate(HttpServletResponse response, HttpSession session) throws Exception {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		String verifyCodeValue = drawImg(output);
		session.setAttribute("verifyCodeValue", verifyCodeValue);
		ServletOutputStream out = response.getOutputStream();
		output.writeTo(out);
	}

	/*
	 绘画验证码
	 */
	private String drawImg(ByteArrayOutputStream output) throws Exception {
		StringBuilder code = new StringBuilder();
		// 随机产生4个字符
		for (int i = 0; i < 4; i++) {
			code.append(randomChar());
		}
		int width = 70;
		int height = 25;
		BufferedImage bi = new BufferedImage(width, height,
				BufferedImage.TYPE_3BYTE_BGR);
		Font font = new Font("Times New Roman", Font.PLAIN, 20);
		// 调用Graphics2D绘画验证码
		Graphics2D g = bi.createGraphics();
		g.setFont(font);
		Color color = new Color(66, 2, 82);
		g.setColor(color);
		g.setBackground(new Color(226, 226, 240));
		g.clearRect(0, 0, width, height);
		FontRenderContext context = g.getFontRenderContext();
		Rectangle2D bounds = font.getStringBounds(code.toString(), context);
		double x = (width - bounds.getWidth()) / 2;
		double y = (height - bounds.getHeight()) / 2;
		double ascent = bounds.getY();
		double baseY = y - ascent;
		g.drawString(code.toString(), (int) x, (int) baseY);
		g.dispose();
		ImageIO.write(bi, "jpg", output);
		return code.toString();
	}

	/**
	 * 随机参数一个字符
	 */
	private char randomChar() {
		Random r = new Random();
		String s = "ABCDEFGHJKLMNPRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789";
		return s.charAt(r.nextInt(s.length()));
	}


	//登陆时：验证码验证
	@RequestMapping(value = "/verifyCodeConfirm")
	public Map<String, Object> verfiyCodeConfirm(String loginCode, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String verifyCodeValue = (String) session.getAttribute("verifyCodeValue");
		System.out.print(verifyCodeValue);
		if (loginCode.equals(verifyCodeValue)) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}
}
