
const { Solution } = require('./Solutions.js')

var EventCenter = require('./EventCenter.js').GetInstance();

(function () {
    BIND_PKG_HANDLER = function (id, obj, funcName) {
        EventCenter.RegisterEvent(id, obj, funcName)
    }

    SERVER_INTERVAL_TIME = 50         //
    TIME_INTERVAL_CHECK = 20 * 1000  //
    TIME_INTERVAL_CHECK_OUT = 60 * 1000  //
    RESEND_IDENTIFY_TIME = 30 * 1000  //
    IDENTIFY_TIME_OUT = 120 * 1000 //
    GAME_VERSION = 100        //

    SERVER_TYPE_MANAGER = 0
    SERVER_TYPE_GATE = 1
    SERVER_TYPE_GAME = 2

    MSG_ID_BY_MODULE_SIZE = 1000
    GAMESERVER_MODULE_LOGIN = 1  //
    GAMESERVER_MODULE_CHAT = 2  //
    GAMESERVER_MODULE_QUEST = 3  //
    GAMESERVER_MODULE_ITEM = 4  //
    GAMESERVER_MODULE_RELATION = 5  //
    GAMESERVER_MODULE_GUILD = 6  //
    GAMESERVER_MODULE_ROLE = 7  //
    GAMESERVER_MODULE_MAP = 8  //

    UNKNOW_ERROR = -1   //
    SUCCESS = 0    //
    EMAIL_ADDRESS_ERROR = 1    //
    IDENTFY_TIME_TO_SHORT = 2    //
    SERVER_MODULE_NO_READY = 3    //
    GAME_VERSION_ERROR = 4    //
    PASSWORD_ERROR = 5    //
    ACCOUNT_EXISTS = 6    //
    IDENTIFYCODE_WRONG = 7    //
    ROLE_NAME_EXISTS = 8    //
    ACCOUNT_OR_PASSWORD_ERROR = 9    //


    ROLE_RUN_SPEED = 4
    ROLE_WALK_SPEED = 2


    MAX_TEAM_MEMBER = 5

    G_SOLUTION = null

    MAX_TIME_FOR_ITEM_ON_MAP = 300

})()