// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: MessageID.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
/// <summary>Holder for reflection information generated from MessageID.proto</summary>
public static partial class MessageIDReflection {

  #region Descriptor
  /// <summary>File descriptor for MessageID.proto</summary>
  public static pbr::FileDescriptor Descriptor {
    get { return descriptor; }
  }
  private static pbr::FileDescriptor descriptor;

  static MessageIDReflection() {
    byte[] descriptorData = global::System.Convert.FromBase64String(
        string.Concat(
          "Cg9NZXNzYWdlSUQucHJvdG8qZAoLQ0hBVENoYW5uZWwSDQoJQ1RfTk9STUFM",
          "EAASCwoHQ1RfVEVBTRABEgwKCENUX0dVSUxEEAISDAoIQ1RfV09STEQQAxIO",
          "CgpDVF9QUklWQVRFEAQSDQoJQ1RfU1lTVEVNEAUqXAoRSXRlbUNvbnRhaW5l",
          "clR5cGUSCgoGSUNfQkFHEAASCwoHSUNfQm9keRABEg4KCklDX0Zhc2hpb24Q",
          "AhIQCgxJQ19RdWlja0l0ZW0QAxIMCghJQ19PVEhFUhAEKo0NCglQS0dUeXBl",
          "SUQSHAoYUEtHX1NFUlZFUl9NRVNTQUdFX0JFR0lOEAASFAoQUEtHX1NFUlZF",
          "Ul9IRUFSVBABEhsKF1BLR19TRVJWRVJfSEVBUlRfUkVUVVJOEAISGgoWUEtH",
          "X1NFUlZFUl9SRUdJU1RfVFlQRRADEhwKGFBLR19TRVJWRVJfUkVHSVNUX1JF",
          "U1VMVBAEEhcKE1BLR19TRVJWRVJfU0hVVERPV04QBRIiCh5QS0dfU0VSVkVS",
          "X1BMQVlFUl9ESVNDT05ORVRJT04QBhIfChtQS0dfU0VSVkVSX1JPTEVfQVRU",
          "Ul9DSEFOR0UQBxIbChZQS0dfU0VSVkVSX01FU1NBR0VfTUFYEOcHEhYKEVBL",
          "R19CQVNFX09SX0xPR0lOEOgHEhkKFFBLR19DT01QX0NMSUVOVF9JTkZPEOkH",
          "Eg4KCVBLR19IRUFSVBDqBxIVChBQS0dfSEVBUlRfUkVTVUxUEOsHEhoKFVBL",
          "R19BU0tfSURFTlRJRllfQ09ERRDsBxIcChdQS0dfQVNLX0lERU5USUZZX1JF",
          "U1VMVBDtBxIWChFQS0dfTk9USUZZX0NMSUVOVBDuBxIXChJQS0dfUkVHSVNU",
          "X0FDQ09VTlQQ7wcSFgoRUEtHX1JFR0lTVF9SRVNVTFQQ8AcSEwoOUEtHX0dB",
          "TUVfTE9HSU4Q8QcSGgoVUEtHX0dBTUVfTE9HSU5fUkVTVUxUEPIHEhoKFVBL",
          "R19TRVRfU0FGRV9RVUVTVElPThDzBxIVChBQS0dfQ0hBVF9NRVNTQUdFENAP",
          "EhMKDlBLR19RVUVTVF9MSVNUELgXEhUKEFBLR19RVUVTVF9BQ0NFUFQQuRcS",
          "EwoOUEtHX1FVRVNUX1NURVAQuhcSFQoQUEtHX1FVRVNUX0ZBSUxFRBC7FxIT",
          "Cg5QS0dfUVVFU1RfRE9ORRC8FxIWChFQS0dfUVVFU1RfSElTVE9SWRC9FxIS",
          "Cg1QS0dfSVRFTV9JTkZPEKAfEhIKDVBLR19JVEVNX0xJU1QQoR8SEQoMUEtH",
          "X0lURU1fQUREEKIfEhQKD1BLR19JVEVNX1JFTU9WRRCjHxIYChNQS0dfSVRF",
          "TV9DSEFOR0VfUE9TEKQfEhEKDFBLR19VU0VfSVRFTRClHxISCg1QS0dfQURE",
          "X1NLSUxMEJQjEhIKDVBLR19VU0VfU0tJTEwQlSMSEgoNUEtHX0RFTF9TS0lM",
          "TBCWIxIXChJQS0dfVEVBTV9BUFBMSUNBTlQQiCcSFAoPUEtHX1RFQU1fQ1JF",
          "QVRFEIknEhYKEVBLR19URUFNX0FERF9ST0xFEIonEhkKFFBLR19URUFNX1JF",
          "TU9WRV9ST0xFEIsnEhQKD1BLR19HVUlMRF9CRUdJThDwLhITCg5QS0dfR1VJ",
          "TERfTElTVBDxLhISCg1QS0dfUk9MRV9BVFRSENg2EhgKE1BLR19RVUVSWV9S",
          "T0xFX0xJU1QQ2TYSFwoSUEtHX1JPTEVfTElTVF9JTkZPENo2EhQKD1BLR19D",
          "UkVBVEVfUk9MRRDbNhISCg1QS0dfUk9MRV9JTkZPENw2EhsKFlBLR19DUkVB",
          "VEVfUk9MRV9SRVNVTFQQ3TYSFAoPUEtHX0RFTEVURV9ST0xFEN42EhQKD1BL",
          "R19TRUxFQ1RfUk9MRRDfNhIXChJQS0dfUk9MRV9CQVNFX0FUVFIQ4DYSIAob",
          "UEtHX1JPTEVfQ0hBTkdFX1NFQ09ORF9BVFRSEOE2EhMKDlBLR19FTlRFUl9H",
          "QU1FEMA+EhwKF1BLR19FTlRFUl9HQU1FX1JFU1BPTlNFEME+EhkKFFBLR19P",
          "VEhFUl9ST0xFX0VOVEVSEMI+EhcKElBLR19QTEFZRVJfQ29udHJvbBDDPhIT",
          "Cg5QS0dfTEVBVkVfR0FNRRDEPhIRCgxQS0dfTlBDX0lORk8QxT4SEwoOUEtH",
          "X0NIQU5HRV9NQVAQxj4SFAoPUEtHX0lURU1fT05fTUFQEMc+EhwKF1BLR19J",
          "VEVNX0RFU1RPUllfT05fTUFQEMg+EhEKDFBLR19OUENfREVBRBDJPhIVChBQ",
          "S0dfUElDS19VUF9JVEVNEMo+EhEKDFBLR19OUENfTU9WRRDLPhIUCg9QS0df",
          "QVRUQUNLX0lORk8QzD4SFgoRUEtHX0FUVEFDS19SRVNVTFQQzT4SGgoVUEtH",
          "X0RVUExJQ0FURV9ISVNUT1JZEKg/EhkKFFBLR19OUENfVEFSR0VUX0RFQlVH",
          "EKhGYgZwcm90bzM="));
    descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
        new pbr::FileDescriptor[] { },
        new pbr::GeneratedClrTypeInfo(new[] {typeof(global::CHATChannel), typeof(global::ItemContainerType), typeof(global::PKGTypeID), }, null));
  }
  #endregion

}
#region Enums
public enum CHATChannel {
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("CT_NORMAL")] CtNormal = 0,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("CT_TEAM")] CtTeam = 1,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("CT_GUILD")] CtGuild = 2,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("CT_WORLD")] CtWorld = 3,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("CT_PRIVATE")] CtPrivate = 4,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("CT_SYSTEM")] CtSystem = 5,
}

/// <summary>
///
/// </summary>
public enum ItemContainerType {
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("IC_BAG")] IcBag = 0,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("IC_Body")] IcBody = 1,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("IC_Fashion")] IcFashion = 2,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("IC_QuickItem")] IcQuickItem = 3,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("IC_OTHER")] IcOther = 4,
}

/// <summary>

/// </summary>
public enum PKGTypeID {
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_MESSAGE_BEGIN")] PkgServerMessageBegin = 0,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_HEART")] PkgServerHeart = 1,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_HEART_RETURN")] PkgServerHeartReturn = 2,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_REGIST_TYPE")] PkgServerRegistType = 3,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_REGIST_RESULT")] PkgServerRegistResult = 4,
  /// <summary>
  ///        
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_SHUTDOWN")] PkgServerShutdown = 5,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_PLAYER_DISCONNETION")] PkgServerPlayerDisconnetion = 6,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_ROLE_ATTR_CHANGE")] PkgServerRoleAttrChange = 7,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SERVER_MESSAGE_MAX")] PkgServerMessageMax = 999,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_BASE_OR_LOGIN")] PkgBaseOrLogin = 1000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_COMP_CLIENT_INFO")] PkgCompClientInfo = 1001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_HEART")] PkgHeart = 1002,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_HEART_RESULT")] PkgHeartResult = 1003,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ASK_IDENTIFY_CODE")] PkgAskIdentifyCode = 1004,
  /// <summary>
  /// 
  /// </summary>
  [pbr::OriginalName("PKG_ASK_IDENTIFY_RESULT")] PkgAskIdentifyResult = 1005,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_NOTIFY_CLIENT")] PkgNotifyClient = 1006,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_REGIST_ACCOUNT")] PkgRegistAccount = 1007,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_REGIST_RESULT")] PkgRegistResult = 1008,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_GAME_LOGIN")] PkgGameLogin = 1009,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_GAME_LOGIN_RESULT")] PkgGameLoginResult = 1010,
  /// <summary>
  /// 
  /// </summary>
  [pbr::OriginalName("PKG_SET_SAFE_QUESTION")] PkgSetSafeQuestion = 1011,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_CHAT_MESSAGE")] PkgChatMessage = 2000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUEST_LIST")] PkgQuestList = 3000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUEST_ACCEPT")] PkgQuestAccept = 3001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUEST_STEP")] PkgQuestStep = 3002,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUEST_FAILED")] PkgQuestFailed = 3003,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUEST_DONE")] PkgQuestDone = 3004,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUEST_HISTORY")] PkgQuestHistory = 3005,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_INFO")] PkgItemInfo = 4000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_LIST")] PkgItemList = 4001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_ADD")] PkgItemAdd = 4002,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_REMOVE")] PkgItemRemove = 4003,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_CHANGE_POS")] PkgItemChangePos = 4004,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_USE_ITEM")] PkgUseItem = 4005,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ADD_SKILL")] PkgAddSkill = 4500,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_USE_SKILL")] PkgUseSkill = 4501,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_DEL_SKILL")] PkgDelSkill = 4502,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_TEAM_APPLICANT")] PkgTeamApplicant = 5000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_TEAM_CREATE")] PkgTeamCreate = 5001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_TEAM_ADD_ROLE")] PkgTeamAddRole = 5002,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_TEAM_REMOVE_ROLE")] PkgTeamRemoveRole = 5003,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_GUILD_BEGIN")] PkgGuildBegin = 6000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_GUILD_LIST")] PkgGuildList = 6001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ROLE_ATTR")] PkgRoleAttr = 7000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_QUERY_ROLE_LIST")] PkgQueryRoleList = 7001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ROLE_LIST_INFO")] PkgRoleListInfo = 7002,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_CREATE_ROLE")] PkgCreateRole = 7003,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ROLE_INFO")] PkgRoleInfo = 7004,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_CREATE_ROLE_RESULT")] PkgCreateRoleResult = 7005,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_DELETE_ROLE")] PkgDeleteRole = 7006,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_SELECT_ROLE")] PkgSelectRole = 7007,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ROLE_BASE_ATTR")] PkgRoleBaseAttr = 7008,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ROLE_CHANGE_SECOND_ATTR")] PkgRoleChangeSecondAttr = 7009,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ENTER_GAME")] PkgEnterGame = 8000,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ENTER_GAME_RESPONSE")] PkgEnterGameResponse = 8001,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_OTHER_ROLE_ENTER")] PkgOtherRoleEnter = 8002,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_PLAYER_Control")] PkgPlayerControl = 8003,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_LEAVE_GAME")] PkgLeaveGame = 8004,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_NPC_INFO")] PkgNpcInfo = 8005,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_CHANGE_MAP")] PkgChangeMap = 8006,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_ON_MAP")] PkgItemOnMap = 8007,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ITEM_DESTORY_ON_MAP")] PkgItemDestoryOnMap = 8008,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_NPC_DEAD")] PkgNpcDead = 8009,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_PICK_UP_ITEM")] PkgPickUpItem = 8010,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_NPC_MOVE")] PkgNpcMove = 8011,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ATTACK_INFO")] PkgAttackInfo = 8012,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_ATTACK_RESULT")] PkgAttackResult = 8013,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_DUPLICATE_HISTORY")] PkgDuplicateHistory = 8104,
  /// <summary>
  ///
  /// </summary>
  [pbr::OriginalName("PKG_NPC_TARGET_DEBUG")] PkgNpcTargetDebug = 9000,
}

#endregion


#endregion Designer generated code
