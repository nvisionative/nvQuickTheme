jQuery( document ).ready(function($) { 
  /* SlimMenu Prep */
  $('#navigation').slimmenu({
    resizeWidth: '800',
    collapserTitle: '',
    animSpeed: 0,
    easingEffect: null,
    indentChildren: false,
    childrenIndenter: '&nbsp;',
    expandIcon: '',
    collapseIcon: ''
  });
  
  /* Hides empty container divs if all cols are empty */
  /* Required proper Bootstrap structure to function properly */
  $('main div[class*=container]').each(function () {
    var $main = $(this),
      $allChildren = $main.find('div[class*=col]');
      $allEmptyChildren = $allChildren.filter(':empty');
    $main.toggle($allChildren.length !== $allEmptyChildren.length);
  });
});