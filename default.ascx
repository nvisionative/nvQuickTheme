<%@ Control Language="C#" AutoEventWireup="false" Explicit="True" Inherits="DotNetNuke.UI.Skins.Skin" %>
<%@ Register TagPrefix="dnn" TagName="LOGIN" Src="~/Admin/Skins/Login.ascx" %>
<%@ Register TagPrefix="dnn" TagName="LOGO" Src="~/Admin/Skins/Logo.ascx" %>
<%@ Register TagPrefix="dnn" TagName="COPYRIGHT" Src="~/Admin/Skins/Copyright.ascx" %>
<%@ Register TagPrefix="dnn" TagName="TERMS" Src="~/Admin/Skins/Terms.ascx" %>
<%@ Register TagPrefix="dnn" TagName="PRIVACY" Src="~/Admin/Skins/Privacy.ascx" %>
<%@ Register TagPrefix="dnn" TagName="JQUERY" Src="~/Admin/Skins/jQuery.ascx" %>
<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.DDRMenu.TemplateEngine" Assembly="DotNetNuke.Web.DDRMenu" %>
<%@ Register TagPrefix="dnn" TagName="MENU" src="~/DesktopModules/DDRMenu/Menu.ascx" %>
<%@ Register TagPrefix="dnn" TagName="META" Src="~/Admin/Skins/Meta.ascx" %>
<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.Client.ClientResourceManagement" Assembly="DotNetNuke.Web.Client" %>

<!--#include file="partials/_includes.ascx" -->

<!-- Nav Bar -->
<header class="container-fluid">
  <div class="container">
    <div class="row nav-main">
      <dnn:LOGO id="dnnLOGO" runat="server" />
      <nav id="nav-items" class="mobile-nav-group ">
        <dnn:MENU id="menu" MenuStyle="menus/main" runat="server" NodeSelector="*"></dnn:MENU>
      </nav>
      <div class="mobile">
        <a id="mobile-btn" class="mobile-btn" href="#nav-items"><i class="fa fa-bars"></i></a>
      </div>
    </div>
  </div>
</header>

<!-- Main Content -->
<main>
  <div class="container-fluid bannerpane">
    <div class="container">
      <div class="row justify-content-center">
        <div id="BannerPane" class="col-md-8 text-center" runat="server"></div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row justify-content-center">
      <div id="ContentPane" class="col-md-8 text-center" runat="server"></div> 
    </div>
  </div>

  <div class="container">
    <div class="row justify-content-between">
      <div id="DoublePaneOneOne" class="col-md-6 pr-5" runat="server"></div>
      <div id="DoublePaneOneTwo" class="col-md-6 bg-light-grey" runat="server"></div>
    </div>
  </div>   

  <div class="container-fluid bg-tertiary">
    <div class="container">
      <div class="row align-items-center">
        <div id="FullWidthBGDoublePaneOne" class="col-md-6" runat="server"></div>
        <div id="FullWidthBGDoublePaneTwo" class="col-md-6" runat="server"></div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row justify-content-center">
      <div id="SinglePaneOne" class="col-md-8 text-center" runat="server"></div>
    </div>
</div>    
</main>
<!-- Footer -->
<footer>
  <div class="container upper">
    <div class="row">
      <div id="FooterPaneOne" class="col-md-4" runat="server"></div>
      <div id="FooterPaneTwo" class="col-md-4" runat="server"></div>
      <div id="FooterPaneThree" class="col-md-4" runat="server"></div>
    </div>
  </div>
  <div class="container-fluid bg-primary disclaimer">
    <div class="container">
      <ul>
        <li><dnn:COPYRIGHT id="dnnCopyright" runat="server" /></li>
        <li><dnn:TERMS id="dnnTerms" runat="server" /></li>
        <li><dnn:PRIVACY id="dnnPrivacy" runat="server" /></li>
      </ul>
    </div>
  </div>
</footer>