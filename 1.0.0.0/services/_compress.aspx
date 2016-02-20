<% Response.CacheControl = "no-cache"; %>
<%@ Page language="C#" %>

<%@ Register Tagprefix="System" Namespace="System" Assembly="System, Version=2.0.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Collections" %>

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint" Assembly="Microsoft.SharePoint, Version=12.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>

<%@ Register Tagprefix="Drawing" Namespace="System.Drawing" Assembly="System.Drawing, Version=2.0.0.0, Culture=neutral, PublicKeyToken=B03F5F7F11D50A3A" %>
<%@ Import Namespace="System.Drawing" %>
<%@ Import Namespace="System.Drawing.Imaging" %>
<%@ Import Namespace="System.Drawing.Drawing2D" %>


<script type="text/c#" runat="server">  

/// VARIÁVEIS GLOBAIS

/*

!!!!!
API WEB WORKER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

*/

/// EXECUÇÃO

protected override void OnLoad(EventArgs e)
{
	SPSecurity.RunWithElevatedPrivileges(delegate()
	{
		if(!IsPostBack)
		{
		}

		using(SPSite site = new SPSite("http://localhost/sitelab1"))
		{
			using(SPWeb web = site.OpenWeb())
			{
				try
				{
					web.AllowUnsafeUpdates = true;
					//SPList list = web.SiteUserInfoList;
					//SPListItemCollection items = list.Items;

					SPFileCollection files = web.Files;
					SPFile file = files["345 - Copia.tif"];

					//Response.Write(file.ServerRelativeUrl + "<br>");
					//Response.Write(file.Url + "<br>");

					//file.CheckOut();// checkout
					//file.CheckIn("compressed by system");// faz checkin com comentário
					
					Stream fileStream = file.OpenBinaryStream();
					
					//string ultimoCheckin = file.CheckInComment;

					//Response.Write(ultimoCheckin + "<br>");

					byte[] bytes = new byte[fileStream.Length];
					fileStream.Read(bytes, 0, Convert.ToInt32(fileStream.Length));

					System.Drawing.Image image = System.Drawing.Image.FromStream(fileStream);
					//Response.Write(image.Size.ToString() + "<br>");

					System.Drawing.Image newImage = Resize(image, 5000);


					//Stream s = GetStream(newImage, ImageFormat.Png);

					MemoryStream memoryStream = new MemoryStream();
					//ImageFormat imageFormat = ImageFormat.Jpeg;
					newImage.Save(memoryStream, ImageFormat.Jpeg);
					

					//Response.Write(ms.Length + "<br>");

					files.Add(file.ServerRelativeUrl, memoryStream, true);// sobrescreve o arquivo original

					// sobrescreve o arquivo original com comentario no checkin
					//files.Add(file.ServerRelativeUrl, newFileStream, true, "compressed by system", false);

					//file.Save(s);
					//file.Update();

					fileStream.Close();
				}
				catch(Exception ex)
				{
					Response.Write(ex.Message);
				}
			}
		}
	});

	base.OnLoad(e);
}


/// MÉTODOS

// === deletar permanentemente todas as versões do item, menos a atual

// SPListItem.Versions => SPListItemVersionCollection.DeleteAll()

// ===


protected System.Drawing.Image Resize(System.Drawing.Image image, int width)
{
	int newWidth = image.Width;
	int newHeight = image.Height;
	System.Drawing.Image newImage = image.Clone() as System.Drawing.Image;

	// if(width < image.Width)
	// {
	// 	ArrayList newSize = CalculateSize(newImage, width);
	// 	newWidth = (int) newSize[0];
	// 	newHeight = (int) newSize[1];
	// 	Response.Write("0<br>");
	// }

	Bitmap resizedImage = new Bitmap(newWidth, newHeight, PixelFormat.Format32bppArgb);
	resizedImage.SetResolution(100.0F, 100.0F);

	using (Graphics graphics = Graphics.FromImage(resizedImage))
	{
		// set parameters to create a high-quality thumbnail
		graphics.SmoothingMode = SmoothingMode.AntiAlias;
		graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
		graphics.CompositingQuality = CompositingQuality.HighQuality;
		graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

		// use an image attribute in order to remove the black/gray border around image after resize
		// (most obvious on white images), see this post for more information:
		// http://www.codeproject.com/KB/GDI-plus/imgresizoutperfgdiplus.aspx
		using (ImageAttributes attributes = new ImageAttributes())
		{
			attributes.SetWrapMode(WrapMode.TileFlipXY);

			// draws the resized image to the bitmap
			graphics.DrawImage(newImage, new Rectangle(0, 0, newWidth, newHeight), 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, attributes);
		}
	}
	
	Response.Write("1<br>");

	return resizedImage;
}

protected ArrayList CalculateSize(System.Drawing.Image image, int targetWidth)
{
	double widthScale = (double)targetWidth / image.Width;
	int targetHeight = (int)(widthScale * image.Height);

	ArrayList size = new ArrayList();
	size.Add(targetWidth);
	size.Add(targetHeight);

	return size;
}

protected ImageFormat GetImageFormatByExtension(string extension)
{
	if (extension == "jpg" || extension == "jpeg")
	{
		return ImageFormat.Jpeg;
	}
	else if (extension == "png")
	{
		return ImageFormat.Png;
	}
	else if (extension == "bmp")
	{
		return ImageFormat.Bmp;
	}
	else if (extension == "gif")
	{
		return ImageFormat.Gif;
	}
	else if (extension == "tiff")
	{
		return ImageFormat.Tiff;
	}
	
	return null;
}

</script>

