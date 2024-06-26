/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.CHATChannel', null, global);
goog.exportSymbol('proto.ItemContainerType', null, global);
goog.exportSymbol('proto.PKGTypeID', null, global);
/**
 * @enum {number}
 */
proto.CHATChannel = {
  CT_NORMAL: 0,
  CT_TEAM: 1,
  CT_GUILD: 2,
  CT_WORLD: 3,
  CT_PRIVATE: 4,
  CT_SYSTEM: 5
};

/**
 * @enum {number}
 */
proto.ItemContainerType = {
  IC_BAG: 0,
  IC_BODY: 1,
  IC_FASHION: 2,
  IC_QUICKITEM: 3,
  IC_OTHER: 4
};

/**
 * @enum {number}
 */
proto.PKGTypeID = {
  PKG_SERVER_MESSAGE_BEGIN: 0,
  PKG_SERVER_HEART: 1,
  PKG_SERVER_HEART_RETURN: 2,
  PKG_SERVER_REGIST_TYPE: 3,
  PKG_SERVER_REGIST_RESULT: 4,
  PKG_SERVER_SHUTDOWN: 5,
  PKG_SERVER_PLAYER_DISCONNETION: 6,
  PKG_SERVER_ROLE_ATTR_CHANGE: 7,
  PKG_SERVER_MESSAGE_MAX: 999,
  PKG_BASE_OR_LOGIN: 1000,
  PKG_COMP_CLIENT_INFO: 1001,
  PKG_HEART: 1002,
  PKG_HEART_RESULT: 1003,
  PKG_ASK_IDENTIFY_CODE: 1004,
  PKG_ASK_IDENTIFY_RESULT: 1005,
  PKG_NOTIFY_CLIENT: 1006,
  PKG_REGIST_ACCOUNT: 1007,
  PKG_REGIST_RESULT: 1008,
  PKG_GAME_LOGIN: 1009,
  PKG_GAME_LOGIN_RESULT: 1010,
  PKG_SET_SAFE_QUESTION: 1011,
  PKG_CHAT_MESSAGE: 2000,
  PKG_QUEST_LIST: 3000,
  PKG_QUEST_ACCEPT: 3001,
  PKG_QUEST_STEP: 3002,
  PKG_QUEST_FAILED: 3003,
  PKG_QUEST_DONE: 3004,
  PKG_QUEST_HISTORY: 3005,
  PKG_ITEM_INFO: 4000,
  PKG_ITEM_LIST: 4001,
  PKG_ITEM_ADD: 4002,
  PKG_ITEM_REMOVE: 4003,
  PKG_ITEM_CHANGE_POS: 4004,
  PKG_USE_ITEM: 4005,
  PKG_ADD_SKILL: 4500,
  PKG_USE_SKILL: 4501,
  PKG_DEL_SKILL: 4502,
  PKG_TEAM_APPLICANT: 5000,
  PKG_TEAM_CREATE: 5001,
  PKG_TEAM_ADD_ROLE: 5002,
  PKG_TEAM_REMOVE_ROLE: 5003,
  PKG_GUILD_BEGIN: 6000,
  PKG_GUILD_LIST: 6001,
  PKG_ROLE_ATTR: 7000,
  PKG_QUERY_ROLE_LIST: 7001,
  PKG_ROLE_LIST_INFO: 7002,
  PKG_CREATE_ROLE: 7003,
  PKG_ROLE_INFO: 7004,
  PKG_CREATE_ROLE_RESULT: 7005,
  PKG_DELETE_ROLE: 7006,
  PKG_SELECT_ROLE: 7007,
  PKG_ROLE_BASE_ATTR: 7008,
  PKG_ROLE_CHANGE_SECOND_ATTR: 7009,
  PKG_ENTER_GAME: 8000,
  PKG_ENTER_GAME_RESPONSE: 8001,
  PKG_OTHER_ROLE_ENTER: 8002,
  PKG_PLAYER_CONTROL: 8003,
  PKG_LEAVE_GAME: 8004,
  PKG_NPC_INFO: 8005,
  PKG_CHANGE_MAP: 8006,
  PKG_ITEM_ON_MAP: 8007,
  PKG_ITEM_DESTORY_ON_MAP: 8008,
  PKG_NPC_DEAD: 8009,
  PKG_PICK_UP_ITEM: 8010,
  PKG_NPC_MOVE: 8011,
  PKG_ATTACK_INFO: 8012,
  PKG_ATTACK_RESULT: 8013,
  PKG_DUPLICATE_HISTORY: 8104,
  PKG_NPC_TARGET_DEBUG: 9000
};

goog.object.extend(exports, proto);
