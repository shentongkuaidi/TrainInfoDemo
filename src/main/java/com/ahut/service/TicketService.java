package com.ahut.service;

import com.ahut.dto.Order;
import com.ahut.model.Email;
import com.ahut.model.OrderDetail;
import com.ahut.model.OrderTable;
import com.ahut.model.TemporaryOrder;

import java.util.Date;
import java.util.List;

public interface TicketService {

	Boolean saveOrder(TemporaryOrder temporaryOrder, OrderTable orderTable, List<OrderDetail> list);

	List<Order> queryOrder(String uid, String status, String method, String tidOrName1,
						   String tidOrName2, Date startDay1, Date endDay1,
						   Date startDay2, Date endDay2, String future, String history);

	Order continueOrder(String uid, String otstatus);

	Order queryModifyOrder(String otid);

	List<TemporaryOrder> queryTemporaryOrder();

	void deleteAndUpdate(String id, String uid, String otid, String otstatus);

	int cancelOrderCount(String uid);

	Boolean cancelOrder(String uid);

	String queryTemporaryOrderEndTime(String uid);

	List<OrderDetail> queryOrderDetailList(String otid);

	Boolean payOrder(String otstatus, String uid);

	Boolean modifyOrder1(String otid, String[] lnames, String otstatus, String uid);

	Boolean modifyOrder2(String otid, String[] lnames, String otstatus, String uid);

	Boolean quitOrder1(String otid, String[] lnames);

	Boolean quitOrder2(String otid, String[] lnames);

	void sendAndSaveEmail(Email e, String email, String title, String content);

}
