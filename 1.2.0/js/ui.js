var btnOpen = document.getElementById("btn-open");
var btnClose = document.getElementById("btn-close");

btnOpen.addEventListener('click', () => {
	btnClose.style.display = "block";
	btnOpen.style.display = "none";
	window.location.reload();
});

btnClose.addEventListener('click', () => {
	btnClose.style.display = "none";
	btnOpen.style.display = "block";
	// open('about:blank').close(); 
	open('about:blank', '_self').close(); 
});

window.onload = function() {
	btnClose.style.display = "block";
	btnOpen.style.display = "block";
};