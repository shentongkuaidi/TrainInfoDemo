package com.ahut.service.impl;

import com.ahut.dao.TrainInfoDao;
import com.ahut.dto.TicketInfo;
import com.ahut.dto.TrainInfo;
import com.ahut.dto.TurnInfo;
import com.ahut.service.TrainInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("trainInfoService")
public class TrainInfoServiceImpl implements TrainInfoService {

	@Autowired
	private TrainInfoDao trainInfoDao;

	@Override
	public List<TrainInfo> queryTrainInfo(String origin, String destination, String sday,
										  String tid1, String tid2, String tid3, String tid4, String tid5, String tid) {
		return trainInfoDao.queryTrainInfo(origin, destination, sday, tid1, tid2, tid3, tid4, tid5, tid);
	}

	@Override
	public List<TrainInfo> queryTrainInfoNotToday(String origin, String destination, String sday,
												  String tid1, String tid2, String tid3, String tid4, String tid5, String tid) {
		return trainInfoDao.queryTrainInfoNotToday(origin, destination, sday, tid1, tid2, tid3, tid4, tid5, tid);
	}

	@Override
	public List<TicketInfo> queryTicketInfo(String sday, String tid, String origin, String destination) {
		return trainInfoDao.queryTicketInfo(sday, tid, origin, destination);
	}

	@Override
	public List<TurnInfo> queryTurnInfo1(String origin, String destination) {
		return trainInfoDao.queryTurnInfo1(origin, destination);
	}

	@Override
	public int queryTurnInfo2(String firstTid, String origin, int midSid, String lastTid, String destination) {
		return trainInfoDao.queryTurnInfo2(firstTid, origin, midSid, lastTid, destination);
	}

	@Override
	public String getStationName(int sid) {
		return trainInfoDao.getStationName(sid);
	}

	@Override
	public int getStationId(String sname) {
		return trainInfoDao.getStationId(sname);
	}
}

