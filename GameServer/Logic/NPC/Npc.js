const { Vector3 } = require('math3d');
const { ComponentType } = require('../../../Common/Component');
const { GameObject, GameObjectType } = require('../../../Common/GameObject');


Npc = GameObject.extend({
    ctor:function(nat)
    {
        this._super();
        this.ObjType = GameObjectType.GOT_NPC;
        this.NpcID = nat.ID;
        this.NPCAttr = nat;
        this.Map = null;
        this.ObjID = this.NpcID;
    }
})

Npc.prototype.ToNetPKg = function()
{
    var ni = new proto.GamePKG.NpcInfo();
    ni.setPkgid(proto.PKGTypeID.PKG_NPC_INFO);
    ni.setNpcid(this.NpcID);
    ni.setDefid(this.NPCAttr.ID)
    var mc = this.GetComponent(ComponentType.ECT_MOVE);
    if(Verify(mc))
    {
        ni.setPosx(mc.transform.position.x);
        ni.setPosy(mc.transform.position.y);
        ni.setPosz(mc.transform.position.z);
        ni.setDirection(mc.transform.rotation.eulerAngles.y)
        ni.setSpeed(mc.MoveSpeed);
    }
    var ac = this.GetComponent(ComponentType.ECT_ATTR);
    if(Verify(ac))
    {
        ni.setLife(ac.GetHP())
    }
    return ni;
}

exports.Npc = Npc;

