/* global Firebase */
angular.module("main").service("sharePointAPI", function($http)
{
	var _postConfig =
	{
		headers:
		{
			"Content-Type": "application/x-www-form-urlencoded"
		}
	};

	this.getSubSitesLength = function(parentSiteUrl)
	{
		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
		data = "method=getSubSitesLength&parentSiteUrl=" + parentSiteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getSubSiteByIndex = function(parentSiteUrl, subSiteIndex)
	{
		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
		data = "method=getSubSiteByIndex&parentSiteUrl=" + parentSiteUrl + "&subSiteIndex=" + subSiteIndex;

		return $http.post(url, data, _postConfig);
	};

	this.getSubSites = function(parentSiteUrl)
	{
		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
		data = "method=getSubSites&parentSiteUrl=" + parentSiteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getSiteLibraries = function(siteUrl)
	{
		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
		data = "method=getSiteLibraries&siteUrl=" + siteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getLibraryFiles = function(siteUrl, listTitle)
	{
		var
		url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
		data = "method=getLibraryFiles&siteUrl=" + siteUrl + "&listTitle=" + listTitle;

		return $http.post(url, data, _postConfig);
	};
});
