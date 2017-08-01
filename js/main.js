// Check for modern css support.
// cssvhunit not working properly on android so removed.
//if (Modernizr.flexbox && Modernizr.flexwrap && Modernizr.csscalc && Modernizr.cssvhunit && Modernizr.cssvwunit) 
if (Modernizr.flexbox && Modernizr.flexwrap && Modernizr.csscalc) 
{
}
else 
{
   window.location = './basic/index.html';
}

var transitionEvent = whichTransitionEvent();

// Called when page has loaded.
window.onload = function () 
{ 
    buildSlideShow();
    initModals();
}; 

// Modals.                                                                                                                               
function initModals () 
{             
    [].forEach.call(document.querySelectorAll('.modal'), function(elt, index) 
    {
        addClass(elt, 'modal-hidden');
        on(elt, 'click', function(evt)
        {
            if (hasClass(evt.target, 'modal') || hasClass(evt.target, 'modal-close'))  closeModals();
        });
    });
}      
function onModalClose (evt)
{
    if (hasClass(evt.target, 'modal'))
    {
        addClass(evt.target, 'modal-hidden');
        removeClass(document.body, 'hide-scrollbars');
    }
}                                                                                                                                                                            
function closeModals () 
{   
    [].forEach.call(document.querySelectorAll('.modal'), function(elt, index) 
    {
        on(elt, transitionEvent, onModalClose);
        removeClass(elt, 'modal-active');
        removeClass(elt.getElementsByClassName('modal-content')[0], 'modal-content-active');
    }); 
}                                           
function showModal (id) 
{         
    var modal = document.getElementById(id); 
    off(modal, transitionEvent, onModalClose);
    addClass(document.body, 'hide-scrollbars');
    removeClass(modal, 'modal-hidden');
    addClass(modal, 'modal-active'); 
    addClass(modal.getElementsByClassName('modal-content')[0], 'modal-content-active');
}                                         

// Slideshow.
var xDown = null;                                                        
function slideShowOnTouchStart (evt) 
{             
    xDown = evt.touches[0].clientX;                                      
}                                            
function slideShowOnTouchMove (evt) 
{
    if (!xDown) return;
    var xUp = evt.touches[0].clientX;     
    var xDiff = xDown - xUp;
    if ( xDiff > 0 ) nextSlide();
    else  prevSlide();
    xDown = null;
}
function slideShowOnKeyDown (evt)
{
    evt = evt || window.event;
    if (evt.keyCode == '37')  prevSlide()
    else if (evt.keyCode == '39')  nextSlide();
    else if (evt.keyCode == '27')  closeSlideShow();
}
function slideShowOnClose (evt)
{
    addClass(evt.target, 'slideshow-hidden');
    removeClass(document.body, 'hide-scrollbars');
}
function buildSlideShow()
{
    var strHtml = '<div class="slideshow-slides">';

    [].forEach.call(document.querySelectorAll('.slide'), function(elt, index) 
    {
        var src;
        if (elt.nodeName == 'IMG') 
            src = elt.getAttribute('src');
        else     
            src = window.getComputedStyle(elt).backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");
       
        // Add click to open slideshow.
        (function (_src) {
            on(elt, 'click', function(e)
            {
                openSlideShow(_src);
            });
        })(src);

        var slideShowIcon = document.createElement('div');
        addClass(slideShowIcon, 'slideshow-icon')
        elt.appendChild(slideShowIcon);

        var title = elt.getAttribute('data-title');

        if (index === 0) 
            strHtml += '<div class="slideshow-slide slideshow-slide-active">';
        else 
            strHtml += '<div class="slideshow-slide">';

                strHtml += '<div class="slideshow-img flex-box" onclick="nextSlide()">';
                    strHtml += '<img src="'+src+'" alt="'+title+'" />';
                strHtml += '</div>';
                strHtml += '<div class="slideshow-text">'+title+'</div>';
            strHtml += '</div>';
    });

    strHtml += '</div>'
    strHtml += '<div class="slideshow-prev flex-box" role="button" tabindex="0" onclick="prevSlide()">&#10094;</div>';
    strHtml += '<div class="slideshow-next flex-box" role="button" tabindex="0" onclick="nextSlide()">&#10095;</div>';
    strHtml += '<div class="slideshow-close flex-box" role="button" tabindex="0" onclick="closeSlideShow()">&times;</div>';

    var slideshow = document.createElement('div');
    addClass(slideshow, 'slideshow slideshow-hidden no-select')
    slideshow.innerHTML = strHtml; 
    document.querySelector('body').appendChild(slideshow);
}
function openSlideShow(src)
{
    var slideshow = document.querySelector('.slideshow');
    if (slideshow !== null)
    {
        off(slideshow, transitionEvent, slideShowOnClose);
        on(document, 'keydown', slideShowOnKeyDown);
        on(document, 'touchstart', slideShowOnTouchStart);
        on(document, 'touchmove', slideShowOnTouchMove);

        addClass(document.body, 'hide-scrollbars');
        slideshow.querySelector('.slideshow-next').focus();
        if (src !== undefined)
        {
            var activeSlide = slideshow.querySelector('.slideshow-slide-active');
            var nextSlide = slideshow.querySelector('img[src="'+src+'"], img[data-src="'+src+'"]').parentElement.parentElement;
            addClass(nextSlide, 'slideshow-slide-active');
            removeClass(activeSlide, 'slideshow-slide-active');
        }
        removeClass(slideshow, 'slideshow-hidden');
        addClass(slideshow, 'slideshow-active');
    }
}
function closeSlideShow()
{
    var slideshow = document.querySelector('.slideshow');

    on(slideshow, transitionEvent, slideShowOnClose);
    off(document, 'keydown', slideShowOnKeyDown);
    off(document, 'touchstart', slideShowOnTouchStart);
    off(document, 'touchmove', slideShowOnTouchMove);

    removeClass(slideshow, 'slideshow-active');
}
function nextSlide()
{
    var slideshow = document.querySelector('.slideshow');
    var activeSlide = slideshow.querySelector('.slideshow-slide-active');
    var nextSlide = (activeSlide.nextElementSibling !== null ? activeSlide.nextElementSibling : activeSlide.parentNode.firstElementChild);
    addClass(nextSlide, 'slideshow-slide-active');
    removeClass(activeSlide, 'slideshow-slide-active');
}
function prevSlide()
{
    var slideshow = document.querySelector('.slideshow');
    var activeSlide = slideshow.querySelector('.slideshow-slide-active');
    var prevSlide = (activeSlide.previousElementSibling !== null ? activeSlide.previousElementSibling : activeSlide.parentNode.lastElementChild);
    addClass(prevSlide, 'slideshow-slide-active');
    removeClass(activeSlide, 'slideshow-slide-active');
}

// Util functions.
function addClass (elt, className)
{
    elt.className += ' ' + className;
}
function removeClass (elt, className)
{
    elt.className = elt.className.replace(new RegExp('(?:^|\\s)'+ className + '(?:\\s|$)'), ' ');
}
function hasClass (elt, className)
{
    return (' ' + elt.className + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + className + ' ') > -1;
}
function on(elt, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        elt.addEventListener(type, listener);
    }
}
function off(elt, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        elt.removeEventListener(type, listener);
    }
}
function whichTransitionEvent()
{
    var el = document.createElement('fakeelement');
    var transitions = 
    {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
    }
    for (var t in transitions)
    {
        if(el.style[t] !== undefined)
        {
            return transitions[t];
        }
    }
}