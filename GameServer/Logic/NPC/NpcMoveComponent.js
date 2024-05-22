const {Component, ComponentType} = require('../../../Common/Component');
var RedisMgr = require('../../../Common/DataBase/Redis/RedisMgr').GetInstance();
var fs = require('fs');
var Config = require('ini').parse(fs.readFileSync('../Config/Server.ini', 'utf-8'));
var DataCenter = require('../../Gen/DataCenter').GetInstance();
const { Vector3, Quaternion, Transform } = require('math3d');
require('../../../Common/Util/Util.js');

NpcMoveComponent = Component.extend({
    ctor:function()
    {
        this._super();
        this.nTypeID = ComponentType.ECT_MOVE_NPC;
        this.transform = new Transform(Vector3.zero, Quaternion.identity);
        this.MapId = 0;
        this.MoveSpeed = 0;
        this.state = 0;
        this.TargetPosition = Vector3.zero;
    }
})

NpcMoveComponent.prototype.SetMapID = function(id)
{
    this.MapId = id;
}

NpcMoveComponent.prototype.SetPosition = function(pos)
{
    this.transform.position = pos;
}

NpcMoveComponent.prototype.OnAttach = function()
{
}

NpcMoveComponent.prototype.OnDetach = function()
{
}

NpcMoveComponent.prototype.Distance = function(pos)
{
    var p1 = new Vector3(this.transform.position.x, 0, this.transform.position.z);
    var p2 = new Vector3(pos.x, 0, pos.z);
    return p1.distanceTo(p2);
}

NpcMoveComponent.prototype.OnUpdate = function(ms)
{
    if(this.MoveSpeed > 0)
    {
        if(!this.TargetPosition.equals(Vector3.zero) && this.Distance(this.TargetPosition) > 0.5)
        {
            var dir = this.TargetPosition.sub(this.transform.position).normalize();
            this.transform.rotation = Quaternion.Euler(0, LookRotation(dir), 0);
            
            var moveOffest = this.transform.forward.mulScalar(this.MoveSpeed * ms / 1000.0);

            this.transform.position = this.transform.position.add(moveOffest);
        }
        else
        {
            this.MoveSpeed = 0;
            this.state = -1;
        }

        var NMC = new proto.GamePKG.NpcMove();
        NMC.setPkgid(proto.PKGTypeID.PKG_NPC_MOVE);
        NMC.setNpcid(this.GetOwner().NpcID);
        NMC.setDirection(this.transform.rotation.eulerAngles.y);
        NMC.setState(this.state);
        NMC.setSpeed(this.MoveSpeed);
        NMC.setJump(false);
        NMC.setLbutton(false);
        NMC.setRbutton(false);
        NMC.setPosx(this.transform.position.x);
        NMC.setPosy(this.transform.position.y);
        NMC.setPosz(this.transform.position.z);
        if(Verify(this.GetOwner().Map))
            this.GetOwner().Map.NotifyAllPlayer(NMC);
    }
}

exports.NpcMoveComponent= NpcMoveComponent;