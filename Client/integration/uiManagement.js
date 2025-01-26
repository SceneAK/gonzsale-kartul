import { hookSignIn } from "./user.js";

// 1) Load external HTML file into a div
function loadHTML(file, elementId, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback(); // Ensure callback runs after loading
        })
        .catch(err => console.error(`Error loading ${file}:`, err));
}

/***************************************************
 * Dropdown Toggle Logic
 ***************************************************/
function toggleDropdownState(isLoggedIn) {
    const loginForm = document.getElementById('loginForm');
    const editForm = document.getElementById('editForm');
    const dropdownLink = document.querySelector('.dropdown a');

    if (!loginForm || !editForm || !dropdownLink) return; // Graceful exit

    if (isLoggedIn) {
        loginForm.style.display = 'none';
        editForm.style.display = 'block';
        const user = JSON.parse(localStorage.getItem('loginDetail')) || {};
        dropdownLink.textContent = `Welcome, ${user.name || 'User'}`;
    } else {
        loginForm.style.display = 'block';
        editForm.style.display = 'none';
        dropdownLink.textContent = "Sign In";
    }
}

// Update UI based on login state
function updateUI() {
    const loginDetail = JSON.parse(localStorage.getItem('loginDetail'));
    console.log("TEST " + loginDetail);
    const isLoggedIn = !!loginDetail;
    toggleDropdownState(isLoggedIn);
}

/***************************************************
 * Initialize Dropdown (loginForm/editForm)
 ***************************************************/
function initializeDropdown() {
    const dropdownLink = document.querySelector('.dropdown a');
    const dropdownContent = document.getElementById("dropdown-content");
    if (!dropdownLink || !dropdownContent) return;

    // Toggle dropdown visibility on click
    dropdownLink.addEventListener('click', (event) => {
        event.preventDefault();
        dropdownContent.classList.toggle("dropdown-show");
    });

    // Close dropdown if clicked outside
    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            dropdownContent.classList.remove('dropdown-show');
        }
    });

    // Hook desktop login
    hookSignInWithElementIds('email', 'password', 'signIn');
}

/***************************************************
 * Attach Listeners (Logout, etc.)
 ***************************************************/
function attachEventListeners() {
    // Logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loginDetail');
            updateUI();
        });
    }
}

/***************************************************
 * Modal Logic (Approach A: local overlay-based)
 ***************************************************/
window.toggleModal = function (modalId) {
    console.log(`Toggling modal with ID: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found!`);
        return;
    }
    modal.classList.toggle("show");
};

function initializeModals() {
    // Local approach: Each modal overlay closes itself if user clicks outside its .modal-content
    const modals = document.querySelectorAll(".modal-overlay");
    modals.forEach((modal) => {
        modal.addEventListener("click", (event) => {
            // If user clicked the overlay, or anything not in .modal-content, close it
            if (!event.target.closest(".modal-content")) {
                modal.classList.remove("show");
            }
        });
    });

    // Hook mobile login
    hookSignInWithElementIds('email_mobile', 'password_mobile', 'signIn_mobile');
}

/***************************************************
 * Side Menu Toggle
 ***************************************************/
window.toggleMenu = function () {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
        console.log("Found sideMenu:", sideMenu);
        console.log("Before toggle:", sideMenu.classList.value);
        
        sideMenu.classList.remove('open');
        sideMenu.classList.toggle('open');
        
        // Logging final state
        console.log("After toggle:", sideMenu.classList.value);
    } else {
        console.error('sideMenu element not found.');
    }
};

function initializeMenuToggle() {
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    const sideMenu = document.getElementById("sideMenu");

    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            console.log('Menu icon clicked!');
            window.toggleMenu();
        });
    }

    if (closeIcon) {
        closeIcon.addEventListener('click', () => {
            console.log('Close icon clicked!');
            sideMenu.classList.remove('open');
        });
    }

    // "Click outside" logic for the side menu:
    // If you want this to work on every click (not just once), remove `{ once: true }`.
    document.addEventListener("click", function handleSideMenuOutsideClick(event) {
        if (
            sideMenu &&
            sideMenu.classList.contains("open") &&
            !event.target.closest("#sideMenu") &&       // Not inside the side menu
            !event.target.closest(".menu-icon") &&       // Not the menu icon
            !event.target.closest(".close-icon")         // Not the side menu close icon
        ) {
            sideMenu.classList.remove("open");
        }
    }, /* { once: true } */);
}

/***************************************************
 * Hooking Sign-In
 ***************************************************/
function hookSignInWithElementIds(emailId, passwordId, signInId) {
    const email = document.getElementById(emailId);
    const password = document.getElementById(passwordId);
    const signIn = document.getElementById(signInId);
    if (!email || !password || !signIn) {
        console.error("SignIn elements not found:", emailId, passwordId, signInId);
        return;
    }
    hookSignIn(signIn, email, password);
}

/***************************************************
 * Page Initialization
 ***************************************************/
function initializePage() {
    loadHTML('header.html', 'header', () => {
        // After header loads
        initializeDropdown();
        initializeModals();
        initializeMenuToggle();
        updateUI();
        attachEventListeners();

        // REMOVED: handleSideMenuOutsideClick() call 
        // because it wasn't defined as a standalone function.
        // The side-menu "click outside" logic is already handled 
        // in initializeMenuToggle().
    });

    loadHTML('footer.html', 'footer');

    // Hide search bars on specific pages
    const currentPath = window.location.pathname;
    if (currentPath.includes("create-store.html")) {
        document.addEventListener("DOMContentLoaded", () => {
            const searchBars = document.querySelectorAll(".search-bar");
            searchBars.forEach((searchBar) => {
                searchBar.style.display = "none";
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
