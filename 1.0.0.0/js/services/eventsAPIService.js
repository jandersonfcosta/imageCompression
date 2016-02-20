/* global Firebase */
angular.module("main").service("eventsAPI", function($http, util)
{
	this.newEvent = function()
	{
		// retorna um objeto pré-definido para criação de um novo evento - template

		var newEvent =
		{
			"active": true,
			"id": util.getGuid(),
			"name": "",
			"siteUrl": "",
			"subsites": false,
			"files":
			[
				{"name": "JPG", "active": false},
				{"name": "PNG", "active": false},
				{"name": "BMP", "active": false}
			],
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
			"start": false,
			"running": false
		};

		return newEvent;
	};

	this.getEvents = function()
	{
		// lê o arquivo
		return $http.get("data/events.json");
	};

	this.updateEvents = function(events)
	{
		// escreve o arquivo

		// serializa e remove a chave $$hashKey que é gerada pelo angular
		events = JSON.stringify(events, function (key, val)
		{
			if (key == "$$hashKey")
			{
				return undefined;
			}

			return val;
		});

		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/eventsAPIService.aspx",
		data = "method=updateEvents&fileData=" + events,
		config =
		{
			headers:
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		};

		return $http.post(url, data, config);
	};
});
