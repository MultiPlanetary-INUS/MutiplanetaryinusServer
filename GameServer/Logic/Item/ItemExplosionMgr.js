const { ExplosionRate } = require('../../Gen/Types');
var DataCenter = require('../../Gen/DataCenter.js').GetInstance();

ItemExplosionMgr = Class.extend({
    ctor:function()
    {
    }
})

ItemExplosionMgr.prototype.GetItemRate = function(ar, res)
{
    for(var i=0; i < ar.length; ++i)
    {
        this.GetExplosion(ar[i], res);
    }
}

ItemExplosionMgr.prototype.GetExplosion = function(id, res)
{
    var rate = DataCenter.GetItemExplosionRate(id);
    if(Verify(rate))
    {
        var RateSet=[rate.RateSet1, rate.RateSet2, rate.RateSet3];
        var RateValue=[rate.Rate1, rate.Rate2, rate.Rate3];

        for(var i = 0; i < RateValue.length; ++i)
        {
            if(GetRandom(0, 100) < RateValue[i])
            {
                var wc = 0;
                var rs  = RateSet[i];
                for(var n=0; n < rs.length; ++n)
                {
                    wc += rs[n].ItemWeight;
                }

                var w = GetRandom(0, wc);
                for(n=0; n < rs.length; ++n)
                {
                    if(w >= rs[n].ItemWeight)
                    {
                        w -= rs[n].ItemWeight
                    }
                    else
                    {
                        res.push(rs[n].ItemTypeID);
                        break;
                    }
                }
            }
        }
    }
}


var ThisInstance = null;
exports.GetInstance = function()
{
	if(!Verify(ThisInstance))
	{
		ThisInstance = new ItemExplosionMgr();
	}
	
	return ThisInstance;
};
