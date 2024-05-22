const { ComponentType } = require('../../../Common/Component')
const { MapType } = require('../../Gen/Types')

var Manager = require('../../../Common/Manager').Manager
var EventCenter = require('../../../Common/EventCenter').GetInstance()
var DataCenter = require('../../Gen/DataCenter').GetInstance()
var ServerMap = require('./ServerMap').ServerMap

SceneMgr = Manager.extend({
    ctor: function () {
        this._super()
        this.DuplicateMap = {}
    }
})

SceneMgr.prototype.Init = function () {
    var maplist = DataCenter.GetMapList()
    for (var i = 0; i < maplist.length; ++i) {
        var mp = new ServerMap()
        mp.MapID = maplist[i].ID
        mp.CreateID = 0
        mp.MapAttr = maplist[i]
        mp.CreateComponent(ComponentType.ECT_MAP_PLAYER_MGR)
        this.Add(mp.MapID, mp)

        if (maplist[i].Type != MapType.Normal)//Copy maps are managed separately
        {
            this.DuplicateMap[maplist[i].ID] = {}
        }
    }
}

SceneMgr.prototype.GetMapByPlayer = function (player) {
    if (Verify(player)) {
        var mvc = player.GetComponent(ComponentType.ECT_MOVE)
        if (Verify(mvc)) {
            return this.TryGetMap(mvc.MapId, player)
        }

    }
    return null
}

SceneMgr.prototype.TryGetMap = function (mapid, player) {
    var map = this.Find(mapid)
    var nmap = null
    if (Verify(map) && Verify(player)) {
        if (map.MapAttr.Type == MapType.Normal)//Ordinary maps can be accessed directly
        {
            nmap = map
        }
        else//Copy maps need to be judged
        {
            if (map.TestCondition(player)) {
                var dmp = this.DuplicateMap[mapid]
                var CreateID = 0
                if (map.MapAttr.Type == MapType.Born || map.MapAttr.Type == MapType.Single)//Newbie map or single player copy
                {
                    CreateID = player.RoleID
                }
                else if (map.MapAttr.Type == MapType.Duplicate)//Multiplayer copy
                {
                    CreateID = player.TeamID
                }
                else if (map.MapAttr.Type == MapType.Guild)//Guild map
                {
                    CreateID = player.GetGuildID()
                }
                nmap = dmp[CreateID]

                if (!Verify(nmap)) {
                    nmap = new ServerMap()
                    nmap.MapID = map.MapAttr.ID
                    nmap.CreateID = CreateID
                    nmap.MapAttr = map.MapAttr
                    dmp[CreateID] = nmap
                }

            }
        }

        if (Verify(nmap)) {
            nmap.CreateComponent(ComponentType.ECT_MAP_PLAYER_MGR)
            nmap.CreateComponent(ComponentType.ECT_MAP_NPC_MGR)
            nmap.CreateComponent(ComponentType.ECT_MAP_ITEM_MGR)

            return nmap
        }
    }

    return null
}


SceneMgr.prototype.RemovePlayer = function (userid, roleid) {
    for (var id in this.ManagerMap) {
        this.ManagerMap[id].RemoveOtherPlayerByUserID(userid, null)
    }

    for (var di in this.DuplicateMap) {
        var list = this.DuplicateMap[di]
        var obj = list[roleid]
        if (Verify(obj)) {
            if (Verify(obj.Release)) {
                obj.Release()
            }
            delete list[roleid]
        }
    }
}

SceneMgr.prototype.OnUpdate = function (ms) {
    for (var id in this.ManagerMap) {
        if (this.ManagerMap[id].MapAttr.Type == MapType.Normal)
            this.ManagerMap[id].Update(ms)
    }

    for (var di in this.DuplicateMap) {
        var list = this.DuplicateMap[di]
        for (var ui in list)
            list[ui].Update(ms)
    }
}


var ThisInstance = null
exports.GetInstance = function () {
    if (!Verify(ThisInstance)) {
        ThisInstance = new SceneMgr()
    }

    return ThisInstance
}