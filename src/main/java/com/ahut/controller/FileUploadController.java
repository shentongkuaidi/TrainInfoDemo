package com.ahut.controller;

import com.ahut.model.StudentIdentify;
import com.ahut.model.User;
import com.ahut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Controller
public class FileUploadController {

	@Autowired
	private UserService userService;

	/*  1.单文件
	 * 通过流的方式上传文件
     * @RequestParam("file") 将name=file控件得到的文件封装成CommonsMultipartFile 对象
     */
	@RequestMapping("/fileUploadByIo")
	public Map<String, Object> fileUpload(@RequestParam("file") CommonsMultipartFile file) throws IOException {
		Map<String, Object> resultMap = new HashMap<>();
		//用来检测程序运行时间
		long startTime = System.currentTimeMillis();
		System.out.println("fileName：" + file.getOriginalFilename());
		try {
			//获取输出流
			OutputStream os = new FileOutputStream("E:/" + new Date().getTime() + file.getOriginalFilename());
			//获取输入流 CommonsMultipartFile 中可以直接得到文件的流
			InputStream is = file.getInputStream();
			int temp;
			//一个一个字节的读取并写入
			while ((temp = is.read()) != (-1)) {
				os.write(temp);
			}
			os.flush();
			os.close();
			is.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		long endTime = System.currentTimeMillis();
		System.out.println("方法一的运行时间：" + String.valueOf(endTime - startTime) + "ms");
		return resultMap;
	}

	/*  2.单文件（多文件存在问题）
	 *采用spring提供的上传文件的方法
     */
	@RequestMapping("/springUpload")
	public Map<String, Object> springUpload(HttpServletRequest request) throws IllegalStateException, IOException {
		Map<String, Object> resultMap = new HashMap<>();
		long startTime = System.currentTimeMillis();
		//将当前上下文初始化给  CommonsMutipartResolver （多部分解析器）
		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
				request.getSession().getServletContext());
		//检查form中是否有enctype="multipart/form-data"
		if (multipartResolver.isMultipart(request)) {
			//将request变成多部分request
			MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
			//获取multiRequest 中所有的文件名
			Iterator iter = multiRequest.getFileNames();
			while (iter.hasNext()) {
				//一次遍历所有文件
				MultipartFile file = multiRequest.getFile(iter.next().toString());
				if (file != null) {
//					System.out.println(file.getOriginalFilename());
					String path = "E:/springUpload" + file.getOriginalFilename();
					//上传
					file.transferTo(new File(path));
				}
			}

		}
		long endTime = System.currentTimeMillis();
		System.out.println("方法三的运行时间：" + String.valueOf(endTime - startTime) + "ms");
		return resultMap;
	}


	/**
	 * 3.多文件采用file.Transto 来保存上传的文件
	 *
	 * @param collegeName
	 * @param studentID
	 * @param files
	 * @param session
	 * @return StudentIdentify.html
	 * @throws IOException
	 */
	@RequestMapping("/fileUpload")
	public String fileUpload2(@RequestParam("collegeName") String collegeName,
							  @RequestParam("studentID") String studentID,
							  @RequestParam("files") CommonsMultipartFile[] files,
							  HttpSession session) throws IOException {
		User user = (User) session.getAttribute("user");
		long startTime = System.currentTimeMillis();
		//循环获取file数组中得文件
		String[] paths = new String[2];
		for (int i = 0; i < files.length; i++) {
			//保存文件
			MultipartFile file = files[i];
			//String path = "D:/毕业设计/upload/" + new Date().getTime() + file.getOriginalFilename();
			String path = "D:/workspace(Intellij IEDA-2017 )/Shop/target/Shop/img/upload/" + new Date().getTime() + file.getOriginalFilename();
			paths[i] = path;
			File newFile = new File(path);
			//通过CommonsMultipartFile的方法直接写文件（注意这个时候）
			file.transferTo(newFile);
		}
		long endTime = System.currentTimeMillis();
		System.out.println("方法二的运行时间：" + String.valueOf(endTime - startTime) + "ms");
		//保存到数据库
		StudentIdentify s = new StudentIdentify();
		s.setCollegename(collegeName);
		s.setStudentid(studentID);
		s.setFront(paths[0]);
		s.setOpposite(paths[1]);
		s.setId(user.getUid());
		userService.identify(s);
		return "redirect:userInfo/StudentIdentify.html";
	}

	/**
	 * 加载学生证认证信息获取证件正反面照片
	 *
	 * @param session
	 * @return
	 */
	@RequestMapping("/getIdentify")
	@ResponseBody
	public Map<String, Object> getIdentify(HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		StudentIdentify s = userService.getIdentify(user.getUid());
		if (s != null) {
			resultMap.put("result", "1");
			resultMap.put("studentIdentify", s);
		} else if ("学生".equals(user.getUstatus())) {
			resultMap.put("result", "0");
		} else resultMap.put("result", "-1");
		return resultMap;
	}
}
