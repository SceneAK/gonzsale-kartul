import { hookSignIn } from "./user.js";

// Function to load external HTML into a div
function loadHTML(file, elementId, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback(); // Ensure callback runs after loading
        })
        .catch(err => console.error(`Error loading ${file}:`, err));
}

// Function to toggle dropdown states dynamically
function toggleDropdownState(isLoggedIn) {
    const loginForm = document.getElementById('loginForm');
    const editForm = document.getElementById('editForm');
    const dropdownLink = document.querySelector('.dropdown a');

    if (!loginForm || !editForm || !dropdownLink) return; // Graceful exit if elements are missing

    if (isLoggedIn) {
        loginForm.style.display = 'none'; // Hide login form
        editForm.style.display = 'block'; // Show logged-in options
        const user = JSON.parse(localStorage.getItem('loginDetail')); // Parse user info
        dropdownLink.textContent = `Welcome, ${user.user_name || 'User'}`;
    } else {
        loginForm.style.display = 'block'; // Show login form
        editForm.style.display = 'none'; // Hide logged-in options
        dropdownLink.textContent = "Sign In";
    }
}

// Update UI based on login state
function updateUI() {
    const loginDetail = JSON.parse(localStorage.getItem('loginDetail')); // Parse login detail
    const isLoggedIn = !!loginDetail; // Determine login state
    toggleDropdownState(isLoggedIn);
}

// Initialize Dropdown Functionality
function initializeDropdown() {
    const dropdownLink = document.querySelector('.dropdown a');
    const dropdownContent = document.getElementById("dropdown-content");

    if (!dropdownLink || !dropdownContent) return; // Exit if elements are not found

    // Toggle dropdown visibility
    dropdownLink.addEventListener('click', (event) => {
        event.preventDefault();
        dropdownContent.classList.toggle("dropdown-show");
    });

    // Close dropdown if clicked outside
    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            dropdownContent.classList.remove("dropdown-show");
        }
    });

    hookSignInWithElementIds('email', 'password', 'signIn'); // Initialize Sign-In
}

// Attach dynamic listeners
function attachEventListeners() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loginDetail'); // Clear login data
            updateUI(); // Reset UI
            alert('You have logged out successfully.');
        });
    }
}

// Initialize Modals
function initializeModals() {
    // Close modal on outside click
    window.addEventListener("click", (event) => {
        const modal = document.querySelector(".modal-overlay.show");
        if (modal && event.target === modal) {
            modal.classList.remove("show");
        }
    });

    hookSignInWithElementIds('email_mobile', 'password_mobile', 'signIn_mobile'); // Mobile Sign-In
}

// Load header and footer
function initializePage() {
    loadHTML('header.html', 'header', () => {
        initializeDropdown(); // Initialize dropdown after header loads
        updateUI(); // Update UI state
        attachEventListeners(); // Attach event listeners after header loads
    });

    loadHTML('footer.html', 'footer'); // Load footer
}

// Trigger initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializePage);

// Additional functionality for page-specific customizations
document.addEventListener("DOMContentLoaded", () => {
    const searchBars = document.querySelectorAll(".search-bar");
    const currentPath = window.location.pathname;

    if (currentPath.includes("create-store.html")) {
        searchBars.forEach((searchBar) => {
            searchBar.style.display = "none";
        });
    }
});
