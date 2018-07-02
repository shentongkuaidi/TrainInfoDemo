package com.ahut.controller;

import com.ahut.model.*;
import com.ahut.service.EmailService;
import com.ahut.service.TicketService;

import com.ahut.utils.JavaEmailSenderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.ahut.dto.Order;

import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@RestController
public class TicketController {

	@Autowired
	private TicketService ticketService;

	//形成订单并插入订单表order(orderTable、orderDetail)
	@RequestMapping("/saveOrder")
	public Map<String, Object> saveOrder(@RequestBody Order order, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date now = new Date();//当前系统时间
		String otId = user.getUid() + "-" + sdf.format(now);
		if (ticketService.queryTemporaryOrderEndTime(user.getUid()) == null) {
			//订单临时表
			TemporaryOrder to = new TemporaryOrder();
			to.setId(otId);
			to.setEndtime(sdf.format(now.getTime() + 600000));
			to.setUid(user.getUid());
			//订单表OrderTable
			OrderTable ot = new OrderTable();
			ot.setOtid(otId);
			ot.setOttime(sdf.format(now));
			ot.setTid(order.getTid());
			ot.setOtorigin(order.getOtorigin());
			if (order.getOtmidstation() != null) {
				ot.setOtmidstation(order.getOtmidstation());
			}
			ot.setOtdestination(order.getOtdestination());
			ot.setOtstartday(order.getOtstartday());
			ot.setOtstarttime(order.getOtstarttime());
			ot.setOtendtime(order.getOtendtime());
			ot.setOtnumber(order.getOtnumber());
			ot.setOtprice(order.getOtprice());
			ot.setUid(user.getUid());
			ot.setOtstatus("0");
			//订单详情表OrderDetail
			List<OrderDetail> ods = new ArrayList<>();
			List<OrderDetail> list = order.getList();
			//判断是否为接续乘车
			int result = order.getTid().indexOf(",");
			if (-1 == result) {
				for (OrderDetail aList : list) {
					OrderDetail od = new OrderDetail();
					od.setLname(aList.getLname());
					od.setLtype(aList.getLtype());
					od.setTid(order.getTid());
					od.setCtype(aList.getCtype());
					od.setCid(aList.getCid());
					od.setSid(aList.getSid());
					od.setOdprice(aList.getOdprice());
					od.setOtid(otId);
					ods.add(od);
				}
			} else {
				String[] tid = order.getTid().split(",");
				int num = order.getList().size();
				for (int i = 0; i < list.size(); i++) {
					OrderDetail od = new OrderDetail();
					od.setLname(list.get(i).getLname());
					od.setLtype(list.get(i).getLtype());
					if (i < num / 2) {
						od.setTid(tid[0]);
						od.setOrigin(order.getOtorigin());
						od.setDestination(order.getOtmidstation());
						od.setStarttime(order.getOtstarttime());
						od.setEndtime(order.getMidendtime());
					} else {
						od.setTid(tid[1]);
						od.setOrigin(order.getOtmidstation());
						od.setDestination(order.getOtdestination());
						od.setStarttime(order.getMidstarttime());
						od.setEndtime(order.getOtendtime());
					}
					od.setCtype(list.get(i).getCtype());
					od.setCid(list.get(i).getCid());
					od.setSid(list.get(i).getSid());
					od.setOdprice(list.get(i).getOdprice());
					od.setOtid(otId);
					ods.add(od);
				}
			}
			if (ticketService.saveOrder(to, ot, ods)) resultMap.put("result", "1");
			else resultMap.put("result", "0");
		} else resultMap.put("result", "0");
		return resultMap;
	}


	//获取已完成订单
	@RequestMapping(value = "/queryOrder")
	public Map<String, Object> queryOrder(HttpSession session, String status, String method,
										  String tidOrName1, String tidOrName2, String start1, String end1,
										  String start2, String end2, String future, String history) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date startDay1 = null, endDay1 = null, startDay2 = null, endDay2 = null;
		if (!"".equals(start1)) {
			startDay1 = sdf.parse(start1);
		}
		if (!"".equals(end1)) {
			endDay1 = sdf.parse(end1);
		}
		if (!"".equals(start2)) {
			startDay2 = sdf.parse(start2);
		}
		if (!"".equals(end2)) {
			endDay2 = sdf.parse(end2);
		}
		List<Order> orderList = ticketService.queryOrder(user.getUid(), status, method, tidOrName1, tidOrName2,
				startDay1, endDay1, startDay2, endDay2, future, history);
		if ("-1".equals(history)) resultMap.put("history", "-1");
		if (orderList.size() > 0) {
			resultMap.put("result", "1");
			resultMap.put("orderList", orderList);
		} else resultMap.put("result", "0");
		return resultMap;
	}

	//获取未完成订单
	@RequestMapping(value = "/continueOrder")
	public Map<String, Object> continueOrder(HttpSession session, String otstatus) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		Order order = ticketService.continueOrder(user.getUid(), otstatus);
		if (order != null) {
			resultMap.put("result", "1");
			resultMap.put("orderInfo", order);
		} else resultMap.put("result", "0");
		return resultMap;
	}

	//查询需要改签的订单
	@RequestMapping(value = "/queryModifyOrder")
	public Map<String, Object> queryModifyOrder(String otid) {
		Map<String, Object> resultMap = new HashMap<>();
		Order order = ticketService.queryModifyOrder(otid);
		resultMap.put("modifyOrder", order);
		return resultMap;
	}

	//检测用户当日取消订单次数
	@RequestMapping(value = "/cancelOrderCount")
	public Map<String, Object> cancelOrderCount(HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		if (user != null && ticketService.cancelOrderCount(user.getUid()) >= 3) resultMap.put("result", "0");
		else resultMap.put("result", "1");
		return resultMap;
	}

	//取消订单
	@RequestMapping(value = "/cancelOrder")
	public Map<String, Object> cancelOrder(HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		if (ticketService.cancelOrder(user.getUid())) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//获取订单支付有效截止时间
	@RequestMapping(value = "/queryTemporaryOrderEndTime")
	public Map<String, Object> queryTemporaryOrderEndTime(HttpSession session) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
		Date now = new Date();
		String endTime = ticketService.queryTemporaryOrderEndTime(user.getUid());
		if (endTime != null) {
			long leftTime = 0L;
			leftTime = sdf.parse(endTime).getTime() - sdf.parse(sdf.format(now)).getTime();
			long m = (leftTime / (60 * 1000));
			long s = (leftTime / 1000 - m * 60);
			resultMap.put("result", m + "," + s);
		} else resultMap.put("result", "0");
		return resultMap;
	}

	//网上支付、继续支付
	@RequestMapping(value = "/payOrder")
	public Map<String, Object> payOrder(String otstatus, HttpSession session) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		//获取未完成订单信息
		Order order = ticketService.continueOrder(user.getUid(), "0");
		String uname = user.getUname();
		String otstartday = order.getOtstartday();
		String tid = order.getTid();
		String otorigin = order.getOtorigin();
		String otmidstation = order.getOtmidstation();
		String otdestination = order.getOtdestination();
		String otstarttime = order.getOtstarttime();
		List<OrderDetail> list = order.getList();
		String[] lname = new String[list.size()];
		String[] ctype = new String[list.size()];
		String[] cid = new String[list.size()];
		String[] sid = new String[list.size()];
		double[] price = new double[list.size()];
		double totalPrice = 0;
		for (int i = 0; i < list.size(); i++) {
			lname[i] = list.get(i).getLname();
			ctype[i] = list.get(i).getCtype();
			cid[i] = list.get(i).getCid();
			sid[i] = list.get(i).getSid();
			price[i] = list.get(i).getOdprice();
			totalPrice += list.get(i).getOdprice();
		}
		//支付成功 =》通过邮箱发送order主要消息
		if (ticketService.payOrder(otstatus, user.getUid())) {
			resultMap.put("result", "1");
			StringBuilder content = new StringBuilder();
			if (order.getOtmidstation() == null) {
				//直达信息
				content = new StringBuilder("您好，" + uname + "先生！您已购 " + otstartday + " " + tid + " " + otorigin + " 至 " + otdestination +
						" " + otstarttime + "开\n");
				for (int i = 0; i < list.size(); i++) {
					content.append(ctype[i]).append(" ").append(cid[i]).append("车").append(sid[i]).append("号 ").append("票价:").append(price[i]).append("元 ").append("乘客:").append(lname[i]).append("\n");
				}
				content.append("票价总计：").append(totalPrice).append("元");
			} else {
				//中转信息
				String tid1 = tid.split(",")[0];
				String tid2 = tid.split(",")[1];
				content = new StringBuilder("您好，" + uname + "先生！您已购 " + otstartday + " " + tid1 + "接续换乘" + tid2 + " " + otorigin + " 至 " + otdestination + " 中转于 " + otmidstation +
						" " + otstarttime + "开\n");
				for (int i = 0; i < list.size(); i++) {
					if (list.size() == 2 && i % 2 == 0) content.append("乘客").append("：").append(lname[i]).append("\n");
					else if (i % 2 == 0)
						content.append("乘客 ").append(i / 2 + 1).append("：").append(lname[i]).append("\n");
					content.append(ctype[i]).append(" ").append(cid[i]).append("车").append(sid[i]).append("号 ").append("票价：").append(price[i]).append("元 ").append("\n");
				}
				content.append("票价总计：").append(totalPrice).append("元");
			}
			Email e = new Email();
			e.setEemail(user.getUemail());
			e.setEtitle("火车网出票成功提醒");
			e.setEcontent(content.toString());
			e.setEtime(new Date());
			ticketService.sendAndSaveEmail(e,user.getUemail(), "火车网出票成功提醒", content.toString());
		} else resultMap.put("result", "0");
		return resultMap;
	}

	//网上支付（改签）——判断改签数量（是否删除orderTable对应信息）
	@RequestMapping(value = "/queryOrderDetailCount")
	public Map<String, Object> queryOrderDetailList(String otid) {
		Map<String, Object> resultMap = new HashMap<>();
		List<OrderDetail> list = ticketService.queryOrderDetailList(otid);
		resultMap.put("orderDetailCount", list.size());
		return resultMap;
	}

	//网上支付（改签部分）——执行任务1
	@RequestMapping(value = "/modifyOrder1")
	public Map<String, Object> modifyOrder1(String otid, String[] lnames, String otstatus, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		if (ticketService.modifyOrder1(otid, lnames, otstatus, user.getUid())) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//网上支付（改签全部）——执行任务2
	@RequestMapping(value = "/modifyOrder2")
	public Map<String, Object> modifyOrder2(String otid, String[] lnames, String otstatus, HttpSession session) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = (User) session.getAttribute("user");
		if (ticketService.modifyOrder2(otid, lnames, otstatus, user.getUid())) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//退票部分——执行任务1
	@RequestMapping(value = "/quitOrder1")
	public Map<String, Object> quitOrder1(String otid, String[] lnames) {
		Map<String, Object> resultMap = new HashMap<>();
		if (ticketService.quitOrder1(otid, lnames)) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}

	//退票全部——执行任务2
	@RequestMapping(value = "/quitOrder2")
	public Map<String, Object> quitOrder2(String otid, String[] lnames) {
		Map<String, Object> resultMap = new HashMap<>();
		if (ticketService.quitOrder2(otid, lnames)) resultMap.put("result", "1");
		else resultMap.put("result", "0");
		return resultMap;
	}
}
