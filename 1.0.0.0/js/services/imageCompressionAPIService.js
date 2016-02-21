/* global angular */
angular.module("main").service("imageCompressionAPI", function($http, sharePointAPI)
{
	var _postConfig =
	{
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	};
	
	this.compressImages = function(event) {
		getAllSubsites(event.siteUrl, function (sites) {
			console.log(sites);
		});
	}

	function getAllSubsites(siteUrl, complete) {
		var sites = [];
		
		function get(siteUrl) {
			sharePointAPI.getSubsites(siteUrl).then(function (response)
			{
				for(var i in response.data) {
					var site = response.data[i];
					sites.push(site);
					
					if(Number(site.subsites) > 0) {
						get(site.url);
					}
				}
			});
			
			complete(sites);
		}
	};

	this.compressImage = function(args) {
		// http://portalclemar/_dev/app/imageCompression/1.0.0.0/services/imageCompressionAPIService.aspx?method=compressImage&siteUrl=http://portalclemar/SiteLab1&listTitle=Documentos&itemId=300

		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/imageCompressionAPIService.aspx",
		data = "method=compressImage&siteUrl=" + args.siteUrl + "&listTitle=" + args.listTitle + "&itemId=" + args.itemId;

		return $http.post(url, data, _postConfig);
	};

/*
	sharePointAPI.getSubsitesLength("http://portalclemar")
	.then(function (response)
	{
		// success
		//console.log(response.data);
	}, function ()
	{
		// error
	});

	sharePointAPI.getSubsiteByIndex("http://portalclemar", 1)
	.then(function (response)
	{
		// success
		//console.log(response.data[0]);
	}, function ()
	{
		// error
	});

	// (não usar)
	sharePointAPI.getSubsites("http://portalclemar")
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

/*
this.compressImages = function(event)
	{
		var subsiteUrl, subsiteIndex = 0;
		var h = [{site: event.siteUrl, parent: null, subsites: null, compress: true}];
		compress(event.siteUrl, 0);

		function compress(siteUrl, subsiteIndex)
		{
			// comprime
			compressSiteImages(siteUrl, function()
			{
				if(event.subsites)
				{
					// subsite
					sharePointAPI.getSubsiteByIndex(siteUrl, subsiteIndex).then(function (response)
					{
						if(response.data.length > 0)
						{
							subsiteIndex = 0;
							subsiteUrl = response.data[0].url;
							h.push({site: subsiteUrl, parent: siteUrl, subsites: response.data[0].subsites, compress: true});
							
							compress(subsiteUrl);
						}
						else
						{
							var parentSite = getParentSite(siteUrl).parent;
							subsiteIndex++;

							// subsite
							sharePointAPI.getSubsiteByIndex(parentSite, subsiteIndex).then(function (response)
							{
								if(response.data.length > 0)
								{
									subsiteUrl = response.data[0].url;
									h.push({site: subsiteUrl, parent: parentSite, subsites: response.data[0].subsites, compress: true});
									
									compress(subsiteUrl);
								}
								else
								{
									parentSite = getParentSite(getParentSite(siteUrl).parent);
									subsiteIndex = 0;
									h.push({site: subsiteUrl, parent: parentSite, subsites: response.data[0].subsites, compress: true});//
									
									compress(subsiteUrl);
								}
							});
						}
					});
				}
			});
		}
		
		function getParentSite(siteUrl)
		{
			return h.filter(function(el)
			{
				return el.site == siteUrl;
			});
		}
	};
*/
