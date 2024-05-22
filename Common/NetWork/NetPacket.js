require('./Protobuf/MessageID_pb.js')
require('./Protobuf/ServerPKG_pb.js')
require('./Protobuf/LoginPKG_pb.js')
require('./Protobuf/RolePKG_pb.js')
require('./Protobuf/GameMap_pb.js')
require('./Protobuf/ChatPKG_pb.js')
require('./Protobuf/Item_pb.js')
require('./Protobuf/Relation_pb.js')
require('./Protobuf/QuestPKG_pb.js')

var PKGMap = {}


PKGMap[proto.PKGTypeID.PKG_SERVER_HEART] = proto.ServerPKG.ServerHeart
PKGMap[proto.PKGTypeID.PKG_SERVER_HEART_RETURN] = proto.ServerPKG.ServerHeart

PKGMap[proto.PKGTypeID.PKG_SERVER_REGIST_TYPE] = proto.ServerPKG.RegServerType

PKGMap[proto.PKGTypeID.PKG_SERVER_REGIST_RESULT] = proto.ServerPKG.RegServerResult
PKGMap[proto.PKGTypeID.PKG_SERVER_SHUTDOWN] = proto.ServerPKG.RegServerType
PKGMap[proto.PKGTypeID.PKG_SERVER_PLAYER_DISCONNETION] = proto.ServerPKG.PlayerDisconnection
PKGMap[proto.PKGTypeID.PKG_SERVER_ROLE_ATTR_CHANGE] = proto.ServerPKG.ServerRoleAttrChange

PKGMap[proto.PKGTypeID.PKG_COMP_CLIENT_INFO] = proto.GamePKG.CompGameInfo
PKGMap[proto.PKGTypeID.PKG_HEART] = proto.GamePKG.ClientHeart
PKGMap[proto.PKGTypeID.PKG_HEART_RESULT] = proto.GamePKG.ClientHeart
PKGMap[proto.PKGTypeID.PKG_ASK_IDENTIFY_CODE] = proto.GamePKG.AskIdentifyCode
PKGMap[proto.PKGTypeID.PKG_ASK_IDENTIFY_RESULT] = proto.GamePKG.AskIdentifyResult
PKGMap[proto.PKGTypeID.PKG_NOTIFY_CLIENT] = proto.GamePKG.NotifyClient
PKGMap[proto.PKGTypeID.PKG_GAME_LOGIN] = proto.GamePKG.GameLogin
PKGMap[proto.PKGTypeID.PKG_GAME_LOGIN_RESULT] = proto.GamePKG.LoginResult
PKGMap[proto.PKGTypeID.PKG_REGIST_ACCOUNT] = proto.GamePKG.RegistAccount
PKGMap[proto.PKGTypeID.PKG_REGIST_RESULT] = proto.GamePKG.LoginResult
PKGMap[proto.PKGTypeID.PKG_SET_SAFE_QUESTION] = proto.GamePKG.SetASafeQuestion

PKGMap[proto.PKGTypeID.PKG_ROLE_LIST_INFO] = proto.GamePKG.RoleList
PKGMap[proto.PKGTypeID.PKG_ROLE_ATTR] = proto.GamePKG.RoleAttr
PKGMap[proto.PKGTypeID.PKG_QUERY_ROLE_LIST] = proto.GamePKG.QueryRoleList
PKGMap[proto.PKGTypeID.PKG_CREATE_ROLE] = proto.GamePKG.RoleInfo
PKGMap[proto.PKGTypeID.PKG_ROLE_INFO] = proto.GamePKG.RoleInfo
PKGMap[proto.PKGTypeID.PKG_CREATE_ROLE_RESULT] = proto.GamePKG.RoleInfo
PKGMap[proto.PKGTypeID.PKG_DELETE_ROLE] = proto.GamePKG.DeleteRole
PKGMap[proto.PKGTypeID.PKG_SELECT_ROLE] = proto.GamePKG.DeleteRole
PKGMap[proto.PKGTypeID.PKG_ROLE_BASE_ATTR] = proto.GamePKG.RoleAttrValue
PKGMap[proto.PKGTypeID.PKG_ROLE_CHANGE_SECOND_ATTR] = proto.GamePKG.RoleAttrValue

PKGMap[proto.PKGTypeID.PKG_ENTER_GAME] = proto.GamePKG.EnterGame
PKGMap[proto.PKGTypeID.PKG_ENTER_GAME_RESPONSE] = proto.GamePKG.EnterGameResponse
PKGMap[proto.PKGTypeID.PKG_OTHER_ROLE_ENTER] = proto.GamePKG.OtherPlayerEnter
PKGMap[proto.PKGTypeID.PKG_PLAYER_CONTROL] = proto.GamePKG.PlayerControl
PKGMap[proto.PKGTypeID.PKG_LEAVE_GAME] = proto.GamePKG.PlayerLeaveGame
PKGMap[proto.PKGTypeID.PKG_NPC_INFO] = proto.GamePKG.NpcInfo
PKGMap[proto.PKGTypeID.PKG_CHANGE_MAP] = proto.GamePKG.ChangeMap
PKGMap[proto.PKGTypeID.PKG_ITEM_ON_MAP] = proto.GamePKG.ItemOnMap
PKGMap[proto.PKGTypeID.PKG_ITEM_DESTORY_ON_MAP] = proto.GamePKG.ItemDesOnMap
PKGMap[proto.PKGTypeID.PKG_NPC_DEAD] = proto.GamePKG.NpcDead
PKGMap[proto.PKGTypeID.PKG_NPC_MOVE] = proto.GamePKG.NpcMove
PKGMap[proto.PKGTypeID.PKG_ATTACK_INFO] = proto.GamePKG.AttackInfo
PKGMap[proto.PKGTypeID.PKG_ATTACK_RESULT] = proto.GamePKG.AttackResult

PKGMap[proto.PKGTypeID.PKG_CHAT_MESSAGE] = proto.GamePKG.ChatMessage

PKGMap[proto.PKGTypeID.PKG_ITEM_INFO] = proto.GamePKG.ItemCF
PKGMap[proto.PKGTypeID.PKG_ITEM_LIST] = proto.GamePKG.ItemList
PKGMap[proto.PKGTypeID.PKG_ITEM_ADD] = proto.GamePKG.ItemCF
PKGMap[proto.PKGTypeID.PKG_ITEM_REMOVE] = proto.GamePKG.RemoveItem
PKGMap[proto.PKGTypeID.PKG_ITEM_CHANGE_POS] = proto.GamePKG.ChangeItemPos
PKGMap[proto.PKGTypeID.PKG_USE_ITEM] = proto.GamePKG.UseItem
PKGMap[proto.PKGTypeID.PKG_PICK_UP_ITEM] = proto.GamePKG.PickUpItem

PKGMap[proto.PKGTypeID.PKG_ADD_SKILL] = proto.GamePKG.AddSkill
PKGMap[proto.PKGTypeID.PKG_USE_SKILL] = proto.GamePKG.UseSkill
PKGMap[proto.PKGTypeID.PKG_DEL_SKILL] = proto.GamePKG.DelSkill

PKGMap[proto.PKGTypeID.PKG_TEAM_APPLICANT] = proto.GamePKG.TeamApplicantCF
PKGMap[proto.PKGTypeID.PKG_TEAM_CREATE] = proto.GamePKG.TeamInfoCF
PKGMap[proto.PKGTypeID.PKG_TEAM_ADD_ROLE] = proto.GamePKG.TeamApplicantCF
PKGMap[proto.PKGTypeID.PKG_TEAM_REMOVE_ROLE] = proto.GamePKG.LeaveTeam

PKGMap[proto.PKGTypeID.PKG_QUEST_LIST] = proto.GamePKG.QuestList
PKGMap[proto.PKGTypeID.PKG_QUEST_ACCEPT] = proto.GamePKG.QuestOperate
PKGMap[proto.PKGTypeID.PKG_QUEST_STEP] = proto.GamePKG.Quest
PKGMap[proto.PKGTypeID.PKG_QUEST_FAILED] = proto.GamePKG.QuestOperate
PKGMap[proto.PKGTypeID.PKG_QUEST_DONE] = proto.GamePKG.QuestOperate
PKGMap[proto.PKGTypeID.PKG_QUEST_HISTORY] = proto.GamePKG.History

PKGMap[proto.PKGTypeID.PKG_NPC_TARGET_DEBUG] = proto.GamePKG.DebugNpcTarget

exports.PKGMap = PKGMap

exports.Serialize = function (pkg) {
    return pkg.serializeBinary()
}

exports.DeSerialize = function (type, buf) {
    if (Verify(PKGMap[type]))
        return PKGMap[type].deserializeBinary(buf)
    return null
}

