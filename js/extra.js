if (!Modernizr.flexbox) 
{
    window.location = './basic.html';
} 

window.onload = function () 
{ 
    addImagesFromPageToSlideshow()
    onScroll();
    on(window, 'scroll resize', debounce(onScroll));
} 

function onScroll()
{
    lazyLoadImages();
}

// Lazy Load slides.
function lazyLoadSlides () 
{
    [].forEach.call(document.querySelectorAll('.modal img[data-src]'), function(img) 
    {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.onload = function() 
        {
            img.removeAttribute('data-src');
        }
    });
}

// Lazy Load slides images.
function lazyLoadImages () 
{
    var buffer = viewportHeight(); // The height above the image at which it starts to load - so images start to load just before scrolled into view.

    [].forEach.call(document.querySelectorAll('.img-lazy-load[data-src]'), function(elt) 
    {
        if((offset(elt) - buffer) <= pageBottomOffset())
        {
            var src = elt.getAttribute('data-src');
            if (elt.nodeName == 'IMG')
            {
                elt.setAttribute('src', src);
                elt.onload = function() 
                {
                    elt.removeAttribute('data-src');
                    addClass(elt, 'img-lazy-load-complete');
                }
            }
            else
            {
                var img = document.createElement('img'); 
                img.setAttribute('src', src);
                img.onload = function() 
                {
                    elt.style.backgroundImage = 'url(' + src + ')';
                    elt.removeAttribute('data-src');
                    addClass(elt, 'img-lazy-load-complete');
                }
            }

            // Add click to open slideshow.
            (function (_src) {
                on(elt, 'click', function(e)
                {
                    openSlideShow(_src);
                });
            })(src);
        }
    });
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

function hasClass (element, className)
{
    return element.className.match(/(?:^|\s)className(?!\S)/);
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

function bounds(element) 
{
    return element.getBoundingClientRect();
}

function viewportHeight() 
{
    return document.documentElement.clientHeight;
}

function pageTopOffset() 
{
    var doc = document.documentElement;
    return {
        x : (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        y : (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    };
}

function pageBottomOffset() 
{
    return pageTopOffset().y + viewportHeight();
}

function offset(element) 
{
    return pageTopOffset().y + bounds(element).top;
}

function debounce(func, wait, immediate) 
{
    var timeout;
    return function() 
    {
        var me = this, args = arguments;
        var later = function() 
        {
            timeout = null;
            if (!immediate) func.apply(me, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 250);
        if (callNow) func.apply(me, args);
    };
};