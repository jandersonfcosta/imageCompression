angular.module("main").service("sharePointAPI", function ($http) {
	var _postConfig = {
		headers:
		{
			"Content-Type": "application/x-www-form-urlencoded"
		}
	};

	this.getSiteInfo = function (siteUrl) {
		var
			url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
			data = "method=getSiteInfo&siteUrl=" + siteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getSubsitesLength = function (parentSiteUrl) {
		var
			url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
			data = "method=getSubsitesLength&parentSiteUrl=" + parentSiteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getSubsiteByIndex = function (parentSiteUrl, subSiteIndex) {
		var
			url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
			data = "method=getSubsiteByIndex&parentSiteUrl=" + parentSiteUrl + "&subSiteIndex=" + subSiteIndex;

		return $http.post(url, data, _postConfig);
	};

	this.getSubsites = function (parentSiteUrl) {
		var
			url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
			data = "method=getSubsites&parentSiteUrl=" + parentSiteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getSiteLibraries = function (siteUrl) {
		var
			url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
			data = "method=getSiteLibraries&siteUrl=" + siteUrl;

		return $http.post(url, data, _postConfig);
	};

	this.getLibraryFiles = function (siteUrl, listTitle) {
		var
			url = "/_dev/app/imageCompression/1.0.0.0/services/sharePointAPIService.aspx",
			data = "method=getLibraryFiles&siteUrl=" + siteUrl + "&listTitle=" + listTitle;

		return $http.post(url, data, _postConfig);
	};
});
