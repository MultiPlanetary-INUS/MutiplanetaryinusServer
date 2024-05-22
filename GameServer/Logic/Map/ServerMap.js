const { Vector3 } = require('math3d')
const { Component, ComponentType } = require('../../../Common/Component')
const { GameObject, GameObjectType } = require('../../../Common/GameObject')
var ConditonsFactory = require('../Conditions/ConditionsFactory.js').GetInstance()
require('../../../Common/DataBase/MySQL/QueryBase')
require('../../../Common/NetWork/Protobuf/LoginPKG_pb')
require('../../Gen/Types')


ServerMap = GameObject.extend({
    ctor: function () {
        this._super()
        this.ObjType = GameObjectType.GOT_MAP
        this.MapID = 0             //Map ID
        this.CreateID = 0          //Copy creator ID,
        this.MapAttr = null
        this.Conditions = []
    }
})

ServerMap.prototype.CreateMapCondition = function () {
    if (Verify(this.MapAttr)) {
        for (var i = 0; i < this.MapAttr.EnterConditions.length; ++i) {
            var con = ConditonsFactory.Create(this.MapAttr.EnterConditions[i], this)
            if (!Verify(con)) {
                return false
            }
            this.Conditions.push(con)
        }
    }
    return true
}

ServerMap.prototype.TestCondition = function (player) {
    for (var i = 0; i < this.Conditions.length; ++i) {
        if (!this.Conditions[i].Match(player))
            return false
    }

    return true
}

ServerMap.prototype.RemoveOtherPlayerByUserID = function (uid, pl) {
    var PlayMgr = this.GetComponent(ComponentType.ECT_PLAYERMGR)
    var plist = PlayMgr.GetMap()
    for (var id in plist) {
        var p = plist[id]
        if (p.AccountID == uid && p != pl) {
            p.Map = null
            PlayMgr.Remove(p.RoleID)
            var lg = new proto.GamePKG.PlayerLeaveGame
            lg.setPkgid(proto.PKGTypeID.PKG_LEAVE_GAME)
            lg.setUserid(p.AccountID)
            lg.setRoleid(p.RoleID)
            this.NotifyAllPlayer(lg)
        }
    }
}

ServerMap.prototype.AddPlayer = function (player) {
    if (Verify(player)) {
        var PlayMgr = this.GetComponent(ComponentType.ECT_PLAYERMGR)
        this.RemoveOtherPlayerByUserID(player.AccountID, player)

        PlayMgr.Add(player.RoleID, player)
        player.Map = this

        var MVC = player.GetComponent(ComponentType.ECT_MOVE)
        var ATC = player.GetComponent(ComponentType.ECT_ATTR)
        ATC.CalculateAttr()

        var epk = new proto.GamePKG.EnterGameResponse()
        epk.setPkgid(proto.PKGTypeID.PKG_ENTER_GAME_RESPONSE)
        epk.setUserid(player.AccountID)
        epk.setRoleid(player.RoleID)
        epk.setMapid(this.MapID)
        epk.setCreatorid(this.CreateID)
        epk.setPosx(MVC.transform.position.x)
        epk.setPosy(MVC.transform.position.y)
        epk.setPosz(MVC.transform.position.z)
        epk.setDirection(MVC.transform.rotation.eulerAngles.y)
        player.SendPkg(epk)

        //Notify that someone has entered this map. You can add distance judgment here. Only players within a certain range will receive the message.
        var plist = PlayMgr.GetMap()
        for (var id in plist) {
            var p = plist[id]

            if (p != player) {
                var mc = p.GetComponent(ComponentType.ECT_MOVE)
                var ac = p.GetComponent(ComponentType.ECT_ATTR)

                //Notify other players that new players have joined
                var opk = new proto.GamePKG.OtherPlayerEnter()
                opk.setPkgid(proto.PKGTypeID.PKG_OTHER_ROLE_ENTER)
                opk.setUserid(p.AccountID)
                opk.setOtheruserid(player.AccountID)
                opk.setOtherroleid(player.RoleID)
                opk.setPosx(MVC.transform.position.x)
                opk.setPosy(MVC.transform.position.y)
                opk.setPosz(MVC.transform.position.z)
                opk.setDirection(MVC.transform.rotation.eulerAngles.y)
                opk.setOtherroleinfo(player.RoleInfo)
                opk.setOtherroleattr(ATC.Attr)
                p.SendPkg(opk)
                //Send other player information to new players
                opk.setUserid(player.AccountID)
                opk.setOtheruserid(p.AccountID)
                opk.setOtherroleid(p.RoleID)
                opk.setPosx(mc.transform.position.x)
                opk.setPosy(mc.transform.position.y)
                opk.setPosz(mc.transform.position.z)
                opk.setDirection(mc.transform.rotation.eulerAngles.y)
                opk.setOtherroleinfo(p.RoleInfo)
                opk.setOtherroleattr(ac.Attr)
                player.SendPkg(opk)

                //Synchronize basic properties
                ac.SendBaseAttr(player)
                ATC.SendBaseAttr(p)

                //Synchronize skills, equipment and other information
                var skp = player.GetComponent(ComponentType.ECT_SKILLMGR)
                var sko = p.GetComponent(ComponentType.ECT_SKILLMGR)
                if (Verify(skp) && Verify(sko)) {
                    skp.SyncSkill(p)
                    sko.SyncSkill(player)
                }
                var imp = player.GetComponent(ComponentType.ECT_ITEMMGR)
                var imo = p.GetComponent(ComponentType.ECT_ITEMMGR)
                if (Verify(imp) && Verify(imo)) {
                    imp.SyncEquip(p)
                    imo.SyncEquip(player)
                }
            }
        }

        var nmg = this.GetComponent(ComponentType.ECT_NPCMGR)
        if (Verify(nmg)) {
            nmg.SendAllNpc(player)
        }
        var img = this.GetComponent(ComponentType.ECT_ITEMMGR)
        if (Verify(img)) {
            img.SendAllItem(player)
        }
    }
}

ServerMap.prototype.NotifyAllPlayer = function (pkg) {
    var PlayMgr = this.GetComponent(ComponentType.ECT_PLAYERMGR)
    if (Verify(PlayMgr)) {
        var plist = PlayMgr.GetMap()
        for (var id in plist) {
            pkg.setUserid(plist[id].AccountID)
            plist[id].SendPkg(pkg)
        }
        return true
    }
    return false
}

ServerMap.prototype.OnUpdate = function (ms) {
}

exports.ServerMap = ServerMap