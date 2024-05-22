const { Class } = require("../../../Common/Util/Class");
const { Skill } = require("./Skill.js");
var DataCenter = require('../../Gen/DataCenter').GetInstance();

SkillTables = Class.extend({
    ctor:function()
    {
        this.SkillMap = {}
    }
})

SkillTables.prototype.CreateSkill = function(id)
{
    var skd = DataCenter.GetSkillData(id)
    if(Verify(skd))
    {
        return new Skill(skd, 1)
    }

    return null;
}

SkillTables.prototype.Init = function()
{
    var skl = DataCenter.GetSkillDataList()
    if(Verify(skl))
    {
        for(var i=0; i < skl.length; ++i)
        {
            var skill = this.CreateSkill(skl[i].ID);
            if(skill != null)
                this.SkillMap[skl[i].ID] = skill;
        }
    }
}

SkillTables.prototype.GetSkill = function(id)
{
    return this.SkillMap[id];
}

var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new SkillTables();
	}
	
	return ThisInstance;
};