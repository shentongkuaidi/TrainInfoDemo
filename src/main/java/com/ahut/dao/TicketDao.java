package com.ahut.dao;

import com.ahut.dto.Order;
import com.ahut.model.OrderDetail;
import com.ahut.model.OrderTable;
import com.ahut.model.TemporaryOrder;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface TicketDao {
	//形成订单
	Boolean saveTemporaryOrder(TemporaryOrder temporaryOrder);
	Boolean saveOrderTable(OrderTable orderTable);
	Boolean saveOrderDetail(List<OrderDetail> list);
	//已完成订单
	List<Order> queryOrder(@Param(value = "uid") String uid,
						   @Param(value = "status") String status,
						   @Param(value = "method") String method,
						   @Param(value = "tidOrName1") String tidOrName1,
						   @Param(value = "tidOrName2") String tidOrName2,
						   @Param(value = "startDay1") Date startDay1,
						   @Param(value = "endDay1") Date endDay1,
						   @Param(value = "startDay2") Date startDay2,
						   @Param(value = "endDay2") Date endDay2,
						   @Param(value = "future") String future,
						   @Param(value = "history") String history);
	//未完成订单
	Order continueOrder(@Param(value = "uid") String uid, @Param(value = "otstatus") String otstatus);
	//需要改签的订单
	Order queryModifyOrder(String otid);
	//支付超时订单处理
	List<TemporaryOrder> queryTemporaryOrder();
	Boolean deleteTemporaryOrder(@Param(value = "id") String id, @Param(value = "uid") String uid);
	void updateOrderStatus(@Param(value = "otid") String otid, @Param(value = "otstatus") String otstatus);
	//检测当日用户取消订票次数
	int cancelOrderCount(String uid);
    //用户主动取消订单
	Boolean cancelOrder(String uid);
	//订单支付有效剩余时间
	String queryTemporaryOrderEndTime(String uid);

	//判断订单详情数(改签)
	List<OrderDetail> queryOrderDetailList(String otid);
	//删除改签、退票乘客对应的orderDetail
	Boolean deleteOrderDetail(@Param(value = "otid") String otid, @Param(value = "lnames") String[] lnames);
	//更新orderTable
	Boolean updateOrderTable(String otid);
	//删除orderTable
	Boolean deleteOrderTable(String otid);
	//更新状态0—>1、3
	Boolean payOrder(@Param(value = "otstatus") String otstatus, @Param(value = "uid") String uid);
}
