<header class="sticky-top">
  <div class="bg-main-accent py-1">
    <div class="container">
      <div class="row justify-content-end">
        <ul class="list-unstyled user-controls">
          <li><dnn:Login runat="server" id="dnnLogin" /></li>
          <li><dnn:User runat="server" id="dnnUser" /></li>
          <li><dnn:Search runat="server" id="dnnSearch" ShowSite="false" ShowWeb="false" Submit="<i class='fas fa-search'></i>" /></li>
          <li style="display:none;"><dnn:Language runat="server" id="dnnLanguage" ShowMenu="false" ShowLinks="false" /></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="bg-light-shade">
    <div class="container">
      <div class="row navbar-header">
        <dnn:LOGO id="dnnLOGO" runat="server" />
        <nav>
          <dnn:MENU id="menu" MenuStyle="menus/razor" runat="server" NodeSelector="*"></dnn:MENU>
        </nav>
      </div>
    </div>
  </div>
</header>