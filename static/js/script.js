document.addEventListener('DOMContentLoaded', function () {
	if (window.flatpickr) {
		flatpickr('#date', {minDate: 'today', dateFormat: 'd M, Y'});
	}
});

// Category filtering for menu
document.addEventListener('click', function(e){
	const link = e.target.closest('.category-nav .nav-link');
	if(!link) return;
	e.preventDefault();
	const filter = link.dataset.filter;
	document.querySelectorAll('.category-nav .nav-link').forEach(n=>n.classList.remove('active'));
	link.classList.add('active');

	// show/hide sections by data-cat on section elements
	if(filter === 'all'){
		document.querySelectorAll('[data-cat]').forEach(s=>s.style.display='block');
	} else {
		document.querySelectorAll('[data-cat]').forEach(s=>{
			s.style.display = (s.dataset.cat === filter) ? 'block' : 'none';
		});
	}
});

// Scroll to top button
const stBtn = document.createElement('a');
stBtn.href = '#';
stBtn.className = 'scroll-top';
stBtn.innerHTML = '⬆';
document.body.appendChild(stBtn);
stBtn.addEventListener('click', function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});

// show button after scroll
window.addEventListener('scroll', function(){
	if(window.scrollY > 300) stBtn.style.display = 'flex'; else stBtn.style.display = 'none';
});

// initialize display state
document.querySelectorAll('[data-cat]').forEach(s=>s.style.display='block');
