/* global eventFormHiddenPlace, eventForm */

angular.module("imageShrink", ["ngMaterial", "ngMessages"])
.controller("imageShrinkCtrl", function($scope, $mdDialog, $mdToast, eventsAPI, util)
{
	// carrega os eventos na tela
	eventsAPI.getEvents().success(function(response)
	{
		$scope.events = response;
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
		updateEvents(event);
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
				updateEvents(event);
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
		$scope.events.filter(function(el, index)
		{
			if(el.id == event.id)
			{
				// atualiza o evento na coleção
				el.active = event.active;
			}
		});

		_updateEvents();
	};

	// atualiza o arquivo json no servidor
	function _updateEvents()
	{
		eventsAPI.updateEvents($scope.events);
	}

	// atualiza os eventos
	function updateEvents(event)
	{
		var exist = false, message;

		$scope.events.filter(function(el, index)
		{
			if(el.id == event.id)
			{
				exist = true;

				// atualiza o evento na coleção
				$scope.events.splice(index, 1, event);
				message = "Evento atualizado.";
			}
		});
		
		if(!exist)
		{
			// adiciona o novo evento na coleção
			$scope.events.push(event);
			message = "Evento criado.";
		}
			
		_updateEvents();
		toast(message);
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

			_updateEvents();
			$scope.closeEvent();
			toast("Evento excluído.");
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
		toast("Evento duplicado.");
	};
	
	// toast
	function toast(message)
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
