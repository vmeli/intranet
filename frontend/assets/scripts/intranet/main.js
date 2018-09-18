vanillaCalendar.init({
    disablePastDays: true
});

let tagBody = document.body,
	modalContainer = document.getElementById("modal-container"),
	modalBackground = document.getElementById("modal-background");
    	
    console.log(tagBody);

function addingClass() {
	modalContainer.classList.add("one");
	tagBody.classList.add("modal-active");
}
function closeModal(e) {
	if ((e.type === 'click' && e.target === modalBackground) || 
		(e.type === 'keyup' && (e.keycode === 27 || e.which ===27))){
			modalContainer.classList.add("out");
			tagBody.classList.remove("modal-active");
			setTimeout(endAnimation, 3000);
	}
}
function endAnimation() {
	modalContainer.remove();
}
window.addEventListener('load',addingClass);
modalContainer.addEventListener	('click', closeModal);
window.addEventListener('keyup', closeModal);