const { AddSkillCommand } = require('./AddSkillCommand.js');
const{LevelUp, SetLevel} = require('./GmCommand.js')
const{MakeCommand} = require('./MakeCommand')

GmCommandMgr = function()
{
    this.GMList = [];
}

GmCommandMgr.prototype.Init = function()
{
    this.GMList.push(new LevelUp())
    this.GMList.push(new SetLevel())
    this.GMList.push(new MakeCommand())
    this.GMList.push(new AddSkillCommand())
}


GmCommandMgr.prototype.Process = function(cstr, gm)
{
    for(var i=0; i < this.GMList.length; ++i)
    {
        if(this.GMList[i].DisearialStr(cstr))
        {
            return this.GMList[i].Execute(gm);
        }
    }
    return false;
}


var ThisInstance = null;

exports.GetInstance = function(){
	if(!Verify(ThisInstance)){
		ThisInstance = new GmCommandMgr();
        ThisInstance.Init();
	}
	
	return ThisInstance;
};
