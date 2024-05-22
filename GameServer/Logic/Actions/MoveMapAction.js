const { Vector3 } = require("math3d");
const { ComponentType } = require("../../../Common/Component.js");
const{AttrType} = require("../../Gen/Types.js")
require('./Action.js')
var SceneMgr = require('../../Logic/Map/SceneMgr').GetInstance();

MoveMapAction = ActionBase.extend({
    ctor:function(cf)
    {
        this._super(cf);
    }
})

MoveMapAction.prototype.Execute = function(pl)
{
    if(Verify(pl))
    {
        var mvc = pl.GetComponent(ComponentType.ECT_MOVE);
        if(Verify(mvc))
        {
            var map = SceneMgr.TryGetMap(mvc.MapId, pl);
            var newmap = SceneMgr.TryGetMap(this.Param1, pl);
            if(Verify(map) && Verify(newmap) && map != newmap)
            {
                mvc.SetMapID(this.Param1);
                mvc.SetPosition(new Vector3(this.Param2, -1.0, this.Param3));
            }
        }
    }
    return false;
}

exports.MoveMapAction = MoveMapAction;