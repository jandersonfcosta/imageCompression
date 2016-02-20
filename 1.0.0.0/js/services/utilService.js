angular.module("main").service("util", function($mdToast)
{
	this.getGuid = function()
	{
		// retorna um guid - ex.: "6b52aa30-5e26-0726-903b-1d51e67cf958"

		function s4()
		{
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};

	// não usado
	this.getTimes = function (minInterval)
	{
		// retorna um array de horários para uso em seletores - ex.: minInterval = 15 => ["00:00", "00:15", "00:30", "00:45", "01:00",...]

		var times = [];

		for(var h = 0; h < 24; h++)
		{
			var _h = h < 10 ? "0" + h : h;

			for(var m = 0; m < (60 / minInterval); m++)
			{
				var _m = m * minInterval;
				_m = _m < 10 ? "0" + _m : _m;

				times.push(_h + ":" + _m);
			}
		}
		
		return times;
	};
	
	// toast
	this.toast = function (message)
	{
		$mdToast.show
		(
			$mdToast
			.simple()
			.textContent(message)
			.position("top right")
			.hideDelay(3000)
		);
	};
});