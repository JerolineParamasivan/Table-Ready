// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Flatpickr Date Picker
    initDatePicker();

    // Initialize Event Listeners
    initEventListeners();

    // Initialize Tooltips (Bootstrap)
    initTooltips();
});

/**
 * Initialize Flatpickr Date Picker
 */
function initDatePicker() {
    const dateInput = document.getElementById('dateSelector');
    if (dateInput) {
        flatpickr(dateInput, {
            mode: 'single',
            dateFormat: 'M d, Y',
            minDate: 'today',
            theme: 'dark',
            onChange: function(selectedDates, dateStr, instance) {
                console.log('Date selected:', dateStr);
                // You can add logic here to filter bookings by date
                filterBookings();
            }
        });
    }
}

/**
 * Initialize Event Listeners
 */
function initEventListeners() {
    // Search Input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterBookings);
    }

    // Status Filter
    const statusDropdown = document.querySelector('.status-dropdown');
    if (statusDropdown) {
        statusDropdown.addEventListener('change', filterBookings);
    }

    // Date Input
    const dateInput = document.getElementById('dateSelector');
    if (dateInput) {
        dateInput.addEventListener('change', filterBookings);
    }

    // Export Button
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportBookings);
    }

    // Add Booking Button
    const addBookingBtn = document.querySelector('.btn-add-booking');
    if (addBookingBtn) {
        addBookingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAddBookingModal();
        });
    }

    // Action Buttons
    initActionButtons();

    // Pagination Links
    initPagination();

    // Sidebar Toggle for Mobile
    initSidebarToggle();
}

/**
 * Initialize Action Buttons (View, Edit, Delete)
 */
function initActionButtons() {
    // View Button
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const name = row.querySelector('td:nth-child(2)').textContent;
            showNotification(`View details for ${name}`, 'info');
        });
    });

    // Edit Button
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const name = row.querySelector('td:nth-child(2)').textContent;
            showNotification(`Edit booking for ${name}`, 'warning');
        });
    });

    // Delete Button
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const name = row.querySelector('td:nth-child(2)').textContent;
            if (confirm(`Are you sure you want to delete the booking for ${name}?`)) {
                row.style.opacity = '0.5';
                showNotification(`Booking for ${name} deleted successfully`, 'success');
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
    });
}

/**
 * Filter Bookings based on search, status, and date
 */
function filterBookings() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const statusFilter = document.querySelector('.status-dropdown').value.toLowerCase();
    const dateFilter = document.getElementById('dateSelector').value;

    const rows = document.querySelectorAll('.bookings-table tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        let show = true;

        // Search filter (name or phone)
        if (searchTerm) {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const phone = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            show = show && (name.includes(searchTerm) || phone.includes(searchTerm));
        }

        // Status filter
        if (statusFilter) {
            const status = row.querySelector('.badge').textContent.toLowerCase().trim();
            show = show && status.includes(statusFilter);
        }

        // Date filter
        if (dateFilter) {
            const rowDate = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            show = show && rowDate.toLowerCase().includes(dateFilter.toLowerCase());
        }

        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    // Update showing text
    updateShowingText(visibleCount);

    // Show empty message if no results
    if (visibleCount === 0) {
        showEmptyMessage();
    }
}

/**
 * Update the "Showing X of Y" text
 */
function updateShowingText(visibleCount) {
    const infoText = document.querySelector('.info-text');
    const totalCount = document.querySelectorAll('.bookings-table tbody tr').length;
    if (infoText) {
        infoText.textContent = `Showing ${visibleCount} of ${totalCount} bookings`;
    }
}

/**
 * Show Empty Message
 */
function showEmptyMessage() {
    const tableWrapper = document.querySelector('.table-wrapper');
    if (!document.querySelector('.empty-message')) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.style.cssText = `
            text-align: center;
            padding: 40px;
            color: #808080;
        `;
        emptyMsg.innerHTML = `
            <i class="fas fa-search" style="font-size: 40px; margin-bottom: 16px; opacity: 0.5;"></i>
            <p style="margin: 10px 0;">No bookings found matching your criteria</p>
        `;
        tableWrapper.parentElement.insertBefore(emptyMsg, tableWrapper.nextSibling);
    }
}

/**
 * Initialize Pagination
 */
function initPagination() {
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNum = this.textContent.trim();
            
            if (pageNum !== '›' && pageNum !== '‹') {
                // Remove active class from all
                document.querySelectorAll('.page-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                // Add active to clicked
                this.parentElement.classList.add('active');
                showNotification(`Navigated to page ${pageNum}`, 'info');
            }
        });
    });
}

/**
 * Export Bookings
 */
function exportBookings() {
    const rows = document.querySelectorAll('.bookings-table tbody tr:not([style*="display: none"])');
    
    if (rows.length === 0) {
        showNotification('No bookings to export', 'warning');
        return;
    }

    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Sr,Customer Name,Phone,Date,Time,Guests,Status\n';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).slice(0, 7).map(cell => {
            return '"' + cell.textContent.trim() + '"';
        }).join(',');
        csvContent += rowData + '\n';
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tableready_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);

    showNotification(`Exported ${rows.length} booking(s) successfully`, 'success');
}

/**
 * Show Add Booking Modal (Placeholder)
 */
function showAddBookingModal() {
    showNotification('Add Booking modal would open here', 'info');
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification
    const notif = document.createElement('div');
    notif.className = 'notification';
    
    const typeColors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };

    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${typeColors[type] || typeColors['info']}1f;
        border: 1px solid ${typeColors[type] || typeColors['info']}50;
        color: ${typeColors[type] || typeColors['info']};
        padding: 14px 20px;
        border-radius: 8px;
        z-index: 3000;
        font-size: 14px;
        animation: slideInUp 0.3s ease;
        max-width: 300px;
    `;
    notif.textContent = message;

    document.body.appendChild(notif);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notif.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

/**
 * Initialize Bootstrap Tooltips
 */
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize Sidebar Toggle for Mobile
 */
function initSidebarToggle() {
    // You can add sidebar toggle functionality for mobile devices
    // This would typically involve a hamburger menu button
}

/**
 * Add Animation Styles
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    .notification {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .empty-message {
        animation: slideInUp 0.3s ease;
    }
`;
document.head.appendChild(style);

// Export functions for external use
window.tableReadyAdmin = {
    filterBookings,
    exportBookings,
    showNotification
};
