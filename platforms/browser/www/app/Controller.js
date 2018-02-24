// @author Chris Loftus
// @version 2.0 (20th April 2017)
// This class represents the user interface controller that switches
// between the map tab and other tabs. Note that currently only
// the map tab has Javascript associated with it.
//
// Note that, until ES6 modules are supported, there is no natural way to make members and methods
// private. For this class we simply place the callback functions inside
// the constructor. That way, they cannot be accessed directly from outside
// of the class. This makes the constructor very long.
class Controller {

  constructor(){
    this.map = new Map();
    let self = this;
    
    function initialisePage(event) {
      change_page_back_history();
    }
    
    function onPageChange(event, data) {
      // Find the id of the page
      let toPageId = data.toPage.attr('id');

      // If we're about to display the map tab (page) then
      // if not already displayed then display, else if
      // displayed and window dimensions changed then redisplay
      // with new dimensions
      if (toPageId == 'map') {
        self.map.refresh();
      }
    }
    
    // This changes the behaviour of the anchor <a> link
    // so that when we click an anchor link we change page without
    // updating the browser's history stack (changeHash: false).
    // We also don't want the usual page transition effect but
    // rather to have no transition (i.e. tabbed behaviour)
    function change_page_back_history() {
      $('a[data-role="tab"]').each(function () {
        var anchor = $(this);
        // anchor doesn't have a href element when you click on it.
        if (anchor.attr('href') !== undefined) {
          anchor.bind('click', function() {
            $.mobile.changePage(anchor.attr('href'), { // Go to the URL
                                transition: 'none',
                                changeHash: false});
            return false;
          });
        }
      });
    }
    
    // The pagecreate event is fired when jQM loads a new page for the first time into the
    // Document Object Model (DOM). When this happens we want the initialisePage function
    // to be called.
    $(document).on('pagecreate', initialisePage);
    
    // The pagechange event is fired every time we switch pages or display a page
    // for the first time.
    $(document).on('pagechange', onPageChange);
    
   
  
  }

  
     
}

