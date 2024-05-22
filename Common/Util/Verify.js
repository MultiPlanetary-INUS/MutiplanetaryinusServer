var StrFilter = {filter:function(str){return true;}};

(function() {
	Verify = function(value) 
	{
		if (null == value || typeof (value) == 'undefined') 
		{
			return false;
		}
		return true;
	};
	
	//检查字符串中是否含有非法字符
	VerifyString = function(str, pattern)
	{
		pattern = pattern || /(\w|([\u4e00-\u9fa5]))+$/;
		var result = pattern.exec(str);	
		if(result == null || StrFilter.filter(str))
		{
			return false;
		}
		
		return true;
	};
	
	//检查一个值是否在一个数组中
	CheckValueInArray = function(value, array)
	{
		var i = array.length;
		while(i--)
		{
			if(value == array[i])
			{
				return true;
			}
		}
		return false;
	};

	// 判断给定的时间是否属于今天,beginTime,为一天的开始时间,默认为0点
	TimeIsToday = function(time, beginTime) 
	{
		beginTime = beginTime || 0;
		var now = new Date;
		var hour = now.getHours();
		if(hour < beginTime)
		{
			hour += 24 - beginTime;
		}
		else
		{
			hour -= beginTime;
		}
		var minute = now.getMinutes();
		var second = now.getSeconds();
		var ms = now.getMilliseconds();
		var value = ms + second * 1000 + minute * 60 * 1000 + hour * 60 * 60 * 1000;
		return (now.getTime() - time) < value;
	};

	// 判断一个对象是否为空
	IsEmptyObject = function(obj)
	{
		for ( var i in obj) 
		{
			return false;
		}
		return true;
	};
	
	//判断一个对象是否为字符串
	IsString = function(obj)
	{
		return typeof obj === 'string' && Object.prototype.toString.call(obj) === '[object String]';
	};
	
	//判断一个对象是否为数字
	IsNumber = function(obj)
	{
		return typeof obj === 'number' && Object.prototype.toString.call(obj) === '[object Number]';
	};
	
	//判断一个对象是否为布尔值
	IsBoolean = function(obj)
	{
		return typeof obj === 'boolean' && Object.prototype.toString.call(obj) === '[object Boolean]';
	};

	IsNumberArray = function(arr)
	{
		return Array.isArray(arr) && arr.every(IsNumber);
	}

	VerifyEmail = function(str)
	{
		var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		return reg.test(str);
	}

	VerifyPassword = function(str)
	{
		var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
		return reg.test(str);
	}

})();
