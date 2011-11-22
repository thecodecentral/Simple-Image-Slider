/**
 * Select all images, turn them into list of 
 * @param el jQuery element
 **/
var SimpleGalleryCrawlerGeneric = function(el){
  this.el = el;
};
  
  
SimpleGalleryCrawlerGeneric.prototype = {
  /**
   * extract images from the given element
   * @param el jQuery element
   * @return image URLs and other information
   */
  getData:function(){
    
    var data = [];
    var self = this;
    this.el.find('img').each(function(i){
      var img = $(this);
      var item = {
        'url':img.attr('src'),
        'title':img.attr('alt'),
        'description': img.attr('title')
      };
      
      data.push(item);
     
    });
    
    return data;
    
  }
};