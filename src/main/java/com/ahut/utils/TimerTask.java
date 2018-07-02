package com.ahut.utils;

import com.ahut.model.TemporaryOrder;
import com.ahut.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class TimerTask {

	@Autowired
	private TicketService ticketService;

	//删除t_temporaryOrder表中超时订单，并修改orderTable表中对应前表id的otid的otstatus状态为2（已取消）
	public void deleteAndUpdate()
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		System.out.println(sdf.format(new Date())+"：定时器执行");
		List<TemporaryOrder> list = ticketService.queryTemporaryOrder();
		if(list.size()>0){
			for (TemporaryOrder temporaryOrder : list) {
				ticketService.deleteAndUpdate(temporaryOrder.getId(),null, temporaryOrder.getId(), "2");
			}
			System.out.println("待付款订单失效,解除占用成功!");
		}else{
			System.out.println("当前无超时待付款订单!");
		}
	}
}