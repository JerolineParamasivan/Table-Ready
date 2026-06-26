document.addEventListener('DOMContentLoaded', function () {
	if (window.flatpickr) {
		flatpickr('#date', {minDate: 'today', dateFormat: 'd M, Y'});
	}
});
