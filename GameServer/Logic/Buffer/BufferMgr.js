const { Component, ComponentType } = require("../../../Common/Component");
const { QueryBase } = require("../../../Common/DataBase/MySQL/QueryBase");
var BufferFactory = require('./BufferFactory').GetInstance();

BufferMgr = Component.extend({
    ctor:function()
    {
        this._super();
        this.nTypeID = ComponentType.ECT_BUFFER_MANAGER;
        this.BufferList = [];
    }
})

BufferMgr.prototype.AddBuffer = function(b, store)
{
    if(Verify(b))
    {
        b.SetOwner(this.GetOwner());
        this.BufferList.push(b);

        if(store)
        {
            var q1 = new QueryBase();
            q1.SQLString = "Call UpdateBuff("+player.RoleID +", "+b.Type+", "+b.Param1+", "+b.Param2+", "+b.LifeTime+")";
            q1.Execute(function(result){});
        }
    }
}

BufferMgr.prototype.RemoveBuffer = function(b)
{
    if(Verify(b))
    {
        for(var i= 0; i < this.BufferList.length; ++i)
        {
            if(this.BufferList[i] == b)
            {
                this.OnRemoveBuffer(b);
                b.SetOwner(null);
                this.BufferList.splice(i, 1);
                break;
            }
        }
    }
}

BufferMgr.prototype.OnRemoveBuffer = function(b)
{
    var player = this.GetOwner();
    if(Verify(player) && Verify(b))
    {
        var q = new QueryBase();
        q.SQLString = "Delete From buff Where RoleID="+player.RoleID + " And BuffType="+b.Type;
        q.Execute(function(result){});
    }
}

BufferMgr.prototype.RemoveBufferAtPos = function(i)
{
    var b = this.BufferList[i];
    if(Verify(b))
    {
        this.OnRemoveBuffer(b);
        b.SetOwner(null);
        this.BufferList.splice(i, 1);
    }
}

BufferMgr.prototype.OnUpdate = function(ms)
{
    var del = [];
    for(var i=0; i < this.BufferList.length; ++i)
    {
        this.BufferList[i].OnUpdate(ms);
        if(this.BufferList[i].LifeTime != -1.0)
        {
            this.BufferList[i].LifeTime -= ms / 1000.0
            if(this.AddBuffer[i].LifeTime <= 0)
                del.push(i)
        }
    }

    for(var i=0; i < del.length; ++i)
    {
        this.RemoveBufferAtPos(del[i])
    }
    
    del=[];
}


BufferMgr.prototype.ReStore = function()
{
    var player = this.GetOwner();
    if(Verify(player))
    {
        var THIS = this;
        var q = new QueryBase();
        q.SQLString = "Select * From buff Where RoleID="+player.RoleID;
        q.Execute(function(result)
        {
            if(Verify(result) && result.length > 0)
            {
                for(var n=0; n < result.length; ++n)
                {
                    var buff = BufferFactory.Create(result[n].BuffType)
                    if(Verify(buff))
                    {
                        buff.LifeTime = result[n].Life;
                        buff.Param1 = result[n].Param1;
                        buff.Param2 = result[n].Param2;   
                        THIS.AddBuffer(buff);
                    }
                }
            }
        })
    }
}

exports.BufferMgr = BufferMgr