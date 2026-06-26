document.addEventListener('DOMContentLoaded', function () {
    // Fade in animation on page load
    const confirmationHero = document.querySelector('.confirmation-hero');
    if (confirmationHero) {
        confirmationHero.style.opacity = '0';
        confirmationHero.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
});

// Copy Booking ID to Clipboard
function copyBookingId() {
    const bookingIdElement = document.getElementById('bookingId');
    const bookingId = bookingIdElement.textContent;
    const copyBtn = document.querySelector('.copy-btn');

    // Use the Clipboard API
    navigator.clipboard.writeText(bookingId).then(function () {
        // Show feedback
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(function () {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(function (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = bookingId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        // Show feedback
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');

        setTimeout(function () {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
    });
}

// View Booking Button
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-view-booking')) {
        // Navigate to bookings page or show booking details
        window.location.href = '/bookings';
    }
});

// Book Another Table Button
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-book-another')) {
        // Navigate to home with booking section
        window.location.href = '/#book';
    }
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;
document.head.appendChild(style);
