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
		string method = Request["method"];
		string fileData = Request["fileData"];
		
		if(method == "updateEvents")
		{
			string result = UpdateEvents(fileData);
			Response.Write(result);
		}
	});

	base.OnLoad(e);
}


/// MÉTODOS

protected string UpdateEvents(string fileData)
{
	string fileUri = "http://localhost/_dev/app/imageCompression/1.0.0.0/data/events.json";
	return WriteDataFile(fileUri, fileData);
}

protected string WriteDataFile(string fileUri, string fileData)
{
	WebResponse response = null;

	try
	{
		WebRequest request = WebRequest.Create(fileUri);
		request.Credentials = CredentialCache.DefaultCredentials;
		request.Method = "PUT";
		byte[] bytes = Encoding.UTF8.GetBytes(fileData);

		using (Stream stream = request.GetRequestStream())
		{
			foreach (byte _byte in bytes)
			{
				stream.WriteByte(_byte);
			}
		}

		response = request.GetResponse();
		return "success";
	}
	catch (Exception ex)
	{
		return "error: " + ex.Message;
	}
	finally
	{
		response.Close();
	}
}

</script>
