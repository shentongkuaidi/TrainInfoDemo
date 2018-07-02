package com.ahut.dao;

import com.ahut.dto.TicketInfo;
import com.ahut.dto.TrainInfo;
import com.ahut.dto.TurnInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TrainInfoDao {

	List<TrainInfo> queryTrainInfo(@Param(value = "origin") String origin,
								   @Param(value = "destination") String destination,
								   @Param(value = "sday") String sday,
								   //车次类型
								   @Param(value = "tid1") String tid1,
								   @Param(value = "tid2") String tid2,
								   @Param(value = "tid3") String tid3,
								   @Param(value = "tid4") String tid4,
								   @Param(value = "tid5") String tid5,
								   @Param(value = "tid") String tid);

	List<TrainInfo> queryTrainInfoNotToday(@Param(value = "origin") String origin,
								   @Param(value = "destination") String destination,
								   @Param(value = "sday") String sday,
								   //车次类型
								   @Param(value = "tid1") String tid1,
								   @Param(value = "tid2") String tid2,
								   @Param(value = "tid3") String tid3,
								   @Param(value = "tid4") String tid4,
								   @Param(value = "tid5") String tid5,
								   @Param(value = "tid") String tid);

	List<TicketInfo> queryTicketInfo(@Param(value = "sday") String sday,
								 @Param(value = "tid") String tid,
								 @Param(value = "origin") String origin,
								 @Param(value = "destination") String destination
								 );

	List<TurnInfo> queryTurnInfo1(@Param(value = "origin") String origin,
								 @Param(value = "destination") String destination
								 );

	int queryTurnInfo2(@Param(value = "firstTid") String firstTid,
			           @Param(value = "origin") String origin,
					   @Param(value = "midSid") int midSid,
					   @Param(value = "lastTid") String lastTid,
					   @Param(value = "destination") String destination
	);

	String getStationName(int sid);

	int getStationId(String sname);
}
