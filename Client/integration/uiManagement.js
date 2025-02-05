import { user } from "./fetches.js";
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
function toggleDropdownState(loginDetails) {
    // Show or hide login forms
    doElementsOfSelector('.loginForm', loginForm => {
        loginForm.style.display = loginDetails ? 'none' : 'block';
    });

    // Show or hide edit forms
    doElementsOfSelector('.editForm', editForm => {
        if (loginDetails) {
            // Dynamically populate editForm content when logged in
            const isStoreManager = loginDetails.role === 'STORE_MANAGER';
            editForm.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <p>Welcome, <strong>${loginDetails.name || 'User'}</strong></p>
                    <p style="color: #555;">Role: ${isStoreManager ? 'Store Manager' : 'User'}</p>
                </div>
                <hr>
                <button onclick="window.location.href='profile-management.html'" style="width: 100%; padding: 10px; margin-bottom: 5px;">
                    Profile Management
                </button>
                ${isStoreManager
                    ? `<button onclick="window.location.href='store-management.html'" style="width: 100%; padding: 10px; margin-bottom: 5px;">
                            Manage Store
                       </button>`
                    : ''
                }
                <hr>
                <button id="logoutButton" style="width: 100%; padding: 10px; background-color: #ff4c4c; color: white;">
                    Logout
                </button>
            `;

            // Attach logout functionality
            const logoutButton = editForm.querySelector('#logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    user.expireCookie().then( () => {
                        localStorage.removeItem('loginDetail');
                        alert('You have logged out successfully.');
                        window.location.reload()
                    });
                });
            }

            editForm.style.display = 'block';
        } else {
            editForm.style.display = 'none';
        }
    });

    // Update dropdown link text
    doElementsOfSelector('.dropdown a', element => {
        if (loginDetails) {
            // Truncate the name if it exceeds 15 characters
            const displayName = loginDetails.name.length > 15
                ? `${loginDetails.name.slice(0, 12)}...`
                : loginDetails.name;

            // If the user is logged in, display the icon next to their name
            element.innerHTML = `
                <img src="assets/images/user_logged_in_icon.svg" alt="User Icon">
                ${displayName || 'User'}
            `;
        } else {
            // Default text for sign-in with icon
            element.innerHTML = `
                <img src="assets/images/sign_in_icon.svg" alt="Sign In Icon">
                Sign In
            `;
        }
    });
}



// Update UI based on login state
function updateUI() {
    const loginDetail = JSON.parse(localStorage.getItem('loginDetail'));
    toggleDropdownState(loginDetail);
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
    doElementsOfSelector('.logoutButton', logoutButton => {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loginDetail');
            updateUI();
            window.location.reload();
        });
    })
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

    const displayError = (message) => {
        alert(message); // Use alert for now; you can replace with a styled message element
    };

    // Trigger sign-in on button click
    signIn.addEventListener("click", async function () {
        if (!email.value.trim() || !password.value.trim()) {
            displayError("Please fill in both email and password.");
            return;
        }

        try {
            const userInfo = await user.signIn(email.value, password.value);
            trackSignin(userInfo);
            console.log("User signed in:", userInfo);
            alert("Login successful! Welcome, " + userInfo.user_name);
            // Reload or update UI here if needed
        } catch (err) {
            displayError("Incorrect email or password. Please try again.");
        }
    });

    // Trigger sign-in on Enter key press
    [email, password].forEach((input) => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent form submission
                signIn.click(); // Simulate button click
            }
        });
    });

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

function doElementsOfSelector(selector, callback) {
    const elements = document.querySelectorAll(selector);
    Array.from(elements).forEach(callback);
}


document.addEventListener('DOMContentLoaded', initializePage);
