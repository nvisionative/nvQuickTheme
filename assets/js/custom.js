jQuery( document ).ready(function($) {
  
  /* Sidr Prep */
  $('#mobile-btn').sidr({
    source: '#nav-items',
    side: 'right'
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