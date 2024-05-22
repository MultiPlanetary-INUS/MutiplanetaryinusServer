const { Vector3 } = require('math3d')
const { Component, ComponentType } = require('../../../Common/Component')
var DataCenter = require('../../Gen/DataCenter').GetInstance()
const { AttrType, NPCAIType, NPCTypes } = require('../../Gen/Types')

NpcState = {
    Normal: 0,   //stand still
    Patrol: 1,   //patrol
    Combat: 2,   //fighting
    Dead: 3,     //die
}


NPCAI = Component.extend({
    ctor: function () {
        this._super()
        this.NpcType = NPCTypes.Normal
        this.nTypeID = ComponentType.ECT_NPC_AI_NORMAL
        this.State = NpcState.Normal
        this.AIType = NPCAIType.Normal
        this.BronPosition = Vector3.zero
        this.PatrolRadio = 0//patrol radius
        this.ChevyRadio = 0//pursuit radius
        this.PatrolSpeed = 0
        this.ChevySpeed = 0

        this.CurStateTime = 0
        this.TargetPosition = Vector3.zero
    }
})

NPCAI.prototype.GeneratePatrolState = function () {
    if (this.State == NpcState.Dead)
        return

    var mvc = this.GetOwner().GetComponent(ComponentType.ECT_MOVE)
    var cmbc = this.GetOwner().GetComponent(ComponentType.ECT_COMBAT)
    if (Verify(mvc) && this.NpcType == NPCTypes.Monster && Verify(cmbc))//Currently, only monsters have AI behavior
    {
        if (GetRandom(0, 1.0) > 0.5) {
            if (this.PatrolRadio > 0 && this.PatrolSpeed > 0) {
                var rnd = new Vector3(GetRandom(-1.0, 0, 1.0), 0, GetRandom(-1.0, 0, 1.0)).normalize()
                this.TargetPosition = this.BronPosition.add(rnd.mulScalar(GetRandom(0, this.PatrolRadio)))
                var distance = mvc.Distance(this.TargetPosition)
                this.CurStateTime = distance / this.PatrolSpeed + GetRandom(3.0, 5.0)
                mvc.MoveSpeed = this.PatrolSpeed
                mvc.TargetPosition = this.TargetPosition
                mvc.State = 0
            }
            else {
                this.TargetPosition = mvc.transform.position
                this.CurStateTime = GetRandom(3.0, 5.0)//Stand temporarily for 3 to 5 seconds
                mvc.TargetPosition = mvc.transform.position
                mvc.MoveSpeed = 0
                mvc.State = -1
            }
        }
        else {
            this.TargetPosition = mvc.transform.position
            this.CurStateTime = GetRandom(3.0, 5.0)//Stand temporarily for 3 to 5 seconds
            mvc.TargetPosition = mvc.transform.position
            mvc.MoveSpeed = 0
            mvc.State = -1
        }

        // var dp = new proto.GamePKG.DebugNpcTarget()
        // dp.setPkgid(proto.PKGTypeID.PKG_NPC_TARGET_DEBUG);
        // dp.setNpcid(this.GetOwner().NpcID);
        // dp.setPosx(this.TargetPosition.x);
        // dp.setPosy(this.TargetPosition.y);
        // dp.setPosz(this.TargetPosition.z);
        // this.GetOwner().Map.NotifyAllPlayer(dp);
    }
}

NPCAI.prototype.GenerateFightState = function () {
    if (this.State == NpcState.Dead)
        return

    var mvc = this.GetOwner().GetComponent(ComponentType.ECT_MOVE)
    var cmbc = this.GetOwner().GetComponent(ComponentType.ECT_COMBAT)

    if (Verify(mvc) && this.NpcType == NPCTypes.Monster && Verify(cmbc))//Currently, only monsters have AI behavior
    {
        if (this.ChevyRadio > 0 && cmbc.Enemy != null && this.ChevySpeed > 0) {
            var mv = cmbc.Enemy.GetComponent(ComponentType.ECT_MOVE)
            if (Verify(mv) && mvc.Distance(this.BronPosition) <= this.ChevyRadio) {
                var distance = mvc.Distance(mv.transform.position)
                if (distance > 0.5 && !mv.transform.position.equals(Vector3.zero))//Pursuit at a distance greater than 0.5 meters
                {
                    this.TargetPosition = mv.transform.position
                    this.CurStateTime = 0.1//Tracking every moment of battle
                    mvc.MoveSpeed = this.ChevySpeed
                    mvc.TargetPosition = this.TargetPosition
                    mvc.State = 1
                }
                else//Otherwise attack or defend or do nothing
                {
                    var cbc = this.GetOwner().GetComponent(ComponentType.ECT_COMBAT)
                    var left = false
                    var right = false
                    var rnd = GetRandom(0, 1.0)
                    // if(rnd > 0.9)
                    // {
                    //     left = false;
                    //     right = false;
                    // }
                    // else if(rnd > 0.7)
                    // {
                    //     left = true;
                    //     right = true;
                    // }
                    //else
                    {
                        if (GetRandom(0, 1.0) > 0.5) {
                            left = true
                            right = false
                        }
                        else {
                            left = false
                            right = true
                        }
                    }
                    this.TargetPosition = mvc.transform.position
                    this.CurStateTime = GetRandom(1.0, 2.0)
                    mvc.MoveSpeed = 0
                    mvc.TargetPosition = mvc.transform.position
                    mvc.State = -1
                    cbc.Attack(left, right)
                }

                this.State = NpcState.Combat

                // var dp = new proto.GamePKG.DebugNpcTarget()
                // dp.setPkgid(proto.PKGTypeID.PKG_NPC_TARGET_DEBUG);
                // dp.setNpcid(this.GetOwner().NpcID);
                // dp.setPosx(this.TargetPosition.x);
                // dp.setPosy(this.TargetPosition.y);
                // dp.setPosz(this.TargetPosition.z);
                // this.GetOwner().Map.NotifyAllPlayer(dp);
            }
        }
        else {
            if (this.PatrolRadio > 0 && this.PatrolSpeed > 0) {
                this.State = NpcState.Patrol
                this.GeneratePatrolState()
            }
            else {
                this.State = NpcState.Normal
            }
        }
    }
}


NPCAI.prototype.GenerateState = function () {
    if (this.State == NpcState.Dead)
        return

    var mvc = this.GetOwner().GetComponent(ComponentType.ECT_MOVE)
    var cmbc = this.GetOwner().GetComponent(ComponentType.ECT_COMBAT)

    if (Verify(mvc) && this.NpcType == NPCTypes.Monster && Verify(cmbc))//Currently, only monsters have AI behavior
    {
        if (this.State == NpcState.Combat)
            return this.GenerateFightState()
        else
            return this.GeneratePatrolState()
    }
}


NPCAI.prototype.OnAttach = function () {
    this.EnemyList = []
    this.CurStateTime = 10//Start AI
}

NPCAI.prototype.OnDetach = function () {
}

NPCAI.prototype.OnUpdate = function (ms) {
    if (this.CurStateTime > 0 && this.State < NpcState.Dead) {
        this.CurStateTime -= ms / 1000.0
        if (this.CurStateTime <= 0) {
            this.GenerateState()
        }
    }
}


exports.NpcState = NpcState
exports.NPCAI = NPCAI