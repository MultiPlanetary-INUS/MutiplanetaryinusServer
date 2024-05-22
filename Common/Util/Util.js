const { Quaternion, Vector3 } = require("math3d");

(function(){
	//获取时间的字符串
	GetTimeStringByDate = function(date, sign)
	{
		var str = "";
		str = date.getSeconds() + str;
		str = date.getMinutes() + sign + str;
		str = date.getHours() + sign + str;
		return str;
	};
	
	GetDateStringByDate = function(date, sign)
	{
		var str = "";
		str = date.getDate() + str;
		str = (date.getMonth() + 1) + sign + str;
		str = date.getFullYear() + sign + str;
		return str;
	};
	
	GetRandom = function(start,end)
	{
		return start+Math.random()*(end-start);
	};
	
	GetRandomINT = function(start, end)
	{
		return Math.floor(GetRandom(start, end));
	};
	
	FindValueInArray = function(value, array)
	{
		var i = array.length;
		while(i--){
			if(array[i] == value)
				return true;
		}
		return false;
	};

	Sleep = function(ms)
	{
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
	}

	DoublesEqual = function(d1, d2)
	{
		var preciseness = 1e-13;
		return Math.abs(d1-d2) < preciseness;
	}

	ArraysEqual = function(a, b)
	{
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		for (var i = 0; i < a.length; ++i)
		{
			if (isNumber(a[i]) && isNumber(b[i]))
			{
				if (!doublesEqual(a[i], b[i]))
					return false;
			} 
			else if (a[i] !== b[i])
				return false;
		}
		return true;
	}

	MagnitudeOf = function(values)
	{
		var result = 0;
		for(var i=0; i < values.length; ++i)
			result += values[i] * values[i];
		
		return Math.sqrt(result);
	}

	GetDateTimeFromLong = function(lvalue)
	{
		var res={};
		res.seconds = lvalue % 100;
		res.minutes = Math.floor(lvalue % 10000 / 100);
		res.hours = Math.floor(lvalue % 1000000 / 10000);
		res.day = Math.floor(lvalue % 100000000 / 1000000);
		res.month = Math.floor(lvalue % 10000000000 / 100000000);
		res.year = Math.floor(lvalue % 100000000000000 / 10000000000);

		return res;
	}

	//判断两个时间是否为同一周, 周一为每周第一天
	IsSameWeek = function(old, now)
	{
		var oneDay = 1000 * 60 * 60 * 24;
		var oldday = parseInt(old.getTime() / oneDay);
		var nowday = parseInt(now.getTime() / oneDay);
		return parseInt((oldday + 4) / 7) == parseInt((nowday + 4) / 7);
	}

	//求向量的水平旋转角度
	LookRotation = function(dir)
	{
		var f = Math.atan2(dir.x, dir.z);
		f *= 57.29578;
		if(f < 0) f += 180;
		if(dir.x < 0) f += 180;
		
		return f;
	}
	
})();
