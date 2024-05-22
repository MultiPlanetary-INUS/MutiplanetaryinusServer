const { GameObject } = require("../../../Common/GameObject");
const { SkillData } = require("../../Gen/Types");
var ConditionsFactory = require('../Conditions/ConditionsFactory').GetInstance();
var ActionFactory = require('../Actions/ActionFactory').GetInstance();

Skill = GameObject.extend({
    ctor:function(data, l = 1)
    {
        this.SKData = data;
        this.Level = l;
        this.Owner = null;
        this.CoolTime = 0.0;
        this.GetConditions = [];
        this.UseConditions = [];
        this.PreActions = [];
        this.Effects = [];

        if(Verify(data))
        {
            for(var i=0; i < data.GetConditions.length; ++i)
            {
                var con = ConditionsFactory.Create(data.GetConditions[i], this);
                if(Verify(con))
                    this.GetConditions.push(con);
            }

            for(var i=0; i < data.UseConditions.length; ++i)
            {
                var con = ConditionsFactory.Create(data.UseConditions[i], this);
                if(Verify(con))
                    this.UseConditions.push(con);
            }

            for(var i=0; i < data.PreAction.length; ++i)
            {
                var act = ActionFactory.Create(data.PreAction[i])
                if(Verify(act))
                    this.PreActions.push(act);
            }

            for(var i=0; i < data.Effects.length; ++i)
            {
                var act = ActionFactory.Create(data.Effects[i])
                if(Verify(act))
                    this.Effects.push(act);
            }
        }
    }
})

Skill.prototype.GetSkillID = function()
{
    return this.SKData.ID;
}

Skill.prototype.MustHasTarget = function()
{
    return this.SKData.MustTarget;
}

Skill.prototype.GetLevel = function()
{
    return this.Level;
}

Skill.prototype.LevelUp = function()
{
    if(this.Level < this.SKData.MaxLevel)
        this.Level++
}

Skill.prototype.GetCoolDown = function()
{
    if(this.SKData.CoolDown.length >= this.Level)
        return this.SKData.CoolDown[this.Level-1];

    return 0;
}

Skill.prototype.GetMaxDistance = function()
{
    if(this.SKData.TargetDistance.length >= this.Level)
        return this.SKData.TargetDistance[this.Level -1]

    return 0;
}

Skill.prototype.GetAttackRadio = function()
{
    if(this.SKData.AttackRadio.length >= this.Level)
        return this.SKData.AttackRadio[this.Level-1]
    
    return 0;
}

Skill.prototype.GetTargetCount = function()
{
    if(this.SKData.TargetCount.length >= this.Level)
        return this.SKData.TargetCount[this.Level-1]

    return 0
}

Skill.prototype.GetUseTime = function()
{
    if(this.SKData.UseTime.length >= this.Level)
        return this.SKData.UseTime[this.Level-1]

    return 0
}

Skill.prototype.CanUse = function()
{
    if(this.CoolTime <= 0 && Verify(this.Owner))
    {
        for(var i=0; i < this.UseConditions.length; ++i)
        {
            if(!this.UseConditions[i].Match(this.Owner))
                return false;
        }
        return true;
    }

    return false;
}

Skill.prototype.Release = function()
{
    if(this.CanUse())
    {
        this.CoolTime = this.SKData.CoolDown[this.Level-1];

        for(var i=0; i < this.PreActions.length; ++i)
        {
            var act = this.PreActions[i]
            if(Verify(act))
                act.Execute(this.Owner);
        }

    }
}

Skill.prototype.CanGet = function(p)
{
    if(p != null)
    {
        for(var i=0; i < this.GetConditions.length; ++i)
        {
            if(!this.GetConditions[i].Match(p))
                return false;
        }
        return true;
    }
    return false;
}

Skill.prototype.OnUpdate = function(ms)
{
    if(this.CoolTime > 0)
    {
        this.CoolTime -= ms / 1000.0
        if(this.CoolTime < 0)
            this.CoolTime = 0;
    }
}

exports.Skill = Skill;