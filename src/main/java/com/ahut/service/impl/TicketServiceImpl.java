package com.ahut.service.impl;

import com.ahut.dao.EmailDao;
import com.ahut.dao.TicketDao;
import com.ahut.dto.Order;
import com.ahut.model.Email;
import com.ahut.model.OrderDetail;
import com.ahut.model.OrderTable;
import com.ahut.model.TemporaryOrder;
import com.ahut.service.TicketService;
import com.ahut.utils.JavaEmailSenderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service("ticketService")
public class TicketServiceImpl implements TicketService {

	@Autowired
	private TicketDao ticketDao;

	@Autowired
	private EmailDao emailDao;

	@Transactional
	@Override
	public Boolean saveOrder(TemporaryOrder temporaryOrder, OrderTable orderTable, List<OrderDetail> list) {
		return ticketDao.saveTemporaryOrder(temporaryOrder)
				&& ticketDao.saveOrderTable(orderTable)
				&& ticketDao.saveOrderDetail(list);
	}

	@Override
	public List<Order> queryOrder(String uid, String status, String method, String tidOrName1,
								  String tidOrName2, Date startDay1, Date endDay1,
								  Date startDay2, Date endDay2, String future, String history) {

		return ticketDao.queryOrder(uid, status, method, tidOrName1, tidOrName2,
				startDay1, endDay1, startDay2, endDay2, future, history);
	}

	@Override
	public Order continueOrder(String uid, String otstatus) {
		return ticketDao.continueOrder(uid, otstatus);
	}

	@Override
	public Order queryModifyOrder(String otid) {
		return ticketDao.queryModifyOrder(otid);
	}

	@Override
	public List<TemporaryOrder> queryTemporaryOrder() {
		return ticketDao.queryTemporaryOrder();
	}

	@Transactional
	@Override
	public void deleteAndUpdate(String id, String uid, String otid, String otstatus) {
		ticketDao.deleteTemporaryOrder(id, uid);
		ticketDao.updateOrderStatus(otid, otstatus);
	}

	@Override
	public int cancelOrderCount(String uid) {
		return ticketDao.cancelOrderCount(uid);
	}

	@Transactional
	@Override
	public Boolean cancelOrder(String uid) {
		return ticketDao.cancelOrder(uid)
				&& ticketDao.deleteTemporaryOrder(null, uid);
	}

	@Override
	public String queryTemporaryOrderEndTime(String uid) {
		return ticketDao.queryTemporaryOrderEndTime(uid);
	}

	@Override
	public List<OrderDetail> queryOrderDetailList(String otid) {
		return ticketDao.queryOrderDetailList(otid);
	}

	@Transactional
	@Override
	public Boolean payOrder(String otstatus, String uid){
		return ticketDao.deleteTemporaryOrder(null,uid)
				&& ticketDao.payOrder(otstatus,uid);
	}

	@Transactional
	@Override
	public Boolean modifyOrder1(String otid, String[] lnames, String otstatus, String uid) {
		return ticketDao.deleteOrderDetail(otid, lnames)
				&& ticketDao.updateOrderTable(otid)
				&& ticketDao.deleteTemporaryOrder(null, uid)
				&& ticketDao.payOrder(otstatus, uid);
	}

	@Transactional
	@Override
	public Boolean modifyOrder2(String otid, String[] lnames, String otstatus, String uid) {
		return ticketDao.deleteOrderDetail(otid, lnames)
				&& ticketDao.deleteOrderTable(otid)
				&& ticketDao.deleteTemporaryOrder(null, uid)
				&& ticketDao.payOrder(otstatus, uid);
	}

	@Transactional
	@Override
	public Boolean quitOrder1(String otid, String[] lnames) {
		return ticketDao.deleteOrderDetail(otid, lnames)
				&& ticketDao.updateOrderTable(otid);
	}

	@Transactional
	@Override
	public Boolean quitOrder2(String otid, String[] lnames) {
		return ticketDao.deleteOrderDetail(otid,lnames)
				&& ticketDao.deleteOrderTable(otid);
	}

	@Transactional
	@Override
	public void sendAndSaveEmail(Email e, String email, String title, String content){
		emailDao.save(e);
		try {
			JavaEmailSenderUtil.sendEmail(email, title, content);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	}
}
