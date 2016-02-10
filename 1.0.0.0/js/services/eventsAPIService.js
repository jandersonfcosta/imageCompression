/* global Firebase */
angular.module("imageCompression").service("eventsAPI", function($http, util)
{
	var fireBase = new Firebase('https://c1cf470c7b0241b1826c.firebaseio.com/');

	this.newEvent = function()
	{
		// retorna um objeto pré-definido para criação de um novo evento - template
		var newEvent =
		{
			"id": util.getGuid(),
			"name": "",
			"siteUrl": "",
			"subsites": false,
			"files":
			[
				{"name": "JPG", "active": false},
				{"name": "PNG", "active": false},
				{"name": "BMP", "active": false},
				{"name": "GIF", "active": false},
				{"name": "TIFF", "active": false}
			],
			"width": 1800,
			"weekDays":
			[
				{"name": "Seg", "active": false},
				{"name": "Ter", "active": false},
				{"name": "Qua", "active": false},
				{"name": "Qui", "active": false},
				{"name": "Sex", "active": false},
				{"name": "Sáb", "active": false},
				{"name": "Dom", "active": false}
			],
			"startTime": "",
			"active": true,
			"start": false,
			"running": false
		};
		
		return newEvent;
	};

	this.getEvents = function()
	{
		// lê o arquivo
		return $http.get("events.json");
	};

	// this.getEvents = function(success)
	// {
	// 	fireBase.on("value", function(data)
	// 	{
	// 		success(data.val());
	// 	});
	// };
		
	this.updateEvents = function(events)
	{
		// escreve o arquivo
		//...
	};
});
