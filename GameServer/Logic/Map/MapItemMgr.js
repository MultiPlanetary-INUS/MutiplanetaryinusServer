const { Vector3, Quaternion } = require('math3d');
const {Component, ComponentType} = require('../../../Common/Component');
const { ItemType, BandTypes,NPCBornType } = require('../../Gen/Types');
const { Item } = require('../Item/Item.js');
var DataCenter = require('../../Gen/DataCenter.js').GetInstance();
var IDGenerator = require("../../../Common/IDGenerator.js").GetInstance();
require('../../../Common/Util/Util.js');
require('../../../Common/CommonDefine.js');

MapItemMgr = Component.extend({
    ctor:function()
    {
        this._super();
        this.nTypeID = ComponentType.ECT_MAP_ITEM_MGR;
        this.RateList=[];
        this.ItemMap = {};
    }
})

MapItemMgr.prototype.RefershItem = function(ms)
{
    for(var i=0; i<this.RateList.length; ++i)
    {
        var rate = this.RateList[i].config;
        var elist = this.RateList[i].EntityList;

        this.RateList[i].Time += ms / 1000.0;

        if(this.RateList[i].Time > rate.BornTime && elist.length < rate.Count)
        {
            this.RateList[i].Time -= rate.BornTime;
            
            var borns = rate.OnceBone;
            if(rate.BornType == NPCBornType.Once)
            {   
                this.RateList[i].Time = -9999999999999.99;
                borns = rate.Count;
            }
            else if(rate.BornType == NPCBornType.SetTime)
            {
                if(rate.Count - elist.length < rate.OnceBone && rate.Count - elist.length >= 0)
                    borns = rate.Count - elist.length;
            }
            
            for(var i=0; i < borns; ++i)
            {
                this.CreateAItemByRate(rate, elist, -1);
            }
            
        }
        
    }
}


MapItemMgr.prototype.OnRemove = function(id, obj)
{
    var nd = new proto.GamePKG.ItemDesOnMap();
    nd.setPkgid(proto.PKGTypeID.PKG_ITEM_DESTORY_ON_MAP);
    nd.setItemid(id);
    nd.setTypeid(obj.getTypeid());
    nd.setMapid(this.GetOwner().MapID);
    this.GetOwner().NotifyAllPlayer(nd);
}

MapItemMgr.prototype.Remove = function(id)
{
	var obj = this.ItemMap[id];
	if(Verify(obj)){
        for(var i=0; i<this.RateList.length; ++i)
        {
            var rate = this.RateList[i].config;
            var elist = this.RateList[i].EntityList;

            if(obj.getTypeid() == rate.ItemID)
            {
                for(var n=0; n < elist.length; ++n)
                {
                    if(elist[n].getItemid() == id)
                    {
                        elist.splice(n, 1);
                        break;
                    }
                }
            }
        }

		this.OnRemove(id, obj);
		if(Verify(obj.Release)){
			obj.Release();
		}
		delete this.ItemMap[id];
	}
};

MapItemMgr.prototype.GetItemInfo = function(id)
{
    return this.ItemMap[id];
}

MapItemMgr.prototype.CreateAItem = function(typeid, pos, ownerid = 0, radio = 5, count = 1, life = MAX_TIME_FOR_ITEM_ON_MAP, rotespeed = 30)
{
    var it = new proto.GamePKG.ItemOnMap();
    it.setPkgid(proto.PKGTypeID.PKG_ITEM_ON_MAP);
    it.setItemid(IDGenerator.GetNewID());
    it.setTypeid(typeid);
    it.setMapid(this.GetOwner().MapID);
    it.setRoleid(ownerid);
    var randPos = new Vector3(GetRandom(-1.0, 1.0), 0, GetRandom(-1.0, 1.0)).normalize();
    var Pos = pos.add(randPos.mulScalar(GetRandom(0,radio)));
    it.setPosx(Pos.x);
    it.setPosy(Pos.y);
    it.setPosz(Pos.z);
    it.setCount(count);
    it.setLifetime(life * 1000);
    var dir = GetRandom(-180, 180);
    it.setDirection(dir);
    it.setRotespeed(rotespeed);
    this.GetOwner().NotifyAllPlayer(it);
    this.ItemMap[it.getItemid()] = it;
}


MapItemMgr.prototype.CreateAItemByRate = function(rate, lis, LifeTime=MAX_TIME_FOR_ITEM_ON_MAP, Ownerid=0)
{
    var it = new proto.GamePKG.ItemOnMap();
    it.setPkgid(proto.PKGTypeID.PKG_ITEM_ON_MAP);
    it.setItemid(IDGenerator.GetNewID());
    it.setTypeid(rate.ItemID);
    it.setMapid(this.GetOwner().MapID);
    it.setRoleid(Ownerid);

    var randPos = new Vector3(GetRandom(-1.0, 1.0), 0, GetRandom(-1.0, 1.0)).normalize();
    var Pos = new Vector3(rate.BornPosition.x, rate.BornPosition.y, rate.BornPosition.z);
    Pos = Pos.add(randPos.mulScalar(GetRandom(0,rate.OffestRadio)));
    
    it.setPosx(Pos.x);
    it.setPosy(Pos.y);
    it.setPosz(Pos.z);
    it.setCount(1);
    it.setLifetime(LifeTime*1000);
    
    var dir  = rate.Direction
    if(rate.Count > 1)
        dir = GetRandom(-180, 180);

    it.setDirection(dir);
    it.setRotespeed(rate.RotateSpeed);
        
    this.GetOwner().NotifyAllPlayer(it);

    this.ItemMap[it.getItemid()] = it;
    lis.push(it);
}

MapItemMgr.prototype.OnAttach = function()
{
    var map = this.GetOwner();
    if(Verify(map))
    {
        var ItemRates = DataCenter.GetItemRateByMap(map.MapID)
        for(var i=0; i < ItemRates.length; ++i)
        {
            var rate={};
            rate.config = ItemRates[i];
            rate.EntityList=[];
            rate.Time = 0;
            this.RateList.push(rate);
        }
    }
}

MapItemMgr.prototype.OnDetach = function()
{
    for(var id in this.ItemMap)
	{
		this.Remove(id);
	}
	
	this.ItemMap = {};
}

MapItemMgr.prototype.OnUpdate = function(ms)
{
    this.RefershItem(ms);

    for(var id in this.ItemMap)
	{
        var t = this.ItemMap[id].getLifetime();

        if(t >= 0)
        {
            this.ItemMap[id].setLifetime(t - ms);
            if(this.ItemMap[id].getLifetime() <= 0)
            {
                this.Remove(id);
            }
        }
    }
}

MapItemMgr.prototype.SendAllItem = function(player)
{
    if(Verify(player))
    {
        for(var id in this.ItemMap)
        {
            var pkg = this.ItemMap[id];
            player.SendPkg(pkg);
        }
    }
}


exports.MapItemMgr = MapItemMgr;