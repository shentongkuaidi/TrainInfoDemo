package com.ahut.controller;

import com.ahut.model.LinkMan;
import com.ahut.model.User;
import com.ahut.service.LinkManService;
import com.ahut.utils.PageUtils;
import com.ahut.utils.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class LinkManController {
	@Autowired
	private LinkManService linkManService;

	/**
	 * 常用联系人列表
	 * @param session
	 * @param page
	 * @param map
	 * @return linkManList,totalCount,totalPage,currPage
	 */
	@RequestMapping(value = "/linkManList")
	public Map<String, Object> queryList(HttpSession session, String page, Map<String, Object> map) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		int total = linkManService.queryTotal(user.getUid());

		map.put("page", page);
		map.put("uid", user.getUid());
		Query query = new Query(map);
		List<LinkMan> linkManList = linkManService.queryList(query);

		PageUtils pageUtils = new PageUtils(linkManList, total, query.getLimit(), query.getPage());
		resultMap.put("linkmanList", linkManList);//联系人列表
		resultMap.put("totalCount", pageUtils.getTotalCount());//总记录数
		resultMap.put("totalPage", pageUtils.getTotalPage());//总页数
		resultMap.put("currPage", pageUtils.getCurrPage());//当前页码
		return resultMap;
	}

	/**
	 * 常用联系人详细信息
	 * @param lid
	 * @return LinkMan
	 */
	@RequestMapping(value = "/linkManInfo")
	public LinkMan queryObject(int lid) {
		return linkManService.queryObject(lid);
	}

	/**
	 * 乘客信息列表（包括user）
	 * @param session
	 * @param lname
	 * @param map
	 * @return linkManList,user
	 */
	@RequestMapping(value = "/passengerList")
	public Map<String, Object> queryPassenger(HttpSession session, String lname, Map<String, Object> map) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		map.put("uid", user.getUid());
		map.put("lname", lname);
		List<LinkMan> linkManList = linkManService.queryList(map);
		resultMap.put("linkmanList", linkManList);//联系人列表
		resultMap.put("u", user);//用户信息
		return resultMap;
	}

	//乘客详细信息（包括user）
	@RequestMapping(value = "/passengerInfo")
	public Map<String, Object> queryObject2(int lid, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		LinkMan linkMan = linkManService.queryObject(lid);
		if (linkMan == null) {
			resultMap.put("result", "1");
			resultMap.put("usr", user);
		} else {
			resultMap.put("result", "2");
			resultMap.put("linkMan", linkMan);
		}
		return resultMap;
	}

	//乘客详细信息（包括user）
	@RequestMapping(value = "/modifyPassengerInfo")
	public Map<String, Object> queryObject2(String lname, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		LinkMan linkMan = linkManService.queryObject2(lname, user.getUid());
		if (linkMan == null) {
			resultMap.put("result", "0");
			resultMap.put("usr", user);
		} else {
			resultMap.put("result", "1");
			resultMap.put("linkMan", linkMan);
		}
		return resultMap;
	}

	//删除一个联系人
	@RequestMapping(value = "/linkManDeleteOne")
	public Map<String, Object> delete(String lnumber) {
		Map<String, Object> resultMap = new HashMap<>();
		int num = linkManService.delete(lnumber);
		if (num != 0) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//删除一个、多个常用联系人
	@RequestMapping(value = "/linkManDelete")
	public Map<String, Object> deleteBatch(String[] lids) {
		Map<String, Object> resultMap = new HashMap<>();
		int num = linkManService.deleteBatch(lids);
		if (num != 0) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//清空联系人
	@RequestMapping(value = "/linkManClear")
	public Map<String, Object> clear(HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		int num = linkManService.clear(user.getUid());
		if (num != 0) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	// 添加联系人
	@RequestMapping(value = "/addLinkMan")
	public Map<String, Object> save(LinkMan linkMan, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		LinkMan lm = new LinkMan();
		User user = (User) session.getAttribute("user");

		lm.setLtime(new Date());
		lm.setLname(linkMan.getLname());
		lm.setLsex(linkMan.getLsex());
		lm.setLtype(linkMan.getLtype());
		lm.setLnumber(linkMan.getLnumber());
		lm.setUid(user.getUid());

		linkManService.save(lm);
		resultMap.put("result", "1");
		return resultMap;
	}

	// 判断联系人是否存在
	@RequestMapping(value = "/confirmLinkMan")
	public Map<String, Object> confirm(String lnumber, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		LinkMan lm = linkManService.confirmLinkMan(lnumber, user.getUid());
		if (lm == null) resultMap.put("result", "0");
		else resultMap.put("result", "1");
		return resultMap;
	}

}
