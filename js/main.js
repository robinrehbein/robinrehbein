/* --------------------------------------------------------- */
/* ############### - Global used Variables - ############### */
/* --------------------------------------------------------- */
var isClicked = false;
var isScrolled = false;

/* ------------------------------------------------------------- */
/* ####### - Functions onload, fire when DOM is loaded - ####### */
/* ------------------------------------------------------------- */
window.onload = function() {

    /* --------------------------------------------------------- */
    /* ##### - Function add current year to rr_copyright - ##### */
    /* --------------------------------------------------------- */
    var year = new Date();
    document.getElementById("rr_copyright").innerHTML = "Copyright &copy; <em>" + year.getFullYear() + " Robin Rehbein</em> - All rights reserved.";
    
    /* --------------------------------------------------------- */
    /* # - Function EventListener add class .onscroll to nav - # */
    /* --------------------------------------------------------- */
    window.addEventListener('scroll', function() {
        let onscroll = window.scrollY;
        if (!isClicked) {
            if (onscroll > 75) {
                isScrolled = true;
                addClass("query", "nav", "onscroll");
                // document.querySelector("nav").classList.add("onscroll");
                if (getWidth() < 550) {
                    addClass("id", "rr_nav_logo_text", "onscroll");
                    // document.getElementById("rr_nav_logo_text").classList.add("onscroll");
                }
            }
            else {
                isScrolled = false;
                removeClass("query", "nav", "onscroll");
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
            if (!isScrolled){
                removeClass("query", "nav", "onscroll");
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
    // if(getWidth() > 1300){
    //     addParticles();
    // }
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
/* ------------------------------------------------------------- */
/* ################# - Function addParticles - ################# */
/* ------------------------------------------------------------- */
function addParticles() {
    var MAX_PARTICLES = 1000,
	RADIUS = 100,
	MAX_LINES = 5,
	MAX_LIFE_SPAN = 600,
	MIN_DENSITY = 15,
	OFFSET_DENSITY = 15,
	_context,
	_mouseX,
	_mouseY,
	_particles,
	_canvasWidth,
	_canvasHalfWidth,
	_canvasHeight,
	_canvasHalfHeight;

    init();

    function init() {

        _particles = [];
        _context = c.getContext('2d');

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);

        onResize();

        createInitialParticles();

        redraw();
    }

    function createInitialParticles() {

        var x;

        for (x = 0; x < _canvasWidth; x += 5) {

            _particles.push(new Particle(x - _canvasHalfWidth,  -(_canvasHalfHeight / 2) + (Math.random() * _canvasHalfHeight)));
        }
    }

    function onMouseMove(e) {

        _mouseX = e.pageX;
        _mouseY = e.pageY;
    }

    function onResize() {

        _canvasWidth = c.offsetWidth;
        _canvasHalfWidth = Math.round(_canvasWidth / 2);
        _canvasHeight = c.offsetHeight,
        _canvasHalfHeight = Math.round(_canvasHeight / 2);

        c.width = _canvasWidth;
        c.height = _canvasHeight;
    }

    function redraw() {

        var copyParticles = _particles.slice(),
            particle,
            i;

        if (_particles.length < MAX_PARTICLES && _mouseX && _mouseY) {

            particle = new Particle(_mouseX - _canvasHalfWidth, _mouseY - _canvasHalfHeight);
            
            _particles.push(particle);
            _mouseX = false;
            _mouseY = false;
        }

        _context.clearRect(0, 0, _canvasWidth, _canvasHeight);

        for (i = 0; i < copyParticles.length; i++) {

            particle = copyParticles[i];
            particle.update();
        }

        drawLines();

        requestAnimationFrame(redraw);
    }

    function drawLines() {
        var particleA,
            particleB,
            distance,
            opacity,
            lines,
            i,
            j;

        _context.beginPath();

        for (i = 0; i < _particles.length; i++) {

            lines = 0;
            particleA = _particles[i];

            for (j = i + 1; j < _particles.length; j++) {

                particleB = _particles[j];
                distance = getDistance(particleA, particleB);

                if (distance < RADIUS) {
                    
                    lines++;
                    
                    if (lines <= MAX_LINES) {

                        opacity = 0.5 * Math.min((1 - distance / RADIUS), particleA.getOpacity(), particleB.getOpacity());
                        _context.beginPath();
                        _context.moveTo(particleA.getX() + _canvasHalfWidth, particleA.getY() + _canvasHalfHeight);
                        _context.lineTo(particleB.getX() + _canvasHalfWidth, particleB.getY() + _canvasHalfHeight);
                        _context.strokeStyle = 'rgba(51,51,51,' + opacity + ')';
                        _context.stroke();
                    }
                }
            }
        }
    }

    function Particle(originX, originY) {

        var _this = this,
            _direction = -1 + Math.round(Math.random()) * 2,
            _angle = Math.random() * 10,
            _posX = originX,
            _posY = originY,
            _density = MIN_DENSITY + Math.random() * OFFSET_DENSITY,
            _lifeSpan = 0,
            _opacity = 1;

        function update() {

            _lifeSpan++;

            if (_lifeSpan % 3 === 0) {

                _opacity = 1 - _lifeSpan / MAX_LIFE_SPAN;

                _angle += 0.001 * _direction;
                // _posY += (Math.cos(_angle + _density) + 1) * 0.75;
                _posX += Math.sin(_angle) * 0.75;

                if (_lifeSpan >= MAX_LIFE_SPAN) {

                    destroy();
                }
            }
        }

        function destroy() {

            var particle,
                    i;

            for (i = 0; i < _particles.length; i++) {

                particle = _particles[i];

                if (particle === _this) {

                    _particles.splice(i, 1);
                }
            }
        }

        this.getOpacity = function() { return _opacity; };
        this.getX = function() { return _posX; };
        this.getY = function() { return _posY; };
        
        this.update = update;
    }

    function getDistance(particle1, particle2) {

        var deltaX = particle1.getX() - particle2.getX(),
            deltaY = particle1.getY() - particle2.getY();

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
};

