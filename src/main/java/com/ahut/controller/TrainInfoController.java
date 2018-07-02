package com.ahut.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ahut.dto.TicketInfo;
import com.ahut.dto.TrainInfo;
import com.ahut.dto.TurnInfo;
import com.ahut.service.TrainInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class TrainInfoController {

	@Autowired
	private TrainInfoService trainInfoService;

	//车次信息
	@RequestMapping(value = "/trainInfo")
	public Map<String, Object> queryTrainInfo(String origin, String destination, String sday,
											  String tid1, String tid2, String tid3, String tid4, String tid5, String tid) {
		Map<String, Object> resultMap = new HashMap<>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String date = sdf.format(new Date());
		List<TrainInfo> list;
		if (sday.equals(date))
			list = trainInfoService.queryTrainInfo(origin, destination, sday, tid1, tid2, tid3, tid4, tid5, tid);//当天
		else
			list = trainInfoService.queryTrainInfoNotToday(origin, destination, sday, tid1, tid2, tid3, tid4, tid5, tid);
		resultMap.put("trainInfoList", list);
		return resultMap;
	}

	//余票信息
	@RequestMapping(value = "/ticketInfo")
	public Map<String, Object> queryTicketInfo(String sday, String tid, String origin, String destination) {
		Map<String, Object> resultMap = new HashMap<>();
		List<TicketInfo> list = trainInfoService.queryTicketInfo(sday, tid, origin, destination);
		resultMap.put("ticketInfoList", list);
		return resultMap;
	}

	//中转查询
	@RequestMapping(value = "/queryTurnInfo")
	public Map<String, Object> queryTurnInfo(String origin, String destination, String sday, String midStationName) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String date = sdf.format(new Date());
		//1.中转获取有交集的车次列表信息（去除同时经过起点和终点的车次、相同车次）
		List<TurnInfo> list = trainInfoService.queryTurnInfo1(origin, destination);
		//2.中转获取满足交集点两趟车次时间差的车次列表信息,并查询最终车次信息列表结果
		int rowNum = 0, midSid = 0;
		//step1:获取两车次第一个交集站点
		if (!"null".equals(midStationName)) midSid = trainInfoService.getStationId(midStationName);
		for (TurnInfo l : list) {
			if ("null".equals(midStationName)) midSid = l.getMidSid();
			if (midSid == l.getMidSid() && trainInfoService.queryTurnInfo2(l.getFirstTid(), origin, midSid, l.getLastTid(), destination) == 1) {
				rowNum = l.getRowNum();
				break;
			}
		}
		//step2:获取查询结果
		List<TrainInfo> listAll = new ArrayList<>();
		List<TrainInfo> listInfo1, listInfo2;
		List<String> turnTimeList = new ArrayList<>();
		if (rowNum == 0) {
			resultMap.put("turnInfoList", listAll);
		} else {
			for (TurnInfo l : list) {
				if ("null".equals(midStationName)) midSid = l.getMidSid();
				if (l.getRowNum() == rowNum && trainInfoService.queryTurnInfo2(l.getFirstTid(), origin, midSid, l.getLastTid(), destination) == 1) {
					String midSname = trainInfoService.getStationName(midSid);
					if (sday.equals(date)) {
						listInfo1 = trainInfoService.queryTrainInfo(origin, midSname, sday, null, null, null, null, null, l.getFirstTid());//今天
						listInfo2 = trainInfoService.queryTrainInfo(midSname, destination, sday, null, null, null, null, null, l.getLastTid());
					} else {
						listInfo1 = trainInfoService.queryTrainInfoNotToday(origin, midSname, sday, null, null, null, null, null, l.getFirstTid());
						listInfo2 = trainInfoService.queryTrainInfoNotToday(midSname, destination, sday, null, null, null, null, null, l.getLastTid());
					}
					if (listInfo1.size() != 0 && listInfo2.size() != 0) {
						SimpleDateFormat sdF = new SimpleDateFormat("HH:mm:ss");
						long turnTime = 0L;
						turnTime = sdF.parse(listInfo2.get(0).getStartTime().toString()).getTime() - sdF.parse(listInfo1.get(0).getEndTime().toString()).getTime();
						long h = (turnTime / (60 * 60 * 1000));
						long m = (turnTime % (60 * 60 * 1000)) / (60 * 1000);
						turnTimeList.add(h + "h" + m + "m");
						listAll.addAll(listInfo1);
						listAll.addAll(listInfo2);
					}
				}
			}
			resultMap.put("result", turnTimeList);
			resultMap.put("turnInfoList", listAll);
		}
		return resultMap;
	}

}






//  解析json格式的list
//	Gson gson = new Gson();
//	List<TurnInfo> list = gson.fromJson(turnInfoList, new TypeToken<List<TurnInfo>>() {
//	}.getType());