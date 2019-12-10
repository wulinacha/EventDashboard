const Base = require('./base.js');
const moment = require('moment');

module.exports = class extends Base {

  /**
   * 获取事件列表
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async EventsAction() {
    const pageindex=this.get("pageindex");
    const aggregationId=this.get("aggregationId");
    const aggregationType=this.get("aggregationType");
    const TimeStamp=this.get("TimeStamp");
    const IsError=this.get("IsError");

    const starttime=moment.unix(this.get("startCurrentOn")).format("YYYY-MM-DD HH:mm");
    const endtime=moment.unix(this.get("endCurrentOn")).format("YYYY-MM-DD HH:mm");
    think.logger.info("时间格式"+starttime);
    think.logger.info("时间格式"+endtime);
    // const startCurrentOn=this.get("startCurrentOn");
    // const endCurrentOn=this.get("endCurrentOn");
   
    const nulltime="1970-01-01 08:00";

     var whereObj={};
    if((starttime!=nulltime)&&(endtime!=nulltime))
      whereObj["DomainEvent.CurrentOn"]=['between', starttime,endtime];

    if(starttime!=nulltime&&endtime==nulltime)
      whereObj["DomainEvent.CurrentOn"]=[">=",starttime];

    if(endtime!=nulltime&&starttime==nulltime)
      whereObj["DomainEvent.CurrentOn"]=["<=",endtime];

    if(aggregationId!=""&&aggregationId!=undefined)
      whereObj["DomainEvent.AggregationId"]=aggregationId;

    if(aggregationType!=""&&aggregationType!=undefined&&aggregationType!="全部")
      whereObj["DomainEvent.AggregationType"]=aggregationType;

    if(TimeStamp!=""&&TimeStamp!=undefined)
      whereObj["DomainEvent.TimeStamp"]=TimeStamp;

    whereObj["DomainEvent.Status"]=0;

    var events={};
    if(IsError!=""&&IsError!=undefined&&IsError!="全部"){
      whereObj["EventTracker.IsError"]=IsError;
      whereObj["EventTracker.Status"]=0;
      var eventCounts=await this.model('DomainEvent')
      .join('inner join EventTracker ON EventTracker.AggregationType=DomainEvent.AggregationType and EventTracker.AggregationId=DomainEvent.AggregationId and EventTracker.TimeStamp=DomainEvent.TimeStamp')
      .where(whereObj).distinct('DomainEvent.Id,DomainEvent.TenantId,DomainEvent.CurrentOn,DomainEvent.CreateTime,DomainEvent.TimeStamp,DomainEvent.Version,DomainEvent.Content,DomainEvent.AggregationType,DomainEvent.AggregationId,DomainEvent.TimeStamp')
      .select();

      events = await this.model('DomainEvent')
      .join('inner join EventTracker ON EventTracker.AggregationType=DomainEvent.AggregationType and EventTracker.AggregationId=DomainEvent.AggregationId and EventTracker.TimeStamp=DomainEvent.TimeStamp')
      .where(whereObj).distinct('DomainEvent.Id,DomainEvent.TenantId,DomainEvent.CurrentOn,DomainEvent.CreateTime,DomainEvent.TimeStamp,DomainEvent.Version,DomainEvent.Content,DomainEvent.AggregationType,DomainEvent.AggregationId,DomainEvent.TimeStamp')
      .order('DomainEvent.CurrentOn DESC').page(pageindex,10).countSelect(); 
      
      events.count=eventCounts.length;
      events.totalPages=eventCounts.length/10;
    }else{
      events = await this.model('DomainEvent')
      .where(whereObj)
      .order('DomainEvent.CurrentOn DESC').page(pageindex,10).countSelect(); 
    } 

    let eventPages={
      count:events.count,
      totalPages:events.totalPages,
      pageSize:events.pageSize,
      currentPage:events.currentPage,
      data:[]
    };
    
    for (let i = 0; i < events.data.length; i++) {
        var event=events.data[i];

        var tracker= await this.model('EventTracker').where({
        AggregationType:event.AggregationType,
        AggregationId:event.AggregationId,
        TimeStamp:event.TimeStamp,
        TrackType:1,Status:0})
        .order('CurrentOn DESC,IsError asc').limit(1).find();

        eventPages.data.push({
          Id:event.Id,
          TenantId:event.TenantId,
          AggregationType:event.AggregationType,
          AggregationId:event.AggregationId,
          TrackType:event.TrackType,
          Version:event.Version,
          Content:event.Content,
          CurrentOn:event.CurrentOn,
          TimeStamp:event.TimeStamp,
          Status:event.Status,
          CreateTime:event.CreateTime,
          IsError:tracker.IsError
        });
      };

    return this.success({
      events: eventPages
    });
  }

    /**
   * 根据事件ID获取跟踪详细信息列表
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async TrackerDetailsAction(){
    const eventid=this.get("id");

    var event=await this.model("DomainEvent").where({Id:eventid}).find();

    var trackers=await this.model("EventTracker")
    .where({AggregationId:event.AggregationId,
    AggregationType:event.AggregationType,TimeStamp:event.TimeStamp,Status:0})
    .select();

      var trackersResult={
        trackers:trackers,
        eventid:eventid
      };
  
      return this.success({
        trackers: trackersResult
      });
  }

  /**
   * 重新发送错误消息
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async ReSendAction(){
    think.logger.info("重发消息");
    const eventid=this.post("eventid");

    var event=await this.model("DomainEvent").where({Id:eventid}).find();
    
    let affectedRows = await this.model('EventTracker').where({AggregationType:event.AggregationType,AggregationId:event.AggregationId,CurrentOn:event.CurrentOn,TimeStamp:event.TimeStamp}).update({Status:1});
  
    return this.success("发送成功");
  }

  /**
   * 获取事件跟踪列表
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async EventTrackersAction() {
    const pageindex=this.get("pageindex");
    const aggregationId=this.get("aggregationId");
    const aggregationType=this.get("aggregationType");
    const startCurrentOn=this.get("startCurrentOn");
    const endCurrentOn=this.get("endCurrentOn");

    think.logger.info(aggregationId);

    var whereObj={};
    if(aggregationId!="")
      whereObj["AggregationId"]=aggregationId;

    if(aggregationType!="")
    whereObj["AggregationType"]=aggregationType;

    think.logger.info(whereObj);

    var events = await 
    this.model('EventTracker').where(whereObj)
    .order('CurrentOn DESC').group("AggregationId")
    .page(pageindex,10)
    .countSelect();  

    var groupCount=await this.model('EventTracker')
    .query("select count(1) as count from (SELECT COUNT(`Id`) AS count FROM `EventTracker` GROUP BY `AggregationId` ORDER BY CurrentOn) a;");

    think.logger.info(groupCount[0].count);
    events.count=groupCount[0].count;

    return this.success({
      events: events
    });
  }

  /**
  * 获取事件类型列表
  * @returns {Promise.<Promise|PreventPromise|void>}
  */
  async EventTypesAction() {
    var eventtypes = await 
    this.model('DomainEvent').group('AggregationType').select(); 

    eventtypes.unshift({
      AggregationType:"全部"
    });
    // think.logger.info(eventtypes);
    return this.success({
      eventtypes: eventtypes
    });
  }
};
