const { Module } = require('../../Common/Module.js')
const { Component, ComponentType } = require('../../Common/Component')
require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js')
var fs = require('fs')
const { QueryBase } = require('../../Common/DataBase/MySQL/QueryBase.js')
const { HistoryComponent } = require('../Logic/Components/HistoryComponent.js')
var IDGenerator = require('../../Common/IDGenerator.js').GetInstance()
var ComponentFactory = require('../../Common/CompontentFactory').GetInstance()
var ServerRole = require('../Logic/Player/ServerRole').ServerRole
var RoleMgr = require('../Logic/Player/RoleMgr').GetInstance()
var RedisMgr = require('../../Common/DataBase/Redis/RedisMgr').GetInstance()
require('../Logic/Components/AttrComponent')
require('../Logic/Item/ItemMgr')



ModuleRole = Module.extend({
    ctor: function (solution) {
        this._super(solution)
        this.Name = "ModuleRole"
        this.ModuleID = GAMESERVER_MODULE_ROLE
    }
})

ModuleRole.prototype.OnInitialize = function () {
    //Register component type
    ComponentFactory.RegisterType(ComponentType.ECT_ATTR_ROLE, AttrComponent)
    ComponentFactory.RegisterType(ComponentType.ECT_PLAYER_ITEM_MGR, ItemMgr)
    ComponentFactory.RegisterType(ComponentType.ECT_ITEM_STORAGE, ItemStorage)
    ComponentFactory.RegisterType(ComponentType.ECT_PLAYER_HISTORY, HistoryComponent)

    //Bind packet processing function
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_QUERY_ROLE_LIST, this, 'OnQueryRoleList')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_CREATE_ROLE, this, 'OnCreateRole')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_DELETE_ROLE, this, 'OnDeleteRole')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_SELECT_ROLE, this, 'OnSelectRole')
    BIND_PKG_HANDLER(proto.PKGTypeID.PKG_ROLE_CHANGE_SECOND_ATTR, this, 'OnChangeSecondAttr')
}

ModuleRole.prototype.OnQueryRoleList = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var q = new QueryBase()
        q.SQLString = "SELECT * FROM roles WHERE AccountsID=" + pkg.getUserid() + " AND (State=0 OR State=1)"
        q.Execute(async function (result) {
            var rl = new proto.GamePKG.RoleList()
            rl.setPkgid(proto.PKGTypeID.PKG_ROLE_LIST_INFO)
            rl.setUserid(pkg.getUserid())
            rl.setSelroleid(0)
            if (result.length > 0) {
                for (var i = 0; i < result.length; ++i) {
                    var ri = new proto.GamePKG.RoleInfo()
                    ri.setPkgid(proto.PKGTypeID.PKG_ROLE_INFO)
                    ri.setUserid(pkg.getUserid())
                    ri.setRoleid(result[i].RoleID)
                    ri.setRolename(result[i].RoleName)
                    ri.setVocation(result[i].Vocation)
                    ri.setGender(result[i].Gender)
                    ri.setHair(result[i].Hair)
                    ri.setHaircolor(result[i].HairColor)
                    ri.setFace(result[i].Face)
                    ri.setState(result[i].State)
                    ri.setVerifycode(pkg.getVerifycode())
                    if (result[i].State == 1)
                        rl.setSelroleid(result[i].RoleID)
                    rl.addRolelist(ri)
                }
            }
            hs.Send(rl)

            //After sending the player list, query the player attributes.
            var rolelist = rl.getRolelistList()
            for (var i = 0; i < rolelist.length; ++i) {
                var ri = rolelist[i]

                await RedisMgr.Write("RoleInfo_" + ri.getRoleid(), ri)

                var Role = RoleMgr.Find(ri.getRoleid())
                if (!Verify(Role)) {
                    Role = new ServerRole()
                    Role.AccountID = pkg.getUserid()
                    var Accountinfo = await RedisMgr.Read("AccountInfo_" + pkg.getUserid(), proto.PKGTypeID.PKG_REGIST_RESULT)
                    Role.SetAccountInfo(Accountinfo)
                    Role.SetRoleInfo(ri)
                    RoleMgr.Add(ri.getRoleid(), Role)
                }
                else
                    Role.SetRoleInfo(ri)

                Role.SetSender(hs)
                var rc = Role.CreateComponent(ComponentType.ECT_ATTR_ROLE)
                if (Verify(rc)) {
                    rc.ReStore()
                }

                var itMgr = Role.CreateComponent(ComponentType.ECT_PLAYER_ITEM_MGR)
                if (Verify(itMgr)) {
                    itMgr.ReStore()
                }

                var hisMgr = Role.CreateComponent(Component.ECT_PLAYER_HISTORY)
                if (Verify(hisMgr)) {
                    hisMgr.ReStore()
                }
            }
        })
    }
}

ModuleRole.prototype.OnSelectRole = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var q = new QueryBase()
        q.SQLString = "Update roles SET State=IF(RoleID=" + pkg.getRoleid() + ", 1, 0) Where (State = 1 OR State = 0) AND AccountsID=" + pkg.getUserid()
        q.Execute(function (result) {
        })
    }
}

ModuleRole.prototype.OnChangeSecondAttr = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var player = RoleMgr.Find(pkg.getRoleid())
        if (Verify(player)) {
            var Ac = player.GetComponent(ComponentType.ECT_ATTR)
            if (Verify(Ac) && Ac.Attr.getFreepoint() > 0) {
                var addSum = pkg.getPower() + pkg.getAccurate() + pkg.getResistibility() +
                    pkg.getVitality() + pkg.getLucky() + pkg.getCooling()
                if (addSum <= Ac.Attr.getFreepoint()) {
                    Ac.SetPower(Ac.Attr.getPower() + pkg.getPower())
                    Ac.SetAccurate(Ac.Attr.getAccurate() + pkg.getAccurate())
                    Ac.SetResistibility(Ac.Attr.getResistibility() + pkg.getResistibility())
                    Ac.SetVitality(Ac.Attr.getVitality() + pkg.getVitality())
                    Ac.SetLucky(Ac.Attr.getLucky() + pkg.getLucky())
                    Ac.SetCooling(Ac.Attr.getCooling() + pkg.getCooling())
                    Ac.Attr.setFreepoint(Ac.Attr.getFreepoint() - addSum)
                    Ac.bModify = true
                    Ac.Notify()
                }
            }
        }
    }
}

ModuleRole.prototype.OnDeleteRole = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        if (pkg.getDeleteword() == "DELETE") {
            var q = new QueryBase()
            q.SQLString = "Update roles SET State=-1, DelTime=NOW() Where AccountsID=" + pkg.getUserid() + " AND RoleID=" + pkg.getRoleid()
            q.Execute(function (result) {

            })
        }
    }
}

ModuleRole.prototype.OnCreateRole = function (pkg, hs) {
    if (Verify(pkg) && Verify(hs)) {
        var RoleID = IDGenerator.GetNewID()
        var q = new QueryBase()
        q.SQLString = "CALL CreateRole(" + pkg.getUserid() + ", " + RoleID + ", \'" + pkg.getRolename() + "\', " + pkg.getVocation() + ", "
            + pkg.getGender() + ", " + pkg.getHair() + ", " + pkg.getHaircolor() + ", " + pkg.getFace() + ")"
        q.Execute(async function (result) {
            if (result.length > 0) {
                if (result[0][0].RoleID == -1) {
                    var rPkg = new proto.GamePKG.NotifyClient()
                    rPkg.setPkgid(proto.PKGTypeID.PKG_NOTIFY_CLIENT)
                    rPkg.setCode(ROLE_NAME_EXISTS)
                    rPkg.setInfo("Role name already exists!")
                    rPkg.setUserid(pkg.getUserid())
                    hs.Send(rPkg)
                }
                else if (result[0][0].RoleID == RoleID) {
                    pkg.setPkgid(proto.PKGTypeID.PKG_CREATE_ROLE_RESULT)
                    pkg.setRoleid(RoleID)
                    hs.Send(pkg)

                    await RedisMgr.Write("RoleInfo_" + RoleID, pkg)

                    var Role = new ServerRole()
                    Role.AccountID = pkg.getUserid()
                    var Accountinfo = await RedisMgr.Read("AccountInfo_" + pkg.getUserid(), proto.PKGTypeID.PKG_REGIST_RESULT)
                    Role.SetAccountInfo(Accountinfo)
                    Role.SetRoleInfo(pkg)
                    Role.SetSender(hs)
                    var acm = Role.CreateComponent(ComponentType.ECT_ATTR_ROLE)
                    acm.ReStore()
                    RoleMgr.Add(RoleID, Role)
                }
            }
        })
    }
}
