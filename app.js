'use strict';

// slideshow
var makeBSS = function(el, options){
  var $slideshows = document.querySelectorAll(el), //a collection of all the slidshows
  var $slideshow = {},
  var Slideshow = {
    init: function (el, options){
      options = options || {};
      options.auto = options.auto || false;
      this.opts = {
        selector: (typeof options.selector === "undefined") ? "figure" : options.selector,
        auto: (typeof options.auto === "undefined") ? flase : options.auto,
        speed: (typeof options.auto.speed === "undefined") ? 1500 : options.auto.speed,
        pauseOnHover: (typeof options.auto.pauseOnHover === "undefined") ? false : options.fullScreen,
        swipe: (typeof options.swipe === "undefined") ? false : options.swipe
      };

      this.counter = 0; //to keep track of current slide
      this.el = el; //current slideshow container
      this.$items = el.querySelectorAll(this.opts.selector); // a collection of all the slides
      this.numItems = this.$items.length; // total number of slides
      this.$items[0].classList.add('bss-show'); // add show class to first figure
      this.injectControls(el);
      this.addEventListeners(el);
      if (this.opts.auto){
        this.autoCycle(this.el, this.opts.speed, this.opts.pauseOnHover);
      }
      if (this.opts.fullScreen) {
        this.addFullScreen(this.el);
      }
      if (this.opts.swipe){
        this.addSwipe(this.el);
      }
    },
    showCurrent: function(i){ //increment or decrement this.counter
      if(i > 0){
        this.counter = (this.counter + 1 === this.numItems) ? 0 : this.counter + 1;
      } else {
        this.counter = (this.counter - 1 < 0) ? this.numItems -1 : this.counter -1;
      }

      [].forEach.call(this.$items, function(el){
        el.classList.remove('bss-show');
      });
    },
    injectControls: function(el){
      var spanPrev = document.createElement("span"),
      var spanNext = document.createElement("span"),
      var docFrag = document.createDocumentFragment();

      // add classes
      spanPrev.classList.add('bss-prev');
      spanNext.classList.add('bss-next');

      // add contents
      spanPrev.innerHTML = '&laquo;';
      spanNext.innerHTML = '&raquo;';

      // append elements to fragment, then append fragment to DOM
      docFrag.appendChild(spanPrev);
      docFrag.appendChild(spanNext);
      el.appendChild(docFrag);
    },
    addEventListeners: function(el){
      var that = this;
      el.querySelector('.bss-next').addEventListener('click', function(){
        that.showCurrent(1); //increment and show
      }, false);
      el.onkeydown = function(e){
        e = e || window.event;
        if(e.keyCode === 37) {
          that.showCurrent(-1); //decrement and show
        } else if (e.keyCode === 39) {
          that.showCurrent(1); //increment and show
        }
      };
    },
    autoCycle: function(el, speed, pauseOnHover){
      var that = this,
      var interval = window.setInterval(function(){
        that.showCurrent(1); //increment and show
      }, speed);
      if(pauseOnHover){
        el.addEventListener('mouseover', function(){
          interval = clearInterval(interval);
        }, false);
        el.addEventListener('mouseout', function(){
          interval = window.setInterval(function(){
            that.showCurrent(1); //increment and show
          }, speed);
        }, false);
      } //end pause on hover
    },
    addFullScreen: function(el){
      var that = this;
      var fsControl = document.createElement("span");
      fsControl.classList.add('bss-fullscreen');
      el.appendChild(fsControl);
      el.querySelector('.bss-fullscreen').addEventListener('click', function(){
        that.toggleFullScreen(el);
      }, false);
    },
    addSwipe: function(el){
      var that = this,
      var ht = new Hammer(el);
      ht.on('swiperight', function(e){
        that.showCurrent(-1); //decrement and show
      });
      ht.on('swipeleft', function(e){
        that.showCurrent(1); //increment and show
      });
    },
    toggleFullScreen: function(el){
      // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement &&
          !document.msFullscreenElement ) {  // current working methods
          if (document.documentElement.requestFullscreen) {
            el.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            el.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            el.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
          }
      } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
      }
    } //end toggle fullscreen
  }; //end slide show object

  //make instances of slideshow as needed
  [].forEach.call($slideshows, function(el){
    $slideshow = Object.create(Slideshow);
    $slideshow.init(el, options);
  });
};
