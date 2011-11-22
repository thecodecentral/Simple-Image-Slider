/**
 * The MIT License (MIT)
 * Copyright (c) 2011 Cuong Tham
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 **/


/**
 * @param options array
 **/
var SimpleGallery = function(options){
  
  this.renderToEl = null;
  this.options = $.extend({
    slidePanelClassName: 'slide_panel',
    navLeftClassName: 'nav_left',
    navRightClassName: 'nav_right',
    slideClassName: 'slide_block', //class to determine the width of each slide,
    itemRenderer: this.itemRenderer,
    galleryRenderer: this.galleryRenderer
  }, options);
  

  //gallery data
  this.data = null;
  this.numberSlides = 0;
  this.slideWidth = null;
  
  //1 based index
  this.currentSlide = -1;
  this.isAnimating = false;
  this.isScrollPanelInited = false;
  this.slidePanel = null;
  this.navLeft = null;
  this.navRight = null;

};
  
  
SimpleGallery.prototype = {

  
  getData:function(){
    return this.data;
  },
  
  getCurrentSlide:function(){
    return this.currentSlide;
  },
  
  getNumberSlides:function(){
    return this.numberSlides;
  },
  
  getCurrentSlideData:function(){
    return this.data[this.currentSlide];
  },
  
  /**
   * @see render() function
   **/
  itemRenderer:function(itemData){
    var padder = $('<div></div>').addClass('slide_padder').addClass(this.options.slideClassName);
    var vAligner = $('<div></div>').addClass('slide_valigner');
    var img = $('<img/>').attr('src', itemData.url);
    padder.append(vAligner.append(img));
    
    return padder;
  },
  
  /**
   * @see render() function
   **/
  galleryRenderer: function(self){
    var html = 
    '<div class="' + self.options.slidePanelClassName + '" style="display:none"></div>' + 
    '<a href="javascript:void(0)" class="' + self.options.navLeftClassName + '" style="display:none">Backward</a>' + 
    '<a href="javascript:void(0)" class="' + self.options.navRightClassName + '" style="display:none">Forward</a>' + 
    '</div>';

    return $(html)
  },
  
  /**
   * @param data list tuples containing image information
   **/
  setData:function(data){
    this.data = data;
    this.numberSlides = data.length;
    return this;
  },
  /**
   * render gallery to the targeted jQuery element
   * @param toEl jQuery element
   */
  render:function(toEl){
    
    this.renderToEl = toEl;
    
    this.renderToEl.append(this.options.galleryRenderer.apply(this, [this]));
    
    var panel = toEl.find('.' + this.options.slidePanelClassName);
    
    panel.empty();
    
    for(var i in this.data){
      var slide = this.options.itemRenderer.apply(this, [this.data[i]]);
      panel.append(slide);
    }
    
   
    this.slidePanel = panel;
    this.slideWidth = panel.find('.' + this.options.slideClassName).width();
   
    panel.width(this.numberSlides *  this.slideWidth);
    panel.show();
    this.renderToEl.show();
    
    this.setupNav();
    
    this.scrollTo(0);
  },
  
  setupNav:function(){
    this.navLeft = this.renderToEl.find('.' + this.options.navLeftClassName);    
    this.navRight = this.renderToEl.find('.' + this.options.navRightClassName);
    var self = this;

   
    this.navLeft.click(function(){
      if(self.currentSlide > 0 ){
        self.scrollTo(parseInt(self.currentSlide) - 1);
      }
    });
        
    this.navRight.click(function(){
      if(self.currentSlide < self.numberSlides){
        self.scrollTo(parseInt(self.currentSlide) + 1);
      }
    });
  },
  
  scrollToBeginning:function(){
    this.scrollTo(0);
  }, 
  scrollToEnd:function(){
    this.scrollTo(this.numberSlides - 1);
  },
  /**
   * Scroll to a slide. Index is 0 based.
   */
  scrollTo: function(index){
    if(this.isAnimating){
      return;
    }

    if(index < 0 || index >= this.numberSlides){
      return;
    }
        
    if(index == this.currentSlide){
      return;
    }
   
    this.isAnimating = true;  
    this.slidePanel.show();
    var self = this;
    
    //hide navigations first, then show after animation is completed.
    this.navLeft.hide();
    this.navRight.hide();

    this.slidePanel.animate({
      left: (-(index * this.slideWidth)) + 'px'
    }, 'slow', function(){
      self.currentSlide = index;
      self.isAnimating = false;
      self.showHideNav();
      self.renderToEl.trigger('simple.gallery.animation_completed');
      console.log(self.renderToEl);
    });
  },
  
  showHideNav: function (){
    
    if(this.currentSlide >= this.numberSlides - 1){
      this.navLeft.show();
      this.navRight.hide();
    }else if(this.currentSlide <= 0){
      this.navLeft.hide();
      this.navRight.show();
    }else{
      this.navLeft.show();
      this.navRight.show();
    }
  }
  
};