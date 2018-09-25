vanillaCalendar.init({
    disablePastDays: true
});

let tagBody = document.body,
	modalContainer = document.getElementById("modal-container"),
	modalBackground = document.getElementById("modal-background");
    	
    console.log(tagBody);

function addingClass() {
	tagBody.classList.add("modal-active");
	modalContainer.classList.add("one");
}
function closeModal(e) {
	if ((e.type === 'click' && e.target === modalBackground) || 
		(e.type === 'keyup' && (e.keycode === 27 || e.which ===27))){
			tagBody.classList.remove("modal-active");
			modalContainer.classList.add("out");
			setTimeout(endAnimation, 3000);
	}
}
function endAnimation() {
	modalContainer.remove();
}
if(modalBackground) {
	window.addEventListener('load',addingClass);
	modalContainer.addEventListener	('click', closeModal);
	window.addEventListener('keyup', closeModal);
}

let allRadioBtns = document.getElementsByClassName("input__radio"),
	radioBtnSelectedValue



for (let index = 0; index < allRadioBtns.length; index++) {
        allRadioBtns[index].onclick = setCheck;
}
function setCheck(){
	console.log("input radio");
}

/**** PINTAR FECHAS CALENDARIO ****/
	let btnNext = document.querySelector("[data-calendar-toggle='next']");
	let btnPrevious = document.querySelector("[data-calendar-toggle='previous']");
	let url = "https://api.myjson.com/bins/f2u2s";
	//let url = "http://qaintranet.glr.pe/api/node-list?_format=json&calendar=1&type=event";
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
	// Success!
		window.data = JSON.parse(request.responseText)['data'];
		pintarFechas();
		btnNext.onclick = () => pintarFechas();
		btnPrevious.onclick = () => pintarFechas();

	} else {
	// We reached our target server, but it returned an error

	}
	};

	request.onerror = function() {
	// There was a connection error of some sort
	};

	request.send();

	// PINTADO DE FECHAS A LA PRIMERA CARGA
	function pintarFechas() {
		let dataCurrent = document.getElementsByClassName("vcal-header__label")[0].innerText;
		let yearCurrent =  parseInt(dataCurrent.split(" ")[1]);
		let monthCurrent = document.getElementsByClassName("vcal-header__label")[0].getAttribute('data-number-month');
		let DaysCalendar = document.getElementsByClassName("vcal-date");

		if (DaysCalendar) {
			var r = data[yearCurrent];
			for (let i = 0; i < DaysCalendar.length; i++) {
				if (data[yearCurrent][monthCurrent]) {
					if(data[yearCurrent][monthCurrent]['days'][DaysCalendar[i].innerText.trim().padStart(2,"0")]) {
						if(data[yearCurrent][monthCurrent]['days'][DaysCalendar[i].innerText.trim().padStart(2,"0")]) {
							DaysCalendar[i].classList.add("dia-programada");
							DaysCalendar[i].onclick = getPathDays;
						}
					}
				}
			}
		}
	}

	// OBTENER LAS RUTAS DE LOS DÍAS
	function getPathDays(e) {
		let dataCurrent = document.getElementsByClassName("vcal-header__label")[0].innerText;
		let yearCurrent = parseInt(dataCurrent.split(" ")[1]);
		let monthCurrent = document.getElementsByClassName("vcal-header__label")[0].getAttribute('data-number-month'); 
		let element = e.target;
		let indice = element.innerText.trim().padStart(2,"0");
		//console.log(element.nodeName,"click");
		if(element.nodeName === 'SPAN') {
			element = e.target.parentElement;
		}
		if(data[yearCurrent][monthCurrent]['days'][indice]['type']) {
			if(data[yearCurrent][monthCurrent]['days'][indice]['type'].toLowerCase() === 'detail') {
				//window.location.href = 'dominio' + data[yearCurrent][monthCurrent]['days'][indice]['url']; 
				console.log(data[yearCurrent][monthCurrent]['days'][indice]['url']);
			}else if(data[yearCurrent][monthCurrent]['days'][indice]['type'].toLowerCase() === 'list') {
				console.log(data[yearCurrent][monthCurrent]['days'][indice]['url']);			} 
		}
	}
if(document.getElementById('sliderHeader')) {
	var swiper = new Swiper('#sliderHeader', {
	      slidesPerView: 1,
	      effect: 'fade',
	      loop: true,
	      pagination: {
	        el: '.swiper-pagination',
	        clickable: true,
	      },
	      autoplay: {
	        delay: 2500,
	        disableOnInteraction: false,
	      },
	      navigation: {
	        nextEl: '.swiper-button-next',
	        prevEl: '.swiper-button-prev',
	      },
	});
}
if(document.getElementById('sliderInterna')) {
	var swiper = new Swiper('#sliderInterna', {
	      slidesPerView: 1,
	      loop: true,
	      pagination: {
	        el: '.swiper-pagination',
	        clickable: true,
	      },
	      navigation: {
	        nextEl: '.swiper-button-next',
	        prevEl: '.swiper-button-prev',
	      },
	});
}

var allQuestions = document.getElementsByClassName('form-item');
var allRadioInput = Array.from(document.getElementsByClassName('input__radio'));
var radioInputSelectedValue = '';
var btnSubmint = document.getElementById("btnSubmit");

var demo = (e) => {
	var elementTargetClick = e.target;
	let getClosest = function ( elem, selector ) {

            // Element.matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.matchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.oMatchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    function(s) {
                        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                            i = matches.length;
                        while (--i >= 0 && matches.item(i) !== this) {}
                        return i > -1;
                    };
            }

            // Get closest match
            for ( ; elem && elem !== document; elem = elem.parentNode ) {
                if ( elem.matches( selector ) ) return elem;
            }

            return null;

        };
        //var parentBlockClick = getClosest(elementTargetClick, '.form-item');
        //parentBlockClick.classList.add('active');
        radioInputSelectedValue = elementTargetClick.value;
};

var validationInput = (e) => {
	e.preventDefault();
	var t = true;
	var f = ''
	Array.from(allQuestions).map(function(element) {
		t = t && d(element);
		//d(element);
	});
	function d(element) {
		var r = false;
		var w = '';
		Array.from(element.querySelectorAll('.input__radio')).map(function(elementInput) {
			r = r || elementInput.checked;	
			//console.log(elementInput.checked);
			//if (elementInput.checked) {
			// 	return elementInput.value	
			//} 
		});
		//console.log(r, 'w');
		return r;	
	}
	t ? console.log('enviando') : console.log('falta llenar');
}

allRadioInput.map(function(x){
	x.onclick = demo;
})

btnSubmit.onclick = validationInput;

