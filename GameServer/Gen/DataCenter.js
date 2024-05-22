
const Types = require('./Types.js');
var fs = require('fs');
require('../../Common/Util/Verify');
const { Class } = require('../../Common/Util/Class.js');
var ByteBuf = require('./ByteBuf.js').ByteBuf;


function loader(file)
{
    let data = fs.readFileSync('./GenerateDatas/'+file+".bytes");
    
    return new ByteBuf(data);
}

DataCenter = Class.extend({
    ctor:function()
    {
        this.tables = new Types.Tables(loader);
        //this.tables.MapSet.get(1000))
    }
})

DataCenter.prototype.GetBornMapByVocation=function(voc)
{
    var MapList = this.tables.MapSet.getDataList();
    var m= null;
    MapList.forEach(map => {
        if(map.Type == Types.MapType.Born)
        {
            m = map;
        }
    });

    return m;
}

DataCenter.prototype.GetMapList = function()
{
    return this.tables.MapSet.getDataList();
}

DataCenter.prototype.GetMapInfo = function(n)
{
    return this.tables.MapSet.get(n);
}

DataCenter.prototype.GetLevelInfo = function(n)
{
    return this.tables.LevelSet.get(n);
}

DataCenter.prototype.GetItemData = function(n)
{
    return this.tables.ItemDataSet.get(n);
}

DataCenter.prototype.GetItemSet = function(n)
{
    return this.tables.ItemSetData.get(n);
}

DataCenter.prototype.GetVocationSetting = function(v)
{
    return this.tables.VocationSettings.get(v);
}

DataCenter.prototype.GetNpcAttr = function(n)
{
    return this.tables.NpcSet.get(n);
}

DataCenter.prototype.GetNpcRateByMap = function(n)
{
    var rates = [];
    var npclist = this.tables.NpcRateSet.getDataList();
    for(var i=0; i< npclist.length; ++i)
    {
        if(npclist[i].MapID == n)
            rates.push(npclist[i])
    }
    return rates;
}


DataCenter.prototype.GetItemRateByMap = function (n) {
    var rates = [];
    var itemlist = this.tables.ItemRateSet.getDataList();
    for (var i = 0; i < itemlist.length; ++i) {
        if (itemlist[i].MapID == n)
            rates.push(itemlist[i])
    }
    return rates;
}

DataCenter.prototype.GetQuestData = function(n)
{
    return this.tables.QuestDataSet.get(n);
}

DataCenter.prototype.GetQuestList = function()
{
    return this.tables.QuestDataSet.getDataList();
}

DataCenter.prototype.GetItemExplosionRate = function(id)
{
    return this.tables.ExplosionRateSet.get(id);
}

DataCenter.prototype.GetSkillData = function(id)
{
    return this.tables.SkillTable.get(id);
}

DataCenter.prototype.GetSkillDataList = function()
{
    return this.tables.SkillTable.getDataList();
}

var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new DataCenter();
	}
	
	return ThisInstance;
};
