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

// Called when page has loaded.
window.onload = function () 
{ 
    buildSlideShow();
}; 

// Slideshow.
document.onkeydown = function(e) 
{
    e = e || window.event;
    if (e.keyCode == '37')  prevSlide()
    else if (e.keyCode == '39')  nextSlide();
    else if (e.keyCode == '27')  closeSlideShow();
}
function openSlideShow(src)
{
    document.querySelector('.slideshow-next').focus();

    addClass(document.body, 'slideshow-hide-scrollbars');
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
    removeClass(document.body, 'slideshow-hide-scrollbars');
    var slideshow = document.querySelector('.slideshow');
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
function buildSlideShow()
{
    var strHtml = '<div class="slideshow-slides">';

    [].forEach.call(document.querySelectorAll('.slide'), function(elt, index) 
    {
        var slideShowIcon = document.createElement('div');
        addClass(slideShowIcon, 'slide-show-icon')
        elt.appendChild(slideShowIcon);

        var src = window.getComputedStyle(elt).backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");

        var title = elt.getAttribute('title');
        if (index === 0)
            strHtml += '<div class="slideshow-slide slideshow-slide-active"><div class="slideshow-img flex-box"><img src="'+src+'" alt="'+title+'" /></div><div class="slideshow-text">'+title+'</div></div>';
        else
            strHtml += '<div class="slideshow-slide"><div class="slideshow-img flex-box"><img src="'+src+'" alt="'+title+'" /></div><div class="slideshow-text">'+title+'</div></div>';

        // Add click to open slideshow.
        (function (_src) {
            on(elt, 'click', function(e)
            {
                openSlideShow(_src);
            });
        })(src);
    });

    strHtml += '</div>'
    strHtml += '<div class="slideshow-prev flex-box" role="button" tabindex="0" onclick="prevSlide()">&#10094;</div>';
    strHtml += '<div class="slideshow-next flex-box" role="button" tabindex="0" onclick="nextSlide()">&#10095;</div>';
    strHtml += '<div class="slideshow-close flex-box" role="button" tabindex="0" onclick="closeSlideShow()">&times;</div>';

    var slideshow = document.createElement('div');
    addClass(slideshow, 'slideshow no-select')
    slideshow.innerHTML = strHtml; 
    document.querySelector('body').appendChild(slideshow);
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