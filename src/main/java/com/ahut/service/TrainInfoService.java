package com.ahut.service;

import com.ahut.dto.TicketInfo;
import com.ahut.dto.TrainInfo;
import com.ahut.dto.TurnInfo;

import java.util.List;

public interface TrainInfoService {

	List<TrainInfo> queryTrainInfo(String origin, String destination, String sday,
								   String tid1,String tid2,String tid3,String tid4,String tid5,String tid);
	List<TrainInfo> queryTrainInfoNotToday(String origin, String destination, String sday,
								   String tid1,String tid2,String tid3,String tid4,String tid5,String tid);
	List<TicketInfo> queryTicketInfo(String sday, String tid, String origin, String destination);

	List<TurnInfo> queryTurnInfo1(String origin, String destination);

	int queryTurnInfo2(String firstTid, String origin, int midSid, String lastTid, String destination);

	String getStationName(int sid);
	int getStationId(String sname);
}
