<% Response.CacheControl = "no-cache"; %>
<%@ Page language="C#" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="Microsoft.SharePoint" %>

<script type="text/c#" runat="server">

/// EXECUÇÃO

protected override void OnLoad(EventArgs e)
{
	SPSecurity.RunWithElevatedPrivileges(delegate()
	{
		string method = Request["method"], data = "[]";

		try
		{
			if(method == "getSubSitesLength")
			{
				string parentSiteUrl = Request["parentSiteUrl"];
				data = GetSubSitesLength(parentSiteUrl).ToString();
			}
			
			if(method == "getSubSiteByIndex")
			{
				string parentSiteUrl = Request["parentSiteUrl"];
				int subSiteIndex = Convert.ToInt32(Request["subSiteIndex"]);
				data = GetSubSiteByIndex(parentSiteUrl, subSiteIndex);
			}

			if(method == "getSubSites")
			{
				string parentSiteUrl = Request["parentSiteUrl"];
				data = GetSubSites(parentSiteUrl);
			}
			
			if(method == "getSiteLibraries")
			{
				string siteUrl = Request["siteUrl"];
				data = GetSiteLibraries(siteUrl);
			}
			
			if(method == "getLibraryFiles")
			{
				string siteUrl = Request["siteUrl"];
				string listTitle = Request["listTitle"];
				data = GetLibraryFiles(siteUrl, listTitle);
			}
			
			Response.Write(data);
		}
		catch(Exception ex)
		{
			//string errorMsg = "{\"status\": \"error\", \"message\": \"" + ex.Message + "\"}";
			Response.Write(data);
		}
	});

	base.OnLoad(e);
}


/// MÉTODOS

protected int GetSubSitesLength(string parentSiteUrl)
{
	// retorna o total de sub-sites do site especificado

	using(SPSite site = new SPSite(parentSiteUrl))
	{
		using(SPWeb web = site.OpenWeb())
		{
			return web.Webs.Count;
		}
	}
}

protected string GetSubSiteByIndex(string parentSiteUrl, int subSiteIndex)
{
	ArrayList items = new ArrayList();

	using(SPSite site = new SPSite(parentSiteUrl))
	{
		using(SPWeb web = site.OpenWeb())
		{
			SPWeb subSite = web.Webs[subSiteIndex];

			if(!subSite.IsRootWeb)
			{
				ArrayList item = new ArrayList();
				item.Add(subSite.ID);
				item.Add(subSite.Name);
				item.Add(subSite.Url);
				items.Add(item);
			}
		}
	}

	string[] keys = {"id", "name", "url"};
	string jsonData = ParseJson(items, keys);
	return jsonData;
}

protected string GetSubSites(string parentSiteUrl)
{
	ArrayList items = new ArrayList();

	using(SPSite site = new SPSite(parentSiteUrl))
	{
		using(SPWeb _web = site.OpenWeb())
		{
			foreach(SPWeb web in _web.Webs)
			{
				// qualquer site abaixo de http://portalclemar/, http://portalclemar/pwa/ e http://portalclemar/pwa2015/
				if(!web.IsRootWeb)
				{
					ArrayList item = new ArrayList();
					item.Add(web.ID);
					item.Add(web.Name);
					item.Add(web.Url);
					items.Add(item);
				}
			}
		}
	}

	string[] keys = {"id", "name", "url"};
	string jsonData = ParseJson(items, keys);
	return jsonData;
}

protected string GetSiteLibraries(string siteUrl)
{
	ArrayList items = new ArrayList();

	using(SPSite site = new SPSite(siteUrl))
	{
		using(SPWeb web = site.OpenWeb())
		{
			if(!web.IsRootWeb)
			{
				foreach(SPList list in web.Lists)
				{
					if (list.BaseType == SPBaseType.DocumentLibrary && list.BaseTemplate == SPListTemplateType.DocumentLibrary)
					{
						SPDocumentLibrary docLibrary = (SPDocumentLibrary)list;

						if (!docLibrary.IsCatalog)
						{
							ArrayList item = new ArrayList();
							item.Add(list.ID);
							item.Add(list.Title);
							items.Add(item);
						}
					}
				}
			}
		}
	}

	string[] keys = {"id", "title"};
	string jsonData = ParseJson(items, keys);
	return jsonData;
}

protected string GetLibraryFiles(string siteUrl, string listTitle)
{
	ArrayList files = new ArrayList();

	using(SPSite site = new SPSite(siteUrl))
	{
		using(SPWeb web = site.OpenWeb())
		{
			if(!web.IsRootWeb)
			{
				SPList list = web.Lists[listTitle];
				SPQuery query = new SPQuery();
				query.Query =
				"<Where>" +
					"<Eq><FieldRef Name='ContentType'/><Value Type='Text'>Documento</Value></Eq>" +
				"</Where>";
				SPListItemCollection items = list.GetItems(query);

				foreach (SPListItem item in items)
				{
					ArrayList file = new ArrayList();
					file.Add(item["ID"]);
					file.Add(Server.UrlDecode(item["EncodedAbsUrl"].ToString()));
					file.Add(item["LinkFilename"]);
					file.Add(item["File_x0020_Type"]);
					file.Add((Convert.ToDouble(item["FileSizeDisplay"])/1024).ToString());
					files.Add(file);
				}
			}
		}
	}

	string[] keys = {"id", "url", "fileName", "type", "sizeKb"};
	string jsonData = ParseJson(files, keys);
	return jsonData;
}

protected string ParseJson(ArrayList dataSet, string[] keys)
{
	string json = "[";

	foreach(ArrayList item in dataSet)
	{
		json += "{";

		for(int i = 0; i < item.Count; i++)
		{
			string key = keys[i];
			string value = item[i].ToString().Replace("\'", "").Replace("\"", "").Replace(System.Environment.NewLine, "");

			json += "\"" + key + "\":\"" + value + "\",";
		}

		json = json.TrimEnd(',');
		json += "},";
	}

	json = json.TrimEnd(',');
	json += "]";

	return json;
}

</script>
