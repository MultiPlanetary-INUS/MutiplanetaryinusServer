const { GameObject } = require("../../../Common/GameObject")

var IDGenerator = require('../../../Common/IDGenerator.js').GetInstance()

Team = GameObject.extend({
    ctor: function () {
        this.TeamID = 0
        this.RoleList = []
        this.Leader = null
        this.ApplicantList = []
        this.bTeamExist = false
    }
})

Team.prototype.AddMember = function (role) {
    if (Verify(role) && this.RoleList.length < MAX_TEAM_MEMBER) {
        if (this.IsExistApplicant(role.RoleID)) {
            this.RemoveApplicant(role.RoleID)
        }

        if (!this.IsExistMember(role)) {
            if (IsLeader(role)) {
                this.RoleList.unshift(role)
            }
            else {
                this.RoleList.push(role)
            }

            this.OnAddMember(role)
        }

        role.TeamID = this.TeamID
    }
}

Team.prototype.IsLeader = function (role) {
    return role == this.Leader
}

Team.prototype.GetLeader = function () {
    return this.Leader
}

Team.prototype.ChangeLeader = function (role) {
    this.Leader = role
    for (var i = 0; i < this.RoleList.length; ++i) {
        if (this.RoleList[i] == role) {
            this.RoleList.splice(i, 1)     //Delete at current location
            this.RoleList.unshift(role)    //Insert at the beginning
            this.OnChangeLeader(role)
            break
        }
    }
}

Team.prototype.IsExistMember = function (rid) {
    for (var i = 0; i < this.RoleList.length; ++i) {
        if (this.RoleList[i].RoleID == rid) {
            return true
        }
    }

    return false
}

Team.prototype.IsExistApplicant = function (rid) {
    for (var i = 0; i < this.ApplicantList.length; ++i) {
        if (this.ApplicantList[i].getRoleid() == rid) {
            return true
        }
    }

    return false
}

Team.prototype.RemoveApplicant = function (rid) {
    for (var i = 0; i < this.ApplicantList.length; ++i) {
        if (this.ApplicantList[i].getRoleid() == rid) {
            this.OnRemoveApplicant(this.ApplicantList[i])
            this.ApplicantList.splice(i, 1)
        }
    }
}

Team.prototype.AddApplicant = function (acf) {
    if (!this.IsExistApplicant(acf.getRoleid())) {
        this.ApplicantList.push(acf)
        this.OnAddApplicant(acf)
    }
}

Team.prototype.GetMember = function (idx) {
    if (idx >= 0 && idx < this.RoleList.length)
        return this.RoleList[idx]

    return null
}

Team.prototype.CountMember = function () {
    return this.RoleList.length
}

Team.prototype.IndexInTeam = function (role) {
    for (var i = 0; i < this.RoleList.length; ++i) {
        if (this.RoleList[i] == role) {
            return i
        }
    }

    return -1
}

Team.prototype.Create = function (role) {
    this.TeamID = IDGenerator.GetNewID()
    this.Leader = role
    this.AddMember(role)
    this.OnCreate()
    this.bTeamExist = true
    return true
}

Team.prototype.RemoveMember = function (rid) {
    for (var i = 0; i < this.RoleList.length; ++i) {
        if (this.RoleList[i].RoleID == rid) {
            this.RoleList[i].TeamID = 0
            this.OnRemoveMember(this.RoleList[i])
            this.RoleList.splice(i, 1)
            break
        }
    }
}

//Disband
Team.prototype.Dismiss = function () {
    for (var i = 0; i < this.RoleList.length; ++i) {
        this.RoleList[i].TeamID = 0
        this.OnRemoveMember(this.RoleList[i])
    }
    this.RoleList.length = 0
    for (var i = 0; i < this.AddApplicant.length; ++i) {
        this.OnRemoveApplicant(this.AddApplicant[i])
        delete this.AddApplicant[i]
    }
    this.OnDismiss()
    this.bTeamExist = false
}

Team.prototype.OnDismiss = function () {

}

Team.prototype.OnChangeLeader = function (role) {

}

Team.prototype.OnAddMember = function (role) {

}

Team.prototype.OnAddApplicant = function (acf) {

}

Team.prototype.OnCreate = function () {

}

Team.prototype.OnRemoveMember = function (role) {

}

Team.prototype.OnRemoveApplicant = function (acf) {

}

Team.prototype.NotifyAllMember = function (pkg) {
    for (var i = 0; i < this.RoleList.length; ++i) {
        pkg.setUserid(this.RoleList[i].AccountID)
        this.RoleList[i].SendPkg(pkg)
    }
}

