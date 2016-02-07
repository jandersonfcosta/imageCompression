/*
	Criado por Janderson Costa em 26/01/2016.
*/


// EXECUÇÃO

_events.getEvents
({
	success: function(data)
	{
		// carrega os eventos na tela
		_events.loadEvents
		({
			events: data,
			complete: function()
			{
				// materialize - inicia os tooltips
				$('.tooltipped').tooltip();
			}
		});
	}
});


// FUNÇÕES

function guid()
{
	// retorna um guid - ex.: "6b52aa30-5e26-0726-903b-1d51e67cf958"

	function s4()
	{
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
