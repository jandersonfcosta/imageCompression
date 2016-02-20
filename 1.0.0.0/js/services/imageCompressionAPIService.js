/* global Firebase */
angular.module("main").service("imageCompressionAPI", function($http, sharePointAPI)
{
	var _postConfig =
	{
		headers:
		{
			"Content-Type": "application/x-www-form-urlencoded"
		}
	};
	
	this.compressImages = function(event)
	{
		sharePointAPI.getSiteLibraries(event.siteUrl).then(function (response)
		{
			var
			libs = response.data,
			lib = libs[]
			

			if(libs.length > 0)
			{
				var lib = response.data[0];

				sharePointAPI.getLibraryFiles(event.siteUrl, lib.title).then(function (response)
				{
					console.log(response.data);
				});
			}
		});
	};




	this.compressImage = function(args)
	{
		// http://portalclemar/_dev/app/imageCompression/1.0.0.0/services/imageCompressionAPIService.aspx?method=compressImage&siteUrl=http://portalclemar/SiteLab1&listTitle=Documentos&itemId=300

		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/imageCompressionAPIService.aspx",
		data = "method=compressImage&siteUrl=" + args.siteUrl + "&listTitle=" + args.listTitle + "&itemId=" + args.itemId;

		return $http.post(url, data, _postConfig);
	};

/*
	sharePointAPI.getSubSitesLength("http://portalclemar")
	.then(function (response)
	{
		// success
		//console.log(response.data);
	}, function ()
	{
		// error
	});

	sharePointAPI.getSubSiteByIndex("http://portalclemar", 1)
	.then(function (response)
	{
		// success
		//console.log(response.data[0]);
	}, function ()
	{
		// error
	});

	sharePointAPI.getSubSites("http://portalclemar")
	.then(function (response)
	{
		// success
		//console.log(response.data);
	}, function ()
	{
		// error
	});

	sharePointAPI.getSiteLibraries("http://portalclemar/docs")
	.then(function (response)
	{
		// success
		//console.log(response.data);
	}, function ()
	{
		// error
	});
	
	sharePointAPI.getLibraryFiles("http://portalclemar/sitelab1", "Documentos")
	.then(function (response)
	{
		// success
		//console.log(response.data);
	}, function ()
	{
		// error
	});
*/
});
