<% Response.CacheControl = "no-cache"; %>
<%@ Page language="C#" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Collections" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Import Namespace="System.Drawing" %>
<%@ Import Namespace="System.Drawing.Imaging" %>
<%@ Import Namespace="System.Drawing.Drawing2D" %>

<script type="text/c#" runat="server">  

// VARIÁVEIS GLOBAIS

/*

!!!!!
API WEB WORKER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

*/

// EXECUÇÃO

protected override void OnLoad(EventArgs e)
{
	SPSecurity.RunWithElevatedPrivileges(delegate()
	{
		string method = Request["method"];

		try
		{
			if(method == "compressImage")
			{
				string siteUrl = Request["siteUrl"];
				string listTitle = Request["listTitle"];
				int itemId = Convert.ToInt32(Request["itemId"]);

				CompressImage(siteUrl, listTitle, itemId);
			}

			Response.Write("success");
		}
		catch(Exception ex)
		{
			Response.Write(ex.Message);
		}
	});

	base.OnLoad(e);
}


// MÉTODOS

protected void CompressImage(string siteUrl, string listTitle, int itemId)
{
	using(SPSite site = new SPSite(siteUrl))
	{
		using(SPWeb web = site.OpenWeb())
		{
			web.AllowUnsafeUpdates = true;

			SPList list =  web.Lists[listTitle];
			SPListItem listItem = list.GetItemById(itemId);
			SPFile file = listItem.File;
			string lastCheckinComment = file.CheckInComment;

			if(lastCheckinComment != "compressed by system")
			{
				SPFolder parentFolder = file.ParentFolder;
				SPFileCollection fileCollection = parentFolder.Files;
				Stream fileStream = file.OpenBinaryStream();
				byte[] bytes = new byte[fileStream.Length];
				fileStream.Read(bytes, 0, Convert.ToInt32(fileStream.Length));
				System.Drawing.Image image = System.Drawing.Image.FromStream(fileStream);

		// processa a imagem
		//System.Drawing.Image newImage = RedrawImage(image, 0);
		//MemoryStream memoryStream = new MemoryStream();
		//newImage.Save(memoryStream, ImageFormat.Jpeg);
		// sobrescreve o arquivo original com comentario no checkin
		//fileCollection.Add(file.ServerRelativeUrl, memoryStream, true, "compressed by system", false);
				fileStream.Close();

		// deleta todas as versões do item, menos a atual
		//file.Versions.DeleteAll();
			}

			web.AllowUnsafeUpdates = false;
			web.Dispose();
		}
	}
}

protected System.Drawing.Image RedrawImage(System.Drawing.Image image, int maxWidth)
{
	// http://www.codeproject.com/KB/GDI-plus/imgresizoutperfgdiplus.aspx

	System.Drawing.Image originalImage = image.Clone() as System.Drawing.Image;
	int width = image.Width;
	int height = image.Height;

	// largura máxima
	if(maxWidth > 0 && originalImage.Width > maxWidth)
	{
		double scaleFactor = (double) maxWidth / image.Width;
		width = (int) Math.Round((double) width * scaleFactor, 0);
		height = (int) Math.Round((double) height * scaleFactor, 0);
	}

	Bitmap finalImage = new Bitmap(width, height, PixelFormat.Format32bppArgb);
	finalImage.SetResolution(100.0F, 100.0F);

	using (Graphics graphics = Graphics.FromImage(finalImage))
	{
		// parameters to create a high-quality
		graphics.SmoothingMode = SmoothingMode.AntiAlias;
		graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
		graphics.CompositingQuality = CompositingQuality.HighQuality;
		graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

		using (ImageAttributes attribute = new ImageAttributes())
		{
			attribute.SetWrapMode(WrapMode.TileFlipXY);

			// draws the resized image to the bitmap
			graphics.DrawImage(originalImage, new Rectangle(0, 0, width, height), 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, attribute);
		}
	}

	return finalImage;
}

</script>
