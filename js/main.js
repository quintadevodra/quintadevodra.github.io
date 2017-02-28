if (Modernizr.flexbox && Modernizr.flexwrap) 
{
    // Modern Flexbox with `flex-wrap` supported.
}
else 
{
    // Either old Flexbox syntax, or `flex-wrap` not supported.
    window.location = './basic/index.html';
}

// Called when page has loaded.
window.onload = function () 
{ 
    addImagesFromPageToSlideshow();
} 

// Slideshow.
function openSlideShow(src)
{
    addClass(document.body, 'hide-scrollbars');
    var slideshow = document.querySelector('.slideshow');
    if (src !== undefined)
    {
        var activeSlide = slideshow.querySelector('.slideshow-slide-active');
        var nextSlide = slideshow.querySelector('img[src="'+src+'"], img[data-src="'+src+'"]').parentElement.parentElement;
        addClass(nextSlide, 'slideshow-slide-active');
        removeClass(activeSlide, 'slideshow-slide-active');
    }
    addClass(slideshow, 'slideshow-active');
}
function closeSlideShow()
{
    removeClass(document.body, 'hide-scrollbars');
    var slideshow = document.querySelector('.slideshow');
    removeClass(slideshow, 'slideshow-active');
}
function nextSlide()
{
    var slideshow = document.querySelector('.slideshow');
    var activeSlide = slideshow.querySelector('.slideshow-slide-active');
    var nextSlide = (activeSlide.nextElementSibling != null ? activeSlide.nextElementSibling : activeSlide.parentNode.firstElementChild);
    addClass(nextSlide, 'slideshow-slide-active');
    removeClass(activeSlide, 'slideshow-slide-active');
}
function prevSlide()
{
    var slideshow = document.querySelector('.slideshow');
    var activeSlide = slideshow.querySelector('.slideshow-slide-active');
    var prevSlide = (activeSlide.previousElementSibling != null ? activeSlide.previousElementSibling : activeSlide.parentNode.lastElementChild);
    addClass(prevSlide, 'slideshow-slide-active');
    removeClass(activeSlide, 'slideshow-slide-active');
}
function addImagesFromPageToSlideshow()
{
    var strHtml = '';
    [].forEach.call(document.querySelectorAll('.bg-img'), function(elt, index) 
    {
        var src = window.getComputedStyle(elt).backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");

        var title = elt.getAttribute('title');
        if (index === 0)
            strHtml += '<div class="slideshow-slide slideshow-slide-active"><div class="slideshow-img flex-box"><img src="'+src+'" /></div><div class="slideshow-text">'+title+'</div></div>';
        else
            strHtml += '<div class="slideshow-slide"><div class="slideshow-img flex-box"><img src="'+src+'" /></div><div class="slideshow-text">'+title+'</div></div>';

        // Add click to open slideshow.
        (function (_src) {
            on(elt, 'click', function(e)
            {
                openSlideShow(_src);
            });
        })(src);
    });
    var slideshow = document.querySelector('.slideshow');
    slideshow.querySelector('.slideshow-slides').innerHTML = strHtml;
}

// Util functions.
function addClass (element, className)
{
    element.className += ' ' + className;
}
function removeClass (element, className)
{
    element.className = element.className.replace(new RegExp('(?:^|\\s)'+ className + '(?:\\s|$)'), ' ');
}
function on(element, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        element.addEventListener(type, listener);
    }
}