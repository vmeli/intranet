/**
 * Vanilla Javascript Carousel v3.0.0
 * https://zoltantothcom.github.io/vanilla-js-carousel
 */
/**
 * @fileOverview
 * @author Zoltan Toth
 * @version 3.0.0
 */

/**
 * @description
 * 1Kb (gzipped) pure JavaScript carousel with all the basic features.
 *
 * @class
 * @param {object} options - User defined settings for the carousel.
 * @param {string} options.elem [options.elem=carousel] - The HTML id of the carousel container.
 * @param {(boolean)} [options.infinite=false] - Enables infinite mode for the carousel.
 * @param {(boolean)} [options.autoplay=false] - Enables auto play for slides.
 * @param {number} [options.interval=3000] - The interval between slide change.
 * @param {number} [options.show=0] - Index of the slide to start on. Numeration begins at 0.
 *
 * @param {(boolean)} [options.dots=true] - Display navigation dots.
 * @param {(boolean)} [options.arrows=true] - Display navigation arrows (PREV/NEXT).
 * @param {(boolean)} [options.buttons=true] - Display navigation buttons (STOP/PLAY).
 *
 * @param {(string)} [options.btnPlayText=Play] - Text for _PLAY_ button.
 * @param {(string)} [options.btnStopText=Stop] - Text for _STOP_ button.
 * @param {(string)} [options.arrPrevText=&laquo;] - Text for _PREV_ arrow.
 * @param {(string)} [options.arrNextText=&raquo;] - Text for _NEXT_ arrow.
 */
export default function Carousel(options) {
    var element = document.getElementById(options.elem || 'carousel'),
        interval = options.interval || 3000,

        btnPlayText = options.btnPlayText || 'Play',
        btnStopText = options.btnStopText || 'Stop',

        arrNextText = options.arrNextText || '&rsaquo;',
        arrPrevText = options.arrPrevText || '&lsaquo;',

        slidesPerCarousel = options.slides || 1,
        slideWith = options.slideWidth || 600,
        touch = options.touch || true,
        resize = options.resize || true,
        singleOnTouch = options.singleOnTouch || false,

        crslId = options.elem,
        crslClass = 'js-Carousel',
        crslArrowPrevClass = options.arrowPrev || 'js-Carousel-arrowPrev',
        crslArrowNextClass = options.arrowNext || 'js-Carousel-arrowNext',
        crslDotsClass = 'js-Carousel-dots',
        crslButtonStopClass = 'js-Carousel-btnStop',
        crslButtonPlayClass = 'js-Carousel-btnPlay',
        loop = options.infinite,

        count = element ? element.querySelectorAll('#' + crslId + ' > ul > li').length : 0,
        current = 0,
        cycle = null;

    var doc = document;
    var win = window;
    var KEYS = {
        ENTER: 13,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };

    // Format: IIFE
    // Version: 2.2.2

    // helper functions
    // check browser version and local storage
    // if browser upgraded,
    // 1. delete browser ralated data from local storage and
    // 2. recheck these options and save them to local storage
    var browserInfo = navigator.userAgent;
    // console.log(browserInfo);
    var localStorageAccess = true;
    var tnsStorage = localStorage;

    try {
        if (!tnsStorage['tnsApp']) {
            tnsStorage['tnsApp'] = browserInfo;
        } else if (tnsStorage['tnsApp'] !== browserInfo) {
            tnsStorage['tnsApp'] = browserInfo;

            // tC => calc
            // tSP => subpixel
            // tMQ => mediaquery
            // tTf => transform
            // tTDu => transitionDuration
            // tTDe => transitionDelay
            // tADu => animationDuration
            // tADe => animationDelay
            // tTE => transitionEnd
            // tAE => animationEnd

            ['tC', 'tSP', 'tMQ', 'tTf', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function (item) {
                tnsStorage.removeItem(item);
            })
        }
    } catch (e) {
        localStorageAccess = false;
    }

    // get browser related data from local storage if they exist
    // otherwise, run the functions again and save these data to local storage
    // checkStorageValue() convert non-string value to its original value: 'true' > true
    var CALC = checkStorageValue(tnsStorage['tC']) || setLocalStorage('tC', calc(), localStorageAccess);
    var SUBPIXEL = checkStorageValue(tnsStorage['tSP']) || setLocalStorage('tSP', subpixelLayout(), localStorageAccess);
    var CSSMQ = checkStorageValue(tnsStorage['tMQ']) || setLocalStorage('tMQ', mediaquerySupport(), localStorageAccess);
    var TRANSFORM = checkStorageValue(tnsStorage['tTf']) || setLocalStorage('tTf', whichProperty([
        'transform',
        'WebkitTransform',
        'MozTransform',
        'msTransform',
        'OTransform'
    ]), localStorageAccess);
    var TRANSITIONDURATION = checkStorageValue(tnsStorage['tTDu']) || setLocalStorage('tTDu', whichProperty([
        'transitionDuration',
        'WebkitTransitionDuration',
        'MozTransitionDuration',
        'OTransitionDuration'
    ]), localStorageAccess);
    var TRANSITIONDELAY = checkStorageValue(tnsStorage['tTDe']) || setLocalStorage('tTDe', whichProperty([
        'transitionDelay',
        'WebkitTransitionDelay',
        'MozTransitionDelay',
        'OTransitionDelay'
    ]), localStorageAccess);
    var ANIMATIONDURATION = checkStorageValue(tnsStorage['tADu']) || setLocalStorage('tADu', whichProperty([
        'animationDuration',
        'WebkitAnimationDuration',
        'MozAnimationDuration',
        'OAnimationDuration'
    ]), localStorageAccess);
    var ANIMATIONDELAY = checkStorageValue(tnsStorage['tADe']) || setLocalStorage('tADe', whichProperty([
        'animationDelay',
        'WebkitAnimationDelay',
        'MozAnimationDelay',
        'OAnimationDelay'
    ]), localStorageAccess);
    var TRANSITIONEND = checkStorageValue(tnsStorage['tTE']) || setLocalStorage('tTE', getEndProperty(TRANSITIONDURATION, 'Transition'), localStorageAccess);
    var ANIMATIONEND = checkStorageValue(tnsStorage['tAE']) || setLocalStorage('tAE', getEndProperty(ANIMATIONDURATION, 'Animation'), localStorageAccess);

    // reset SUBPIXEL for IE8
    if (!CSSMQ) {
        SUBPIXEL = false;
    }

    var touchEvents = {
            'touchstart': onTouchOrMouseStart,
            'touchmove': onTouchOrMouseMove,
            'touchend': onTouchOrMouseEnd,
            'touchcancel': onTouchOrMouseEnd
        }, dragEvents = {
            'mousedown': onTouchOrMouseStart,
            'mousemove': onTouchOrMouseMove,
            'mouseup': onTouchOrMouseEnd,
            'mouseleave': onTouchOrMouseEnd
        },
        slideOffsetTops,
        container = element ? element.firstElementChild : null,
        navContainer = false,
        items = getOption('items'),
        indexAdjust = !loop && checkOption('edgePadding') ? 1 : 0,
        indexMin = indexAdjust,
        hasTouch = touch,
        touchedOrDraged,
        hasMouseDrag = true,
        vpOuter = element ? element.clientWidth : 0,
        vpInner,
        resizeTimer,
        events = new Events(),
        slideCount = count,
        horizontal = 'horizontal' ? true : false,
        vpInner = element ? element.offsetWidth : 0,
        transformAttr = horizontal ? 'left' : 'top',
        transformPrefix = '',
        transformPostfix = '',
        checkIndexBeforeTransform = !element || !loop ? true : false;

    // touch
    if (hasTouch) {
        var touch = getOption('touch'),
            startX = null,
            startY = null,
            translateInit,
            disX,
            disY;
    }


    if (TRANSFORM) {
        transformAttr = TRANSFORM;
        transformPrefix = 'translate';
        transformPrefix += horizontal ? 'X(' : 'Y(';
        transformPostfix = ')';
    }

    // mouse drag
    if (hasMouseDrag) {
        var mouseDrag = getOption('mouseDrag'),
            isDragEvent = false;
    }


    // (slideBy, indexMin, indexMax) => index
    var checkIndex = (function () {
        if (loop) {
            return function () {
                var leftEdge = indexMin, rightEdge = indexMax;
                if (carousel) {
                    leftEdge += slideBy;
                    rightEdge -= slideBy;
                }

                var gt = gutter ? gutter : 0;
                if (fixedWidth && vpOuter % (fixedWidth + gt) > gt) {
                    rightEdge -= 1;
                }

                if (index > rightEdge) {
                    while (index >= leftEdge + slideCount) {
                        index -= slideCount;
                    }
                } else if (index < leftEdge) {
                    while (index <= rightEdge - slideCount) {
                        index += slideCount;
                    }
                }
            };
        } else {
            return function () {
                index = Math.max(indexMin, Math.min(indexMax, index));
            };
        }
    })();

    // Test via a getter in the options object to see if the passive property is accessed
    // var supportsPassive = false;
    // try {
    //     var opts = Object.defineProperty({}, 'passive', {
    //         get: function() {
    //           supportsPassive = true;
    //         }
    //     });
    // window.addEventListener("test", null, opts);
    // } catch (e) {}
    // var passiveOption = supportsPassive ? { passive: true } : false;

    /**
     * Render the carousel if more than one slide.
     * Otherwise just show the single item.
     */


    function init() {
        if (element) {
            // console.log("existe element");
            // console.log(element);
            element.firstElementChild.style.visibility = "visible";

            var widthSlider = element.offsetWidth;
            // console.log("ancho del slider");
            // console.log(widthSlider);

            if (count > 1) {
                if (widthSlider > 0) {
                    setwidthbyslides();
                }
                render();
            }
        } else {
            // console.log("no existe element");
        }
    }

    /**
     * Render the carousel and all the navigation elements (arrows, dots,
     * play/stop buttons) if needed. Start with a particular slide, if set.
     * If infinite - move the last item to the very beginning and off the display area.
     */
    function render() {
        var actions = {
            resize: function () {
                return setResize();
            },
            dots: function () {
                return showDots();
            },
            arrows: function () {
                return showArrows();
            },
            buttons: function () {
                return showButtons();
            },
            autoplay: function () {
                return play();
            },
            touch: function () {
                return setTouch();
            },
            infinite: function () {
                var marginLeft = element.offsetWidth;

                marginLeft = setResponsiveSlides(slidesPerCarousel);

                return moveItem(count - 1, -(marginLeft) + 'px', 'afterBegin');
            },
            initial: function () {
                var initial = 0 || (options.initial >= count) ? count : options.initial;
                return show(initial, '');
            }
        };

        for (var key in actions) {
            if (options.hasOwnProperty(key) && options[key]) {
                actions[key]();
            }
        }
    }

    function setwidthbyslides() {

        element.style.backgroundImage = "none";

        var itemsLi = element.querySelectorAll('#' + crslId + ' > ul > li');

        var widthLi = setResponsiveSlides(slidesPerCarousel);

        //element.firstElementChild.style.width = widthLi * itemsLi.length + 'px';

        for (var i = 0; i < itemsLi.length; i++) {
            itemsLi[i].style.width = widthLi + 'px';
        }

    }

    function checkStorageValue(value) {
        return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value;
    }

    function setLocalStorage(key, value, access) {
        if (access) {
            localStorage.setItem(key, value);
        }
        return value;
    }

    function calc() {
        var doc = document,
            body = getBody(),
            docOverflow = setFakeBody(body),
            div = doc.createElement('div'),
            result = false;

        body.appendChild(div);
        try {
            var vals = ['calc(10px)', '-moz-calc(10px)', '-webkit-calc(10px)'], val;
            for (var i = 0; i < 3; i++) {
                val = vals[i];
                div.style.width = val;
                if (div.offsetWidth === 10) {
                    result = val.replace('(10px)', '');
                    break;
                }
            }
        } catch (e) {
        }

        body.fake ? resetFakeBody(body, docOverflow) : div.remove();

        return result;
    }

    var docElement = document.documentElement;

    function setFakeBody(body) {
        var docOverflow = '';
        if (body.fake) {
            docOverflow = docElement.style.overflow;
            //avoid crashing IE8, if background image is used
            body.style.background = '';
            //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
            body.style.overflow = docElement.style.overflow = 'hidden';
            docElement.appendChild(body);
        }

        return docOverflow;
    }

    function resetFakeBody(body, docOverflow) {
        if (body.fake) {
            body.remove();
            docElement.style.overflow = docOverflow;
            // Trigger layout so kinetic scrolling isn't disabled in iOS6+
            // eslint-disable-next-line
            docElement.offsetHeight;
        }
    }

    function getBody() {
        var doc = document,
            body = doc.body;

        if (!body) {
            body = doc.createElement('body');
            body.fake = true;
        }

        return body;
    }

    // check if an image is loaded
    // 1. See if "naturalWidth" and "naturalHeight" properties are available.
    // 2. See if "complete" property is available.

    function imageLoaded(img) {
        if (typeof img.complete === 'boolean') {
            return img.complete;
        } else if (typeof img.naturalWidth === 'number') {
            return img.naturalWidth !== 0;
        }
    }

    function whichProperty(props) {
        var el = document.createElement('fakeelement'),
            len = props.length;
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (el.style[prop] !== undefined) {
                return prop;
            }
        }

        return false; // explicit for ie9-
    }

    // get transitionend, animationend based on transitionDuration
    // @propin: string
    // @propOut: string, first-letter uppercase
    // Usage: getEndProperty('WebkitTransitionDuration', 'Transition') => webkitTransitionEnd
    function getEndProperty(propIn, propOut) {
        var endProp = false;
        if (/^Webkit/.test(propIn)) {
            endProp = 'webkit' + propOut + 'End';
        } else if (/^O/.test(propIn)) {
            endProp = 'o' + propOut + 'End';
        } else if (propIn) {
            endProp = propOut.toLowerCase() + 'end';
        }
        return endProp;
    }

    // get subpixel support value
    // @return - boolean
    function subpixelLayout() {
        var doc = document,
            body = getBody(),
            docOverflow = setFakeBody(body),
            parent = doc.createElement('div'),
            child1 = doc.createElement('div'),
            child2,
            supported;

        parent.style.cssText = 'width: 10px';
        child1.style.cssText = 'float: left; width: 5.5px; height: 10px;';
        child2 = child1.cloneNode(true);

        parent.appendChild(child1);
        parent.appendChild(child2);
        body.appendChild(parent);

        supported = child1.offsetTop !== child2.offsetTop;

        body.fake ? resetFakeBody(body, docOverflow) : parent.remove();

        return supported;
    }

    function mediaquerySupport() {
        var doc = document,
            body = getBody(),
            docOverflow = setFakeBody(body),
            div = doc.createElement('div'),
            style = doc.createElement('style'),
            rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}',
            position;

        style.type = 'text/css';
        div.className = 'tns-mq-test';

        body.appendChild(style);
        body.appendChild(div);

        if (style.styleSheet) {
            style.styleSheet.cssText = rule;
        } else {
            style.appendChild(doc.createTextNode(rule));
        }

        position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position'];

        body.fake ? resetFakeBody(body, docOverflow) : div.remove();

        return position === "absolute";
    }

    // === COMMON FUNCTIONS === //
    function checkOption(item) {
        var result = options[item];
        /*if (!result && breakpoints && responsiveItems.indexOf(item) >= 0) {
            breakpoints.forEach(function (bp) {
                if (responsive[bp][item]) { result = true; }
            });
        }*/
        return result;
    }

    function getOption(item, view) {
        view = view ? view : vpOuter;
        var result;

        if (item === 'items' && getOption('fixedWidth')) {
            result = Math.floor(view / (getOption('fixedWidth') + getOption('gutter')));
        } else if (item === 'slideBy' && !element) {
            result = 'page';
        } else if (item === 'edgePadding' && !element) {
            result = false;
        } else if (item === 'autoHeight' && (!element || nested === 'outer')) {
            result = true;
        } else {
            result = options[item];

            // if (breakpoints && responsiveItems.indexOf(item) >= 0) {
            //   for (var i = 0, len = breakpoints.length; i < len; i++) {
            //     var bp = breakpoints[i];
            //     if (view >= bp) {
            //       if (item in responsive[bp]) { result = responsive[bp][item]; }
            //     } else { break; }
            //   }
            // }

        }

        if (item === 'items') {
            result = Math.max(1, Math.min(slideCount, result));
        }
        if (item === 'slideBy' && result === 'page') {
            result = getOption('items');
        }

        return result;
    }

    function setTouch() {
        // console.log("entro al touch de render");
        if (touch) {
            addEvents(element, touchEvents);
        }
        ;
    }

    // var touchEvents = {
    //     'touchstart': onTouchOrMouseStart,
    //     'touchmove': onTouchOrMouseMove,
    //     'touchend': onTouchOrMouseEnd,
    //     'touchcancel': onTouchOrMouseEnd
    //   }, dragEvents = {
    //     'mousedown': onTouchOrMouseStart,
    //     'mousemove': onTouchOrMouseMove,
    //     'mouseup': onTouchOrMouseEnd,
    //     'mouseleave': onTouchOrMouseEnd
    //   }


    function addEvents(el, obj) {
        // console.log("----------ADDEVENTS----------");
        // console.log("ENTRO A addEvents");
        // console.log("param el: " + el);
        // console.log(el);
        // console.log("param obj: "+ obj);
        // console.log(obj);
        for (var prop in obj) {
            // console.log("valor de prop: "+ prop);
            // console.log("valor de obj: "+ obj);
            // console.log("valor obj prod");
            // console.log(obj[prop]);
            var option = (prop === 'touchstart' || prop === 'touchmove') ? true : false;
            el.addEventListener(prop, obj[prop], option);
        }
        // console.log("----------ADDEVENTS----------");
    }


    function Events() {
        // console.log("-------------------------------");
        // console.log("ENTRO A Events");
        return {
            topics: {},
            on: function (eventName, fn) {
                this.topics[eventName] = this.topics[eventName] || [];
                this.topics[eventName].push(fn);
            },
            off: function (eventName, fn) {
                if (this.topics[eventName]) {
                    for (var i = 0; i < this.topics[eventName].length; i++) {
                        if (this.topics[eventName][i] === fn) {
                            this.topics[eventName].splice(i, 1);
                            break;
                        }
                    }
                }
            },
            emit: function (eventName, data) {
                // console.log("ENTRO AL EMIT");
                // console.log("eventName: " + eventName);
                // console.log("data: ");
                // console.log(data);
                // console.log(this.topics[eventName]);
                if (this.topics[eventName]) {
                    this.topics[eventName].forEach(function (fn) {
                        fn(data);
                    });
                }
            }
        };
    }

    function onTouchOrMouseEnd(e) {
        // console.log("*******************************************");
        // console.log("entro a onTouchOrMouseEnd");
        e = e || win.event;
        // console.log(e);

        // console.log("VALORES INICIALES");
        // console.log("valor de startX");
        // console.log(startX);
        // console.log("valor de startY");
        // console.log(startY);
        // console.log("valor de touchedOrDraged");
        // console.log(touchedOrDraged);

        if (touchedOrDraged) {
            // console.log("si touchedOrDraged es true");
            touchedOrDraged = false;
            var ev;

            if (isTouchEvent(e)) {
                ev = e.changedTouches[0];
                //events.emit('touchEnd', info(e));
            } else {
                ev = e;
                //events.emit('dragEnd', info(e));
            }

            disX = parseInt(ev.clientX) - startX;
            // console.log("FINAL disX");
            // console.log(disX);
            disY = parseInt(ev.clientY) - startY;
            // console.log("FINAL disY");
            // console.log(disY);

            // reset startX, startY
            startX = startY = null;
            // console.log("reset startX y startY");
            // console.log("startX: "+startX);
            // console.log("startY: "+startY);

            element.firstElementChild.style.transform = "translateX(0px)";

            var marginLeft = setResponsiveSlides(slidesPerCarousel);

            if (disX >= 0) { //aca showPrev
                // para la izquierda (prev)
                if(singleOnTouch){
                    var btnArrowPrev = document.getElementsByClassName(crslArrowPrevClass)[0];
                    var btnArrowNext = document.getElementsByClassName(crslArrowNextClass)[0];
                    var widthSlider = element.offsetWidth;
                    var widthLi = setResponsiveSlides(slidesPerCarousel);
                    var quantityOfSLiders = Math.floor(widthSlider/widthLi) - 1;

                    if(current == 0){
                        if (btnArrowPrev) {btnArrowPrev.style.display = "none";};
                        if (btnArrowNext) {btnArrowNext.style.display = "block";};
                        //showPrev();
                    }else if( current > 0 && (current < (count-quantityOfSLiders) ) ){
                        showPrev();
                        if (btnArrowPrev) {btnArrowPrev.style.display = "block";};
                        if (btnArrowNext) {btnArrowNext.style.display = "block";};

                        if( current == 0 ){
                            if (btnArrowPrev) {btnArrowPrev.style.display = "none";};
                            if (btnArrowNext) {btnArrowNext.style.display= "block";};
                        }
                    }
                    //
                    // if( quantityOfSLiders == 1 ){
                    //     if(current == 0){
                    //         btnArrowPrev.style.display = "none";
                    //         //showPrev();
                    //     }else if( current > 0 && (current < (count-quantityOfSLiders) ) ){
                    //         btnArrowPrev.style.display = "block";
                    //         showPrev();
                    //     } else if( (count-quantityOfSLiders) == current ){
                    //         btnArrowPrev.style.display = "block";
                    //         showPrev();
                    //     }
                    // }else if( quantityOfSLiders > 1 && quantityOfSLider < slidesPerCarousel ){
                    //     if(current == 0){
                    //         btnArrowPrev.style.display = "none";
                    //         //showPrev();
                    //     }else if( current > 0 && (current < (count-quantityOfSLiders) ) ){
                    //         btnArrowPrev.style.display = "block";
                    //         showPrev();
                    //     } else if( (count-2) == current ){
                    //         btnArrowPrev.style.display = "block";
                    //         showPrev();
                    //     }
                    // }
                    //
                    // if(current == 0){
                    //     btnArrowPrev.style.display = "none";
                    //     //showPrev();
                    // }else if( current > 0 && (current < (count-2) ) ){
                    //     btnArrowPrev.style.display = "block";
                    //     showPrev();
                    // } else if( (count-2) == current ){
                    //     btnArrowPrev.style.display = "block";
                    //     showPrev();
                    // }
                }else{
                    showPrev();
                }
            } else if (disX < 0) {// showNext
                // para la derecha (next)
                if(singleOnTouch){
                    var btnArrowPrev = document.getElementsByClassName(crslArrowPrevClass)[0];
                    var btnArrowNext = document.getElementsByClassName(crslArrowNextClass)[0];
                    var widthSlider = element.offsetWidth;
                    var widthLi = setResponsiveSlides(slidesPerCarousel);
                    var quantityOfSLiders = Math.floor(widthSlider/widthLi);

                    if(current == 0){
                        showNext();
                        if (btnArrowNext) {btnArrowNext.style.display = "block";};
                        if (btnArrowPrev) {btnArrowPrev.style.display = "block";};
                    }else if( current > 0 && (current < ( count - quantityOfSLiders) ) ){
                        showNext();
                        if (btnArrowNext) {btnArrowNext.style.display = "block";};
                        if (btnArrowPrev) {btnArrowPrev.style.display = "block";};

                        if( (count - quantityOfSLiders) == current ){
                            if (btnArrowPrev) {btnArrowPrev.style.display = "block";};
                            if (btnArrowNext) {btnArrowNext.style.display = "none";};
                        }
                    }
                }else{
                    showNext();
                }
            }

            // var marginLeft = setResponsiveSlides(slidesPerCarousel);
            // element.firstElementChild.style.transform = "translateX(" + disX + "px)";
            // element.firstElementChild.style.transitionDuration = '0.4s';


            // if (horizontal) {
            //   var indexMoved = - disX * items / vpInner;
            //   indexMoved = disX > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
            //   index += indexMoved;
            // } else {
            //   var moved = - (translateInit + disY);
            //   if (moved <= 0) {
            //     index = indexMin;
            //   } else if (moved >= slideOffsetTops[slideOffsetTops.length - 1]) {
            //     index = indexMax;
            //   } else {
            //     var i = 0;
            //     do {
            //       i++;
            //       index = disY < 0 ? i + 1 : i;
            //     } while (i < slideCountNew && moved >= slideOffsetTops[i + 1]);
            //   }
            // }

            // renderPro();

            // // drag vs click
            // if (isDragEvent) {
            //   // reset isDragEvent
            //   isDragEvent = false;

            //   // prevent "click"
            //   var target = getTarget(e);
            //   addEvents(target, {'click': function preventClick (e) {
            //     preventDefaultBehavior(e);
            //     removeEvents(target, {'click': preventClick});
            //   }});
            // }


        }
    }

    function renderPro() {
        if (checkIndexBeforeTransform) {
            checkIndex();
        }
        if (index !== indexCached) {
            // events
            events.emit('indexChanged', info());
            events.emit('transitionStart', info());

            running = true;
            doTransform();
        }
    }

    function getTarget(e) {
        return e.target || e.srcElement;
    }

    function removeEvents(el, obj) {
        // console.log("-------------------------------");
        // console.log("ENTRO A removeEvents");
        // console.log("param el: " + el);
        // console.log("param obj: "+ obj);
        for (var prop in obj) {
            var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? true : false;
            el.removeEventListener(prop, obj[prop], option);
        }
        // console.log("-------------------------------");
    }

    function eventEmit(eventName, data) {
        // console.log("ENTRO AL eventEmit");
        // console.log("eventName: " + eventName);
        // console.log("data: ");
        // console.log(data);
        if (this.topics[eventName]) {
            this.topics[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    }

    function info(e) {
        // console.log("ENTRO AL INFO");
        // console.log("container: "+ container);
        // console.log("slideItems: "+ slideItems);
        // console.log("navContainer: "+ navContainer);
        // console.log("navItems: "+ navItems);
        // console.log("controlsContainer: "+ controlsContainer);
        // console.log("prevButton: "+ prevButton);
        // console.log("nextButton: "+ nextButton);
        // console.log("items: "+ items);
        // console.log("event: "+ e || {});
        return {
            container: container,
            slideItems: slidesPerCarousel,
            navContainer: element,
            navItems: element,
            controlsContainer: controlsContainer,
            prevButton: crslArrowPrevClass,
            nextButton: crslArrowNextClass,
            items: count,
            event: e || {},
        };
    }

    function onTouchOrMouseStart(e) {
        // console.log("---------------onTouchOrMouseStart------------------");
        // console.log("entro a onTouchOrMouseStart");
        // console.log("event: "+ e);
        e = e || win.event;
        // console.log(e);
        var ev;

        if (isTouchEvent(e)) {
            // console.log("si isTouchEvent es true");
            ev = e.changedTouches[0];
            // console.log("valor ev: "+ ev);
            // console.log(ev);
            //events.emit('touchStart', info(e));
            //eventEmit("touchStart", info(e));
        } else {
            // console.log("si isTouchEvent es FALSE " + e);
            ev = e;
            // console.log("valor ev: "+ ev);
            // console.log(ev);
            preventDefaultBehavior(e);
            events.emit('dragStart', info(e));
        }

        startX = parseInt(ev.clientX);
        // console.log("startX: "+ startX);
        // console.log(startX);
        startY = parseInt(ev.clientY);
        // console.log("startY: "+ startX);
        // console.log(startY);
        // console.log("comienzo de translateInit");
        // console.log("transformAttr: "+ transformAttr);
        // console.log("transformPrefix: "+ transformPrefix);
        // console.log("transformPostfix: "+ transformPostfix);
        translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, '').replace(transformPostfix, ''));
        // console.log("translateInit: ");
        // console.log(translateInit);
        // console.log("---------------onTouchOrMouseStart------------------");
    }


    function getTouchDirection(angle, range) {
        // console.log("----------------------------------");
        // console.log("entro al getTouchDirection");
        // console.log("param angle: " + angle);
        // console.log("param range: " + range);
        var direction = false,
            gap = Math.abs(90 - Math.abs(angle));
        // console.log("gap: "+gap);

        if (gap >= 90 - range) {
            // console.log("si gap: " + gap + " es >= a "+ range + " entonces:");
            direction = 'horizontal';
            // console.log("direction: "+ direction);
        } else if (gap <= range) {
            direction = 'vertical';
            // console.log("direction: "+ direction);
        }
        // console.log("----------------------------------");
        return direction;

    }

    function toDegree(y, x) {
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    function preventDefaultBehavior(e) {
        // console.log("ENTRO A preventDefaultBehavior");
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    function isTouchEvent(e) {
        // console.log("---------------------------------------");
        // console.log("entro a isTouchEvent");
        // console.log("valor del return: "+ e.type.indexOf('touch') + " es >= 0" );
        // console.log("---------------------------------------");
        return e.type.indexOf('touch') >= 0;
    }

    function onTouchOrMouseMove(e) {
        // console.log("+++++++++++++++++++++++++++++++++++++++++");
        // console.log("entro a onTouchOrMouseMove");
        // console.log("event: "+ e);
        e = e || win.event;
        // console.log(e);
        //make sure touch started or mouse draged
        // console.log("valor de startX");
        // console.log(startX);
        // console.log("valor de startY");
        // console.log(startY);
        if (startX !== null) {
            // console.log("si startX es diferente de null");
            var ev;
            if (isTouchEvent(e)) {
                // console.log("si isTouchEvent es true");
                ev = e.changedTouches[0];
                // console.log(ev);
            } else {
                // console.log("si no es true");
                ev = e;
                // console.log(ev);
                preventDefaultBehavior(e);
            }

            disX = parseInt(ev.clientX) - startX;
            // console.log("disX");
            // console.log(disX);
            disY = parseInt(ev.clientY) - startY;
            // console.log("disY");
            // console.log(disY);

            if (getTouchDirection(toDegree(disY, disX), 15) === 'horizontal' && disX) {
                // console.log("ENTRO SI SE CUMPLE getTouchDirection");

                var x = translateInit;

                x += disX;
                x += 'px';

                // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                // console.log(x);

                // console.log("ELEMENTTTTTTTTTTTTTTTTTTTTTTTTTTT");
                // console.log(element);

                // var marginLeft = setResponsiveSlides(slidesPerCarousel);

                // disX = ( disX > marginLeft ) ? marginLeft : disX;


                element.firstElementChild.style.transform = "translateX(" + disX + "px)";
                element.firstElementChild.style.transitionDuration = '0.4s';

                //var marginLeft = setResponsiveSlides(slidesPerCarousel);

                // element.firstElementChild.style.marginLeft = -marginLeft + disX + "px";
                // element.firstElementChild.style.transitionDuration = '0.4s';


                if (isTouchEvent(e)) {
                    //events.emit('touchMove', info(e));
                } else {
                    // "mousemove" event after "mousedown" indecate
                    // it is "drag", not "click"
                    if (!isDragEvent) {
                        isDragEvent = true;
                    }
                    //events.emit('dragMove', info(e));
                }

                // console.log("valor de touchedOrDraged");
                // console.log(!touchedOrDraged);

                if (!touchedOrDraged) {
                    touchedOrDraged = true;
                }

                // var x = translateInit;

                // x += disX;
                // x += 'px';

                // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                // console.log(x);

                // console.log("ELEMENTTTTTTTTTTTTTTTTTTTTTTTTTTT");
                // console.log(element);
                // element.style.transform = "translateX(" + x + ")";

                // if (horizontal == 'horizontal') {
                //     console.log("entro en el if de horizontal");
                //     if (fixedWidth) {
                //         x += disX;
                //         x += 'px';
                //     } else {
                //         var percentageX = TRANSFORM ? disX * items * 100 / (vpInner * slideCountNew): disX * 100 / vpInner;
                //         x += percentageX;
                //         x += '%';
                //     }
                // } else {
                //     x += disY;
                //     x += 'px';
                // }

                // if (TRANSFORM) { setDurations(0); }
                // element.style[transformAttr] = transformPrefix + x + transformPostfix;


            }
        }
    }


    // set duration
    function setDurations(duration, target) {
        duration = !duration ? '' : duration / 1000 + 's';
        target = target || container;
        target.style[TRANSITIONDURATION] = duration;

        if (!element) {
            target.style[ANIMATIONDURATION] = duration;
        }
        if (!horizontal) {
            innerWrapper.style[TRANSITIONDURATION] = duration;
        }
    }

    // make transfer after click/drag:
    // 1. change 'transform' property for mordern browsers
    // 2. change 'left' property for legacy browsers
    var transformCore = (function () {
        // carousel
        if (element) {
            return function (duration, distance) {
                if (!distance) {
                    distance = getContainerTransformValue();
                }
                // constrain the distance when non-loop no-edgePadding fixedWidth reaches the right edge
                if (hasRightDeadZone && index === indexMax) {
                    var containerRightEdge = TRANSFORM ?
                        -((slideCountNew - items) / slideCountNew) * 100 :
                        -(slideCountNew / items - 1) * 100;
                    distance = Math.max(parseFloat(distance), containerRightEdge) + '%';
                }

                if (TRANSITIONDURATION || !duration) {
                    doContainerTransform(distance);
                    if (speed === 0) {
                        onTransitionEnd();
                    }
                } else {
                    jsTransform(container, transformAttr, transformPrefix, transformPostfix, distance, speed, onTransitionEnd);
                }

                if (!horizontal) {
                    updateContentWrapperHeight();
                }
            };

            // gallery
        } else {
            return function () {
                slideItemsOut = [];

                var eve = {};
                eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
                removeEvents(slideItems[indexCached], eve);
                addEvents(slideItems[index], eve);

                animateSlide(indexCached, animateIn, animateOut, true);
                animateSlide(index, animateNormal, animateIn);

                if (!TRANSITIONEND || !ANIMATIONEND || speed === 0) {
                    setTimeout(onTransitionEnd, 0);
                }
            };
        }
    })();

    function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
        // console.log("-------------------------------");
        // console.log("ENTRO A jsTransform");
        // console.log("param element: "+ element);
        // console.log("param attr: "+ attr);
        // console.log("param prefix: "+ prefix);
        // console.log("param postfix: "+ postfix);
        // console.log("param to: "+ to);
        // console.log("param duration: "+ duration);
        // console.log("______________");
        var tick = Math.min(duration, 10),
            unit = (to.indexOf('%') >= 0) ? '%' : 'px',
            to = to.replace(unit, ''),
            from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')),
            positionTick = (to - from) / duration * tick,
            running;
        // console.log("tick: " + tick);
        // console.log("unit: " + unit);
        // console.log("to: " + to);
        // console.log("from: "+ from);
        // console.log("positionTick: "+ positionTick);
        // console.log("running: "+ running);

        setTimeout(moveElement, tick);

        function moveElement() {
            duration -= tick;
            from += positionTick;
            element.style[attr] = prefix + from + unit + postfix;
            if (duration > 0) {
                setTimeout(moveElement, tick);
            } else {
                callback();
            }
        }

        // console.log("callback: "+ callback());
    }

    /**
     * Calculate responsive slider
     *
     * @param {number} slide - The index of the item.
     * @public
     */
    function setResponsiveSlides(slidesPerCarousel) {

        var widthSlider = element.offsetWidth;
        var slidesPerCarouselResponsive = slidesPerCarousel;
        var minWidthLi = slideWith * 0.87;
        var marginLeft = widthSlider / slidesPerCarouselResponsive;

        if (marginLeft < minWidthLi && slidesPerCarouselResponsive > 1) {
            return setResponsiveSlides(slidesPerCarouselResponsive - 1);
        } else {
            return marginLeft;
        }
    }

    /**
     * Helper for moving items - last to be first or first to be the last. Needed
     * for infinite rotation of the carousel.
     *
     * @param {number} i - Position of the list item to move (either first or last).
     * @param {number} marginLeft - Left margin to position the item off-screen
     *        at the beginning or no margin at the end.
     * @param {string} position - Where to insert the item. One of the following -
     *        'afterBegin' or 'beforeEnd'.
     */
    function moveItem(i, marginLeft, position) {
        var itemToMove = element.querySelectorAll('#' + crslId + ' > ul > li')[i];
        itemToMove.style.marginLeft = marginLeft;

        element.querySelector('#' + crslId + ' > ul').removeChild(itemToMove);

        element.querySelector('#' + crslId + ' > ul').insertAdjacentHTML(position, itemToMove.outerHTML);
    }

    /**
     * Create the navigation dots and attach to carousel.
     */
    function showDots() {
        var dotContainer = document.createElement('ul');
        dotContainer.classList.add(crslDotsClass);
        dotContainer.addEventListener('click', scrollToImage.bind(this));

        for (var i = 0; i < count; i++) {
            var dotElement = document.createElement('li');
            dotElement.setAttribute('data-position', i);

            dotContainer.appendChild(dotElement);
        }

        element.appendChild(dotContainer);
        currentDot();
    }

    /**
     * Highlight the corresponding dot of the currently visible carousel item.
     */
    function currentDot() {
        [].forEach.call(element.querySelectorAll('.' + crslDotsClass + ' li'), function (item) {
            item.classList.remove('is-active');
        });

        switch (current) {
            case -1:
                current = count - 1;
                break;
            case count:
                current = 0;
                break;
            default:
                current = current;
        }

        element.querySelectorAll('.' + crslDotsClass + ' li')[current].classList.add('is-active');
    }

    /**
     * Moves the carousel to the desired slide on a navigation dot click.
     *
     * @param {object} e - The clicked dot element.
     */
    function scrollToImage(e) {
        if (e.target.tagName === 'LI') {
            show(e.target.getAttribute('data-position'), '');
        }
    }

    /**
     * Create the navigation arrows (prev/next) and attach to carousel.
     */
    function showArrows() {
        // console.log("entro a showArrows");
        if (crslArrowPrevClass == 'js-Carousel-arrowPrev' && crslArrowNextClass == 'js-Carousel-arrowNext') {

            var buttonPrev = document.createElement('button');
            buttonPrev.innerHTML = arrPrevText;
            buttonPrev.classList.add(crslArrowPrevClass);

            var buttonNext = document.createElement('button');
            buttonNext.innerHTML = arrNextText;
            buttonNext.classList.add(crslArrowNextClass);

            buttonPrev.addEventListener('click', showPrev);
            buttonNext.addEventListener('click', showNext);

            element.appendChild(buttonPrev);
            element.appendChild(buttonNext);

        } else if ((crslArrowPrevClass !== 'js-Carousel-arrowPrev') && (crslArrowPrevClass.length > 0) && (crslArrowNextClass !== 'js-Carousel-arrowNext') && (crslArrowNextClass.length > 0)) {

            var buttonPrev = document.querySelectorAll('.' + crslArrowPrevClass)[0];
            var buttonNext = document.querySelectorAll('.' + crslArrowNextClass)[0];

            buttonPrev.addEventListener('click', showPrev);
            buttonNext.addEventListener('click', showNext);
        }

    }

    /**
     * Create the navigation buttons (play/stop) and attach to carousel.
     */
    function showButtons() {
        var buttonPlay = document.createElement('button');
        buttonPlay.innerHTML = btnPlayText;
        buttonPlay.classList.add(crslButtonPlayClass);
        buttonPlay.addEventListener('click', play);

        var buttonStop = document.createElement('button');
        buttonStop.innerHTML = btnStopText;
        buttonStop.classList.add(crslButtonStopClass);
        buttonStop.addEventListener('click', stop);

        element.appendChild(buttonPlay);
        element.appendChild(buttonStop);
    }

    /**
     * Animate the carousel to go back 1 slide. Moves the very first (off-screen)
     * item to the visible area.
     *
     * @param {object} item - The element to move into view.
     */
    function animatePrev(item) {
        item.style.marginLeft = '';
    }

    /**
     * Animate the carousel to go forward 1 slide.
     *
     * @param {object} item - The element to move into view.
     */
    function animateNext(item) {
        var marginLeft = element.offsetWidth;

        marginLeft = setResponsiveSlides(slidesPerCarousel);

        item.style.marginLeft = -(marginLeft) + 'px';
    }


    /**
     * Move the carousel to the desired slide.
     *
     * @param {number} slide - The index of the item.
     * @public
     */
    function show(slide, opt) {
        // console.log("ENTRO AL SHOW");
        // console.log("slide: " + slide);
        // console.log("opt: " + opt);
        var delta = current - slide;

        if (opt && opt === 'noanimation') {
            //console.log('tiene opt');
            moveNoAnimation(slide);
        } else {
            //console.log('no tiene opt');
            if (delta < 0) {
                moveByDelta(-delta, showNext);
            } else {
                moveByDelta(delta, showPrev);
            }
        }
        // console.log("antes del set none");
        element.style.backgroundImage = "none";

    }

    /**
     * Helper to move the slides by index.
     *
     * @param {number} delta - how many slides to move.
     * @param {function} direction - function to move forward or back.
     */
    function moveNoAnimation(delta, direction) {
        //console.log("ENTRO AL moveNoAnimation");
        var marginLeft = element.offsetWidth;
        var contentSlider = element.querySelector('ul:first-child');
        //console.log(contentSlider);
        var itemsNoAnima = contentSlider.querySelectorAll('.js-Carousel_slide-items');
        //console.log("delta: " +delta);
        current = delta;
        // var items = document.querySelectorAll('#' + crslId + ' > ul > li');

        // console.log('marginLeft', marginLeft);
        // console.log('element', element);
        // console.log('items', items.length);
        // console.log('itemSlide', delta);

        // Agregamos no-animation
        // for (var i = 0; i < delta; i++) {
        // console.log('moveNoAnimation', delta, i)
        //items[i].classList.add('no-transition');
        // }

        // Agregamos marginLeft
        //item = items[delta];
        for (var i = 0; i < delta; i++) {
            var item = itemsNoAnima[i];
            marginLeft = setResponsiveSlides(slidesPerCarousel);
            // console.log('item', item)
            // console.log('marginLeft', marginLeft)
            item.style.marginLeft = -(marginLeft) + 'px';
            // console.log('ready!', item.style.marginLeft)
        }
        // console.log('ready sliders!', current)
        var activeSlide = itemsNoAnima[delta];
        //console.log(activeSlide);
        if (activeSlide){
            activeSlide.classList.add('js-Carousel_active');
        }
        // marginLeft = setResponsiveSlides(slidesPerCarousel);
        // console.log('marginLeft', marginLeft)
        // item.style.marginLeft = -(marginLeft) + 'px';
        // animateNext(document.querySelectorAll('#' + crslId + ' > ul > li')[delta]);
        // adjustCurrent(1);

        // Removemos no-animation
        /*for (var i = 0; i < (delta + 1); i++) {
            console.log('removiendo class', delta, i)
            //items[i].classList.remove('no-transition');
        }*/

        //marginLeft = setResponsiveSlides(slidesPerCarousel);

        //item.style.marginLeft = -(marginLeft) + 'px';

        /*for (var i = 0; i < delta; i++) {
            console.log('moveNoAnimation', delta, i)
            //direction();
        }*/
    }

    /**
     * Helper to move the slides by index.
     *
     * @param {number} delta - how many slides to move.
     * @param {function} direction - function to move forward or back.
     */
    function moveByDelta(delta, direction) {
        for (var i = 0; i < delta; i++) {
            direction();
        }
    }


    function setResize() {
        // console.log("setResizesetResizes");
        win.addEventListener("resize", onResize);
    }

    // === ON RESIZE ===
    function onResize(e) {
        // console.log("ENTRO AL onResize");
        e = e || win.event;

        // console.log(e);

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            //clearAll();
            init();
        }, 100); // update after stop resizing for 100 ms
    }

    /**
     * remove active class for all slides.
     *
     * @public
     */
    function clearActiveSlide() {
        //console.log("entro al clearActiveSlide");
        let allSlides = document.getElementsByClassName('js-Carousel_slide-items');
        for (var i = 0; i < allSlides.length; i++) {
            allSlides[i].classList.remove('js-Carousel_active');
        }
    }



    /**
     * Set class for active slide
     *
     * @public
     */
    function setActiveSlide(current) {
        let activeSlide = document.getElementsByClassName('js-Carousel_slide-items')[current];
        if (activeSlide){
            activeSlide.classList.add('js-Carousel_active');
        }
    }


    /**
     * Set class animation for all slide after first charge
     *
     * @public
     */
    function setAnimation() {
        //console.log("entro a setAnimation");
        let animationClass = document.getElementsByClassName('js-Carousel-animation');
        let activeSlide = document.getElementsByClassName('js-Carousel_slide-items');

        if (!animationClass[0]){
            for (var i = 0; i < activeSlide.length; i++) {
                activeSlide[i].classList.add('js-Carousel-animation');
            }
        }else{
            return;
        }
    }


    /**
     * Move the carousel back.
     *
     * @public
     */
    function showPrev(ev) {
        clearActiveSlide();
        setAnimation();
        // console.log("valor current");
        // console.log(current);
        if (options.infinite) {
            showPrevInfinite();
        } else {
            showPrevLinear();
        }
        setActiveSlide(current);
    }

    /**
     * Helper function to show the previous slide for INFINITE carousel.
     * Do the sliding, move the last item to the very beginning.
     */
    function showPrevInfinite() {

        var marginLeft = element.offsetWidth;

        marginLeft = setResponsiveSlides(slidesPerCarousel);

        animatePrev(document.querySelectorAll('#' + crslId + ' > ul > li')[0]);
        moveItem(count - 1, -(marginLeft) + 'px', 'afterBegin');

        adjustCurrent(-1);
    }

    /**
     * Helper function to show the previous slide for LINEAR carousel.
     * Stop the autoplay if user goes back. If on the first slide - do nothing.
     */
    function showPrevLinear() {
        stop();
        if (current === 0) {
            return;
        }
        animatePrev(document.querySelectorAll('#' + crslId + ' > ul > li')[current - 1]);

        adjustCurrent(-1);
    }

    /**
     * Move the carousel forward.
     *
     * @public
     */
    function showNext() {
        clearActiveSlide();
        setAnimation();
        // console.log("valor current");
        // console.log(current);
        if (options.infinite) {
            showNextInfinite();
        } else {
            showNextLinear();
        }
        setActiveSlide(current);
    }

    /**
     * Helper function to show the next slide for INFINITE carousel.
     * Do the sliding, move the second item to the very end.
     */
    function showNextInfinite() {
        animateNext(document.querySelectorAll('#' + crslId + ' > ul > li')[1]);
        moveItem(0, '', 'beforeEnd');

        adjustCurrent(1);
    }

    /**
     * Helper function to show the next slide for LINEAR carousel.
     * If on the last slide - stop the play and do nothing else.
     */
    function showNextLinear() {
        if (current === count - 1) {
            stop();
            return;
        }
        animateNext(document.querySelectorAll('#' + crslId + ' > ul > li')[current]);

        adjustCurrent(1);
    }

    /**
     * Adjust _current_ and highlight the respective dot.
     *
     * @param {number} val - defines which way current should be corrected.
     */
    function adjustCurrent(val) {
        current += val;

        if (options.dots) {
            currentDot();
        }
    }

    /**
     * Start the auto play.
     * If already playing do nothing.
     *
     * @public
     */
    function play() {
        if (cycle) {
            return;
        }
        cycle = setInterval(showNext.bind(this), interval);
    }

    /**
     * Stop the auto play.
     *
     * @public
     */
    function stop() {
        clearInterval(cycle);
        cycle = null;
    }

    /**
     * Returns the current slide index.
     *
     * @public
     */
    function live() {
        return current;
    }

    return {
        'init': init,
        'live': live,
        'show': show,
        'prev': showPrev,
        'next': showNext,
        'play': play,
        'stop': stop
    };
}

