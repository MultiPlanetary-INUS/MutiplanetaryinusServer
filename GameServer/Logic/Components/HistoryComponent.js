const {Component, ComponentType} = require('../../../Common/Component');
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance();
const { QueryBase } = require('../../../Common/DataBase/MySQL/QueryBase.js');
require('../../../Common/Util/Util.js');
var sd = require('silly-datetime');

class History
{
    constructor()
    {
        this.ID = 0;
        this.DoneTime = null;
        this.DayTimes = 0;
        this.WeekTimes = 0;
        this.MonthTimes = 0;
        this.YearTimes = 0;
        this.CountTimes = 0;
    }
}

HistoryComponent = Component.extend({
    ctor:function()
    {
        this._super();
        this.nTypeID = ComponentType.ECT_PLAYER_HISTORY;
        this.QuestHistory={};
        this.DuplicateHistory={};
    }
})

HistoryComponent.prototype.ReStore = function()
{
    var THIS = this;
    var q = new QueryBase();
    q.SQLString = "Select * From questhistory Where RoleID="+this.GetOwner().RoleID;
    q.Execute(function(result)
    {
        if(Verify(result) && result.length > 0)
        {
            for(var i= 0; i < result.length; ++i)
            {
                var ql = new History();
                ql.ID = result[i].QuestID;
                ql.DoneTime = new Date(result[i].DoneTime);
                ql.DayTimes = result[i].DayTimes;
                ql.WeekTimes = result[i].WeekTimes;
                ql.MonthTimes = result[i].MonthTimes;
                ql.YearTimes = result[i].YearTimes;
                ql.CountTimes = result[i].CountTimes;

                THIS.QuestHistory[ql.ID] = ql;
            }
        }
    })

    q.SQLString = "Select * From duplicatehistory Where RoleID="+this.GetOwner().RoleID;
    q.Execute(function(result)
    {
        if(Verify(result) && result.length > 0)
        {
            for(var i= 0; i < result.length; ++i)
            {
                var ql = new History();
                ql.ID = result[i].DuplicateID;
                ql.DoneTime = new Date(result[i].DoneTime);
                ql.DayTimes = result[i].DayTimes;
                ql.WeekTimes = result[i].WeekTimes;
                ql.MonthTimes = result[i].MonthTimes;
                ql.YearTimes = result[i].YearTimes;
                ql.CountTimes = result[i].CountTimes;

                THIS.DuplicateHistory[ql.ID] = ql;
            }
        }
    })
}

HistoryComponent.prototype.GetQuestHistory = function(qid)
{
    return this.QuestHistory[qid];
}

HistoryComponent.prototype.GetDuplicateHistory = function(did)
{
    return this.DuplicateHistory[did];
}

HistoryComponent.prototype.AddQuestHistory = function(qid)
{
    if(!Verify(this.QuestHistory[qid]))
    {
        var ql = new History()
        ql.ID = qid;
        ql.DoneTime = new Date();
        ql.DayTimes = 1;
        ql.WeekTimes = 1;
        ql.MonthTimes = 1;
        ql.YearTimes = 1;
        ql.CountTimes = 1;
        this.QuestHistory[qid] = ql;

        q.SQLString = "Insert questhistory Set RoleID="+this.GetOwner().RoleID + ", QuestID=" + qid +
                      ", DayTimes=1, WeekTimes=1, MonthTimes=1, YearTimes=1, CountTimes=1, DoneTime=\'"+sd.format(ql.DoneTime, "YYYY-MM-DD HH:mm:ss")+"\'";

        q.Execute(function(result){})
    }
    else
    {
        var ql = this.QuestHistory[qid];
        var now = new Date();
        
        ql.CountTimes += 1;

        if(now.getFullYear() != ql.DoneTime.getFullYear())
        {
            ql.YearTimes = 1;
            ql.DayTimes = 1;
            ql.MonthTimes = 1;
        }
        else
        {
            ql.YearTimes += 1;

            if(now.getMonth() != ql.DoneTime.getMonth())
            {
                ql.DayTimes = 1;
                ql.MonthTimes = 1;
            }
            else
            {
                ql.MonthTimes += 1;

                if(now.getDate() != ql.DoneTime.getDate())
                {
                    ql.DayTimes = 1;
                }
                else
                {
                    ql.DayTimes += 1;
                    ql.WeekTimes += 1;
                }
            }
        }

        if(IsSameWeek(ql.DoneTime, now))
        {
            ql.WeekTimes += 1;
        }
        else
        {
            ql.WeekTimes = 1;
        }
        
        ql.DoneTime = now;
        q.SQLString = "Update questhistory Set DoneTime=\'"+sd.format(ql.DoneTime, "YYYY-MM-DD HH:mm:ss")+"\', DayTimes="+ql.DayTimes+
                      ", WeekTimes="+ql.WeekTimes+", MonthTimes="+ql.MonthTimes+", YearTimes="+ql.YearTimes+", CountTimes="+ql.CountTimes+
                      " Where RoleID="+this.GetOwner().RoleID + " And QuestID=" + qid;
        
        q.Execute(function(result){})
    }
}

HistoryComponent.prototype.AddDuplicateHistory = function(qid)
{
    if(!Verify(this.DuplicateHistory[qid]))
    {
        var ql = new History()
        ql.ID = qid;
        ql.DoneTime = new Date();
        ql.DayTimes = 1;
        ql.WeekTimes = 1;
        ql.MonthTimes = 1;
        ql.YearTimes = 1;
        ql.CountTimes = 1;
        this.DuplicateHistory[qid] = ql;

        q.SQLString = "Insert duplicatehistory Set RoleID="+this.GetOwner().RoleID + ", DuplicateID=" + qid +
                      ", DayTimes=1, WeekTimes=1, MonthTimes=1, YearTimes=1, CountTimes=1, DoneTime=\'"+sd.format(ql.DoneTime, "YYYY-MM-DD HH:mm:ss")+"\'";

        q.Execute(function(result){})
    }
    else
    {
        var ql = this.DuplicateHistory[qid];
        var now = new Date();
        
        ql.CountTimes += 1;

        if(now.getFullYear() != ql.DoneTime.getFullYear())
        {
            ql.YearTimes = 1;
            ql.DayTimes = 1;
            ql.MonthTimes = 1;
        }
        else
        {
            ql.YearTimes += 1;

            if(now.getMonth() != ql.DoneTime.getMonth())
            {
                ql.DayTimes = 1;
                ql.MonthTimes = 1;
            }
            else
            {
                ql.MonthTimes += 1;

                if(now.getDate() != ql.DoneTime.getDate())
                {
                    ql.DayTimes = 1;
                }
                else
                {
                    ql.DayTimes += 1;
                    ql.WeekTimes += 1;
                }
            }
        }

        if(IsSameWeek(ql.DoneTime, now))
        {
            ql.WeekTimes += 1;
        }
        else
        {
            ql.WeekTimes = 1;
        }
        
        ql.DoneTime = now;
        q.SQLString = "Update duplicatehistory Set DoneTime=\'"+sd.format(ql.DoneTime, "YYYY-MM-DD HH:mm:ss")+"\', DayTimes="+ql.DayTimes+
                      ", WeekTimes="+ql.WeekTimes+", MonthTimes="+ql.MonthTimes+", YearTimes="+ql.YearTimes+", CountTimes="+ql.CountTimes+
                      " Where RoleID="+this.GetOwner().RoleID + " And DuplicateID=" + qid;
        
        q.Execute(function(result){})
    }
}

exports.HistoryComponent = HistoryComponent