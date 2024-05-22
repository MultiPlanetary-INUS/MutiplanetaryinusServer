const { Vector3 } = require('math3d')
const { Component, ComponentType } = require('../../../Common/Component')
const { GameObjectType } = require('../../../Common/GameObject')
const { NpcState } = require('../NPC/NpcAI')
require('../../../Common/Util/Verify.js')
var ItemExplosionMgr = require("../Item/ItemExplosionMgr").GetInstance()

CombatState = {
    CS_FREE: 0,
    CS_ATTACK: 1,
    CS_SKILL: 2,
    CS_DEFENSE: 3,
    CS_DOGE: 4,
    CS_DEAD: 5,
}

CombatComponent = Component.extend({
    ctor: function () {
        this._super()
        this.nTypeID = ComponentType.ECT_COMBAT_BASE
        this.State = CombatState.CS_FREE
        this.Enemy = null
        this.DieTime = 4
    }
})

CombatComponent.prototype.HasEnemy = function (ent) {
    if (Verify(ent)) {
        for (var i = 0; i < this.EnemyList.length; ++i) {
            if (this.EnemyList[i] == ent)
                return true
        }
    }

    return false
}

//Only NPCs will call this
CombatComponent.prototype.Attack = function (left, right)//If the left and right are true at the same time, it means defense, and there are no skills for the time being.
{
    var mv = this.GetOwner().GetComponent(ComponentType.ECT_MOVE)
    if (Verify(mv) && Verify(this.Enemy)) {
        if (left && right)
            this.State = CombatState.CS_DEFENSE
        else if (left || right)
            this.State = CombatState.CS_ATTACK
        else
            this.State = CombatState.CS_FREE

        var mve = this.Enemy.GetComponent(ComponentType.ECT_MOVE)
        if (Verify(mve)) {
            var NMC = new proto.GamePKG.NpcMove()
            NMC.setPkgid(proto.PKGTypeID.PKG_NPC_MOVE)
            NMC.setNpcid(this.GetOwner().NpcID)
            NMC.setDirection(LookRotation(mve.transform.position.sub(mv.transform.position).normalize()))
            NMC.setState(-1)
            NMC.setSpeed(0)
            NMC.setJump(false)
            NMC.setLbutton(left)
            NMC.setRbutton(right)
            NMC.setPosx(mv.transform.position.x)
            NMC.setPosy(mv.transform.position.y)
            NMC.setPosz(mv.transform.position.z)
            this.Notify(NMC)
        }

    }
}

CombatComponent.prototype.BeHit = function (attacker, attacktype, pkg) {
    if (Verify(pkg) && Verify(attacker)) {
        if (this.State == CombatState.CS_DEAD)
            return

        var nai = this.GetOwner().GetComponent(ComponentType.ECT_AI)
        if (Verify(nai))//Only NPCs will have AI components
        {
            nai.State = NpcState.Combat
            this.Enemy = attacker
            nai.GenerateFightState()
        }

        var attackattr = attacker.GetComponent(ComponentType.ECT_ATTR)
        var selfAttr = this.GetOwner().GetComponent(ComponentType.ECT_ATTR)
        if (Verify(attackattr) && Verify(selfAttr)) {
            var attackResult = new proto.GamePKG.AttackResult()
            attackResult.setPkgid(proto.PKGTypeID.PKG_ATTACK_RESULT)
            attackResult.setAttackerid(pkg.getAttackerid())
            attackResult.setAttackertype(pkg.getAttackertype())
            attackResult.setBehiterid(pkg.getBehiterid())
            attackResult.setBehitertype(pkg.getBehitertype())
            attackResult.setAttacktypeid(attacktype)
            attackResult.setAttackposx(pkg.getAttackposx())
            attackResult.setAttackposy(pkg.getAttackposy())
            attackResult.setAttackposz(pkg.getAttackposz())
            attackResult.setBhiterposx(pkg.getBhiterposx())
            attackResult.setBhiterposy(pkg.getBhiterposy())
            attackResult.setBhiterposz(pkg.getBhiterposz())

            //if(attacktype == 0)//Normal attacks. Temporary skills and normal attacks are the same.
            {
                if (this.State == CombatState.CS_DEFENSE) // defense
                {
                    attackResult.setAttackvalue(0)//No blood loss in defensive state
                    attackResult.setResulttype(1)//0 hit, 1 blocked, 2 knocked up, 3 bounced
                }
                else {
                    var minatk = attackattr.GetAttackMin()
                    var maxatk = attackattr.GetAttackMax()
                    var mindef = selfAttr.GetDefenseMin()
                    var maxdef = selfAttr.GetDefenseMax()

                    var atk = GetRandomINT(minatk, maxatk)
                    var def = GetRandomINT(mindef, maxdef)
                    var vl = atk - def
                    if (vl <= 0) {
                        vl = GetRandomINT(1, 5)//If the attack is not enough to break the defense, 1-5 drops of blood will be randomly lost.
                    }
                    selfAttr.AddHP(-vl)
                    attackResult.setAttackvalue(vl)
                    attackResult.setResulttype(0)//0 hit, 1 blocked, 2 knocked up, 3 bounced

                    if (selfAttr.GetHP() <= 0)//die
                    {
                        this.State = CombatState.CS_DEAD
                        nai.State = NpcState.Dead
                        this.DieTime = 4

                        if (this.GetOwner().ObjType == GameObjectType.GOT_NPC && attacker.ObjType == GameObjectType.GOT_Player)//The monster is killed by the player
                        {
                            attackattr.AddExp(selfAttr.Experience)//increase experience
                            attackattr.AddMoney(selfAttr.Money)
                            attacker.RaiseEvent("KillMonster", this.GetOwner().NPCAttr)
                            var ir = []
                            ItemExplosionMgr.GetItemRate(selfAttr.Explosion, ir)
                            if (ir.length > 0 && this.GetOwner().Map != null) {
                                var mim = this.GetOwner().Map.GetComponent(ComponentType.ECT_ITEMMGR)
                                if (Verify(mim)) {
                                    for (var i = 0; i < ir.length; ++i)//Explosive items
                                    {
                                        mim.CreateAItem(ir[i], new Vector3(pkg.getBhiterposx(), pkg.getBhiterposy(), pkg.getBhiterposz()), attacker.RoleID)
                                    }
                                }
                            }
                        }
                    }
                }
                attackResult.setAttackreturn(0)//rebound damage
            }
            //else//Skill attack
            {

            }

            this.Notify(attackResult)
        }
    }
}

CombatComponent.prototype.Notify = function (pkg) {
    if (this.GetOwner().ObjType == GameObjectType.GOT_Player) {
        this.GetOwner().NotifyAround(pkg)
    }
    else if (this.GetOwner().Map != null) {
        this.GetOwner().Map.NotifyAllPlayer(pkg)
    }
}

exports.CombatState = CombatState
exports.CombatComponent = CombatComponent