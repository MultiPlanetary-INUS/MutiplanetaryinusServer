require('./GameObject.js')
require('./Util/Verify.js')


ComponentType = {
	ECT_NONE: 0,
	ECT_ATTR: 1,    	//
	ECT_VISUAL: 2,    	//
	ECT_MOVE: 3,    	//
	ECT_ITEMMGR: 4,    	//
	ECT_SKILLMGR: 5,    //
	ECT_QUESTMGR: 6,    //
	ECT_PLAYERMGR: 7,	//
	ECT_STORAGE: 8,		//
	ECT_HISTORY: 9,		//
	ECT_TRIGGERMGR: 10,	//
	ECT_NPCMGR: 11,		//
	ECT_AI: 12,			//
	ECT_COMBAT: 13,		//
	ECT_BUFFERMGR: 14,	//

	ECT_ATTR_ROLE: ((1 << 8) + 0),		//
	ECT_ATTR_NPC: ((1 << 8) + 1),		//

	ECT_MOVE_ROLE: (3 << 8) + 0,			//
	ECT_MOVE_NPC: (3 << 8) + 1,			//

	ECT_PLAYER_ITEM_MGR: (4 << 8) + 0,	//
	ECT_NPC_ITEM_MGR: (4 << 8) + 1,		//
	ECT_MAP_ITEM_MGR: (4 << 8) + 2,		//

	ECT_SKILL_MANAGER: (5 << 8) + 0,		//

	ECT_PLAYER_QUEST_MGR: (6 << 8) + 0,	//

	ECT_MAP_PLAYER_MGR: (7 << 8) + 0, 	//

	ECT_ITEM_STORAGE: (8 << 8) + 0,		//
	ECT_QUEST_STORAGE: (8 << 8) + 1,		//

	ECT_PLAYER_HISTORY: (9 << 8) + 0,	//

	ECT_PLAYER_TRIGGER_MGR: (10 << 8) + 0, //

	ECT_MAP_NPC_MGR: (11 << 8) + 0,		//

	ECT_NPC_AI_NORMAL: (12 << 8) + 0,	//

	ECT_COMBAT_BASE: (13 << 8) + 0,		//

	ECT_BUFFER_MANAGER: (14 << 8) + 0,	//
}

Component = GameObject.extend({
	ctor: function () {
		this._super()
		this.objOwner = null

		this.nTypeID = ComponentType.ECT_NONE
	}
})

Component.prototype.GetTypeID = function () {
	return this.nTypeID >> 8
}

Component.prototype.OnAttach = function () { }

Component.prototype.OnDetach = function () { }

Component.prototype.Notify = function () { }

Component.prototype.SaveToRedis = function () { }
Component.prototype.ReadFromRedis = function () { }

Component.prototype.GetOwner = function () {
	return this.objOwner
}

Component.prototype.SetOwner = function (obj) {
	if (Verify(this.objOwner)) {
		this.OnDetach()
	}

	this.objOwner = obj

	if (Verify(this.objOwner)) {
		this.OnAttach()
	}
}

Component.prototype.OnUpdate = function (ms) { }

exports.Component = Component
exports.ComponentType = ComponentType;

