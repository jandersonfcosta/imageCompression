angular.module("main", ["ngMaterial", "ngMessages"]);
angular.module("main").controller("mainCtrl", function($scope, $mdDialog, $mdToast, eventsAPI, imageCompressionAPI, util)
{
	$scope.events = [];

	// inicia o evento
	$scope.startEvent = function(event)
	{
		imageCompressionAPI.compressImages(event);
	};

	// carrega os eventos na tela
	eventsAPI.getEvents()
	.then(function (response)
	{
		// success
		if(response.data.length > 0)
		{
			$scope.events = response.data;
		}
	}, function ()
	{
		// error
		alert("Erro ao carregar os eventos.");
		location.reload();
	});

	// editar
	$scope.editEvent = function(event)
	{
		$scope.edit = true;
		$scope.eventFormIsValid = true;
		$scope.formData = angular.copy(event);
	};

	// salvar
	$scope.saveEvent = function(event)
	{
		updateEvents(event, "Evento atualizado.");
		$scope.edit = false;
	};

	// fechar
	$scope.closeEvent = function()
	{
		$scope.edit = false;
	};

	// novo evento
	$scope.createEvent = function(ev, mode, event)
	{
		var newEvent = eventsAPI.newEvent();	

		$mdDialog.show
		({
			controller: DialogController,
			templateUrl: "view/templates/newEventDialog.html?rev=" + Math.random().toString(36).slice(2),// impede o carregamento a partir do cache
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		});

		function DialogController($scope, $mdDialog)
		{
			$scope.event = angular.copy(newEvent);

			$scope.save = function(event)
			{
				updateEvents(event, "Evento criado.");
				$mdDialog.hide();
			};

			$scope.cancel = function()
			{
				$mdDialog.cancel();
			};
		}
	};

	// ativa/desativa o evento
	$scope.activeEvent = function(event)
	{
		var message = event.active ? "Evento ativado." : "Evento desativado.";
		_updateEvents(message);
	};

	// atualiza o arquivo json no servidor
	function _updateEvents(message)
	{
		eventsAPI.updateEvents($scope.events)
		.then(function ()
		{
			// success
			util.toast(message);
		}, function ()
		{
			// error
			alert("Erro ao enviar os dados.");
			location.reload();
		});
	}

	// atualiza os eventos
	function updateEvents(event, message)
	{
		var exist = false;

		$scope.events.filter(function(el, index)
		{
			if(el.id == event.id)
			{
				exist = true;

				// atualiza o evento na coleção
				$scope.events.splice(index, 1, event);
			}
		});

		if(!exist)
		{
			// adiciona o novo evento na coleção
			$scope.events.push(event);
		}
			
		_updateEvents(message);
	}

	// deleta o evento
	$scope.deleteEvent = function(event)
	{
		var confirm = $mdDialog.confirm()
		.title("Excluir " + event.name + "?")
		.textContent("")
		.ok("OK")
		.cancel("Cancelar");

		// confirmação
		$mdDialog.show(confirm).then(function()
		{
			// ok
			$scope.events = $scope.events.filter(function(el, index)
			{
				return el.id != event.id;
			});

			$scope.closeEvent();
			_updateEvents("Evento excluído.");
			
		}, function()
		{
			// cancel
			$mdDialog.hide();
		});
	};

	// duplica o evento
	$scope.duplicateEvent = function(event)
	{
		event.id = util.getGuid();

		// adiciona o novo evento na coleção
		$scope.events.push(event);
		$scope.closeEvent();
		_updateEvents("Evento duplicado.");
	};

	// valida o preenchimento dos campos
	$scope.validateForm = function(eventFormIsValid)
	{
		var event = $scope.formData, files = true, weekDays = true;

		if(event.start)
		{
			// arquivos - pelo menos um deve estar selecionado quando Execução também está selecionado
			files = event.files.some(function(obj)
			{
				return obj.active;
			});

			// dias da semana - pelo menos um deve estar selecionado quando Execução também está selecionado
			weekDays = event.weekDays.some(function(obj)
			{
				return obj.active;
			});
		}

		$scope.eventFormIsValid = eventFormIsValid && files && weekDays;
	};
})
.config(function($mdThemingProvider)
{
	// tema
	$mdThemingProvider.theme("default")
	.primaryPalette("green", { "default": "600" })
	.accentPalette("blue", { "default": "600" });
});
