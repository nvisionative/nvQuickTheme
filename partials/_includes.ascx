<dnn:META ID="mobileScale" runat="server" Name="viewport" Content="width=device-width, initial-scale=1.0" />
<dnn:DnnCssExclude runat="server" Name="dnndefault" /> 

<dnn:DnnCssInclude runat="server" FilePath="dist/css/all.min.css" Priority="100" PathNameAlias="SkinPath" />
<dnn:DnnCssInclude runat="server" FilePath="dist/css/style.min.css" Priority="110" PathNameAlias="SkinPath" />

<dnn:DnnJsInclude runat="server" FilePath="dist/js/jquery.slimmenu.min.js" ForceProvider="DnnFormBottomProvider" Priority="100" PathNameAlias="SkinPath" />
<dnn:DnnJsInclude runat="server" FilePath="dist/js/bootstrap.bundle.min.js" ForceProvider="DnnFormBottomProvider" Priority="110" PathNameAlias="SkinPath" />
<dnn:DnnJsInclude runat="server" FilePath="dist/js/custom.min.js" ForceProvider="DnnFormBottomProvider" Priority="120" PathNameAlias="SkinPath" />
<dnn:DnnJsInclude runat="server" FilePath="dist/js/modernizr-custom.min.js" ForceProvider="DnnFormBottomProvider" Priority="130" PathNameAlias="SkinPath" />

<script runat="server">
    protected void Page_Init()
    {
        var fonts = new string[]
        {
            "dist/webfonts/fa-brands-400",
            "dist/webfonts/fa-regular-400",
            "dist/webfonts/fa-solid-900",
            "dist/fonts/OpenSans-Bold",
            "dist/fonts/OpenSans-ExtraBold",
            "dist/fonts/OpenSans-Light",
            "dist/fonts/OpenSans-Regular",
            "dist/fonts/OpenSans-SemiBold"
        };

        var types = new Dictionary<string, string>();
        types.Add("woff2", "font/woff2");
        types.Add("woff", "font/woff");

        var defaultPage = (CDefault)this.Page;

        foreach (var type in types)
        {
            foreach (var font in fonts)
            {
                var fontLink = new HtmlLink();
                fontLink.Attributes.Add("rel", "preload");
                fontLink.Attributes.Add("as", "font");
                fontLink.Href = this.SkinPath + font + "." + type.Key;
                fontLink.Attributes.Add("type", type.Value);
                fontLink.Attributes.Add("crossorigin", "anonymous");

                defaultPage.Header.Controls.Add(fontLink);
            }
        }
    }
</script>