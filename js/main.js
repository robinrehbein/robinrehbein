/* --------------------------------------------------------- */
/* ############### - Global used Variables - ############### */
/* --------------------------------------------------------- */
var isClicked = false;
var isScrolled = false;

/* ------------------------------------------------------------- */
/* ####### - Functions onload, fire when DOM is loaded - ####### */
/* ------------------------------------------------------------- */
window.onload = function () {
    /* --------------------------------------------------------- */
    /* ### - Function add current dateTime to rr_copyright - ### */
    /* --------------------------------------------------------- */
    var dateTime = new Date();
    document.getElementById("rr_copyright").innerHTML = "Copyright &copy; <em>" + dateTime.getFullYear() + " Robin Rehbein</em> - All rights reserved.";

    /* --------------------------------------------------------- */
    /* ############ - Function dynamic Background - ############ */
    /* --------------------------------------------------------- */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ||
        dateTime.getHours() <= 7 ||
        dateTime.getHours() >= 19) {
        document.documentElement.style.setProperty('--svg-color', 'invert(100%)');
        document.documentElement.style.setProperty('--bg-color', 'rgba(15, 15, 15, 1)'); /* #111111 */
        document.documentElement.style.setProperty('--bg-color-nav', 'rgba(10, 10, 10, .7)'); /* #111111 */
        document.documentElement.style.setProperty('--tile-bg-color', 'rgba(10, 10, 10, 1)');
        document.documentElement.style.setProperty('--border-color', 'rgba(250, 250, 250, .1)');
        document.documentElement.style.setProperty('--mouse-move-color', 'rgba(250, 250, 250, .1)');
        document.documentElement.style.setProperty('--text-color', 'rgba(238, 238, 238, 1)');
        document.documentElement.style.setProperty('--skills-color', 'rgba(10, 37, 60, 1)');
        document.documentElement.style.setProperty('--theme-color', ' rgb(165, 135, 145, 1)');
        // document.documentElement.style.setProperty('--nav-shadow', '0px 0px 8px rgba(180, 180, 180, 0.2)');
        // document.documentElement.style.setProperty('--box-shadow', 'inset 0 -1px 0 0 rgba(255, 255, 255, 0.1), 0 8px 16px 0 rgba(204, 204 ,204, 0.2)');
    } else {
        document.documentElement.style.setProperty('--svg-color', 'invert(0)');
        document.documentElement.style.setProperty('--bg-color', 'rgba(250, 250, 250, 1)');
        document.documentElement.style.setProperty('--bg-color-nav', 'rgba(255, 255, 255, .7)');
        document.documentElement.style.setProperty('--tile-bg-color', 'rgba(255, 255, 255, 1)');
        document.documentElement.style.setProperty('--border-color', 'rgba(15, 15, 15, .1)');
        document.documentElement.style.setProperty('--mouse-move-color', 'rgba(15, 15, 15, .1)');
        document.documentElement.style.setProperty('--text-color', 'rgba(15, 15, 15, 1)'); /* eventuell ändern auf rgba(15, 15, 15, 1), alt/original rgba(51, 51, 51, 1) */
        document.documentElement.style.setProperty('--skills-color', 'rgba(245, 218, 195, 1)');
        document.documentElement.style.setProperty('--theme-color', 'rgba(90, 120, 110, 1)');
        // document.documentElement.style.setProperty('--nav-shadow', '0px 0px 8px rgba(75, 75, 75, 0.2)');
        // document.documentElement.style.setProperty('--box-shadow', 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 8px 16px 0 rgba(51, 51, 51, 0.2)');
    }

    /* --------------------------------------------------------- */
    /* # - Function EventListener add class .onscroll to nav - # */
    /* --------------------------------------------------------- */
    window.addEventListener('scroll', function () {
        let onscroll = window.scrollY;
        if (!isClicked) {
            if (onscroll > 75) {
                isScrolled = true;
                addClass("query", "nav", "onscroll");
                addClass("query", "nav", "rr_container");
                // document.querySelector("nav").classList.add("onscroll");
                if (getWidth() < 550) {
                    addClass("id", "rr_nav_logo_text", "onscroll");
                    // document.getElementById("rr_nav_logo_text").classList.add("onscroll");
                }
            }
            else {
                isScrolled = false;
                removeClass("query", "nav", "onscroll");
                removeClass("query", "nav", "rr_container");
                // document.querySelector("nav").classList.remove("onscroll");
                if (getWidth() < 550) {
                    removeClass("id", "rr_nav_logo_text", "onscroll");
                    // document.getElementById("rr_nav_logo_text").classList.remove("onscroll");
                }
            }
        }
    });

    /* --------------------------------------------------------- */
    /* # - Function EventListener add class .onscroll to nav - # */
    /* ## - Responsive Menu add .active to .rr_nav_plus_svg - ## */
    /* --------------------------------------------------------- */
    document.getElementById("rr_nav_plus_svg").addEventListener('click', function () {
        isClicked = !isClicked;
        if (isClicked) {
            addClass("query", "nav", "onscroll");
            addClass("query", "nav", "rr_container");
            addClass("id", "rr_nav_plus_svg", "active");
            addClass("id", "rr_nav_right", "active");
            // document.querySelector("nav").classList.add("onscroll");
            // document.getElementById("rr_nav_plus_svg").classList.add("active");
            // document.getElementById("rr_nav_right").classList.add("active");
            if (getWidth() < 550) {
                addClass("id", "rr_nav_logo_text", "onscroll");
                // document.getElementById("rr_nav_logo_text").classList.add("onscroll");
            }
        }
        else {
            if (!isScrolled) {
                removeClass("query", "nav", "onscroll");
                removeClass("query", "nav", "rr_container");
                // document.querySelector("nav").classList.remove("onscroll");                
            }
            removeClass("id", "rr_nav_plus_svg", "active");
            removeClass("id", "rr_nav_right", "active");
            // document.getElementById("rr_nav_plus_svg").classList.remove("active");
            // document.getElementById("rr_nav_right").classList.remove("active");
            if ((getWidth() < 550) && (!isScrolled)) {
                removeClass("id", "rr_nav_logo_text", "onscroll");
                // document.getElementById("rr_nav_logo_text").classList.remove("onscroll");
            }
        }
    });

    document.addEventListener('mousemove', function ($event) {
        Array.from(document
            .getElementsByClassName('rr_container'))
            .forEach(element => {
                const rect = element.getBoundingClientRect();
                const x = $event.clientX - rect.left;
                const y = $event.clientY - rect.top;
                element.style.setProperty('--posX', `${x}px`)
                element.style.setProperty('--posY', `${y}px`)
            });
    })

};

/* ------------------------------------------------------------- */
/* ################### - Function getWidth - ################### */
/* ------------------------------------------------------------- */
function getWidth() {
    return Math.max(document.documentElement.clientWidth);
};
/* ------------------------------------------------------------- */
/* ################### - Function addClass - ################### */
/* ------------------------------------------------------------- */
function addClass(selector, identifier, classname) {
    if (selector == "query") {
        document.querySelector(identifier).classList.add(classname);
    }
    else if (selector == "id") {
        document.getElementById(identifier).classList.add(classname);
    }
    else {
    }
};
/* ------------------------------------------------------------- */
/* ################# - Function removeClass - ################## */
/* ------------------------------------------------------------- */
function removeClass(selector, identifier, classname) {
    if (selector == "query") {
        document.querySelector(identifier).classList.remove(classname);
    }
    else if (selector == "id") {
        document.getElementById(identifier).classList.remove(classname);
    }
    else {
    }
};