const { Module } = require('../../Common/Module.js');

require('../../Common/CommonDefine.js')
require('../../Common/NetWork/NetPacket.js');

ModuleMain = Module.extend({
    ctor:function(solution){
        this._super(solution);
        this.Name = "ModuleMain";
    }
});

ModuleMain.prototype.OnInitialize = function()
{

};

ModuleMain.prototype.OnRelease = function(){};