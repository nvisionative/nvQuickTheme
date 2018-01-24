<header class="container-fluid">
  <div class="container">
    <div class="row nav-main">
      <dnn:LOGO id="dnnLOGO" runat="server" />
      <nav id="nav-items">
        <dnn:MENU id="menu" MenuStyle="menus/main" runat="server" NodeSelector="*"></dnn:MENU>
        <ul class="user-controls" style="display:none;">
          <li><dnn:Login runat="server" id="dnnLogin" /></li>
          <li><dnn:Search runat="server" id="dnnSearch" CssClass="TEST" ShowSite="false" ShowWeb="false" Submit="<i class='fa fa-search'></i>" /></li>
          <li><dnn:Language runat="server" id="dnnLanguage" ShowMenu="false" ShowLinks="false" /></li>
        </ul>
      </nav>
    </div>
  </div>
</header>