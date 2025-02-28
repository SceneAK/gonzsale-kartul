import { user } from "./fetches.js";
import { hookSignIn } from "./user.js";

/***************************************************
 * Utility: Load External HTML into a Div
 ***************************************************/
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

    // Show or hide edit forms (and dynamically populate if logged in)
    doElementsOfSelector('.editForm', editForm => {
        if (loginDetails) {
            const isStoreManager = loginDetails.role === 'STORE_MANAGER';
            const isAdmin = loginDetails.role === 'ADMIN';
            editForm.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <p>Hello, <strong>${loginDetails.name || 'User'}</strong>!</p>
                    <p style="color: #555;">Role: ${isAdmin ? 'Admin' : (isStoreManager ? 'Store Manager' : 'User')}</p>
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
                ${isAdmin
                    ? `<button onclick="window.location.href='admin.html'" style="width: 100%; padding: 10px; margin-bottom: 5px;">
                            Raw Requests
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
                    user.expireCookie().then(() => {
                        localStorage.removeItem('loginDetail');
                        window.location.reload();
                    });
                });
            }
            editForm.style.display = 'block';
        } else {
            editForm.style.display = 'none';
        }
    });

    // Update dropdown link text based on login state
    doElementsOfSelector('.dropdown a', element => {
        if (loginDetails) {
            const displayName = loginDetails.name.length > 15
                ? `${loginDetails.name.slice(0, 12)}...`
                : loginDetails.name;
            element.innerHTML = `
                <img src="assets/images/user_logged_in_icon.svg" alt="User Icon">
                ${displayName || 'User'}
            `;
        } else {
            element.innerHTML = `
                <img src="assets/images/sign_in_icon.svg" alt="Sign In Icon">
                Sign In
            `;
        }
    });
}

/***************************************************
 * Update UI Based on Login State
 ***************************************************/
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

    // Hook desktop login elements
    hookSignInWithElementIds('email', 'password', 'signIn');
}

/***************************************************
 * Attach Global Event Listeners
 ***************************************************/
function attachEventListeners() {
    // Attach logout listeners to all elements with .logoutButton
    doElementsOfSelector('.logoutButton', logoutButton => {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loginDetail');
            updateUI();
            window.location.reload();
        });
    });
}

/***************************************************
 * Modal Logic: Local Overlay-based
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
    // Close modal when clicking outside the .modal-content
    const modals = document.querySelectorAll(".modal-overlay");
    modals.forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (!event.target.closest(".modal-content")) {
                modal.classList.remove("show");
            }
        });
    });

    // Hook mobile login elements
    hookSignInWithElementIds('email_mobile', 'password_mobile', 'signIn_mobile');
}

/***************************************************
 * Side Menu Toggle
 ***************************************************/
window.toggleMenu = function () {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
        console.log("Found sideMenu:", sideMenu);
        // Toggle side menu open state
        sideMenu.classList.remove('open');
        sideMenu.classList.toggle('open');
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

    // Close side menu when clicking outside of it
    document.addEventListener("click", function handleSideMenuOutsideClick(event) {
        if (
            sideMenu &&
            sideMenu.classList.contains("open") &&
            !event.target.closest("#sideMenu") &&
            !event.target.closest(".menu-icon") &&
            !event.target.closest(".close-icon")
        ) {
            sideMenu.classList.remove("open");
        }
    });
}

// Close side menu on hashchange
window.addEventListener('hashchange', function () {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu && sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
    }
});

/***************************************************
 * Hooking Sign-In Functionality
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
        alert(message);
    };

    // Trigger sign-in on button click
    signIn.addEventListener("click", async function () {
        if (!email.value.trim() || !password.value.trim()) {
            displayError("Please fill in both email and password.");
            return;
        }
        try {
            await user.signIn(email.value, password.value);
        } catch (err) {
            displayError("Incorrect email or password. Please try again.");
        }
    });

    // Trigger sign-in on Enter key press
    [email, password].forEach((input) => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                signIn.click();
            }
        });
    });

    hookSignIn(signIn, email, password);
}

/***************************************************
 * Cart Notification, Animation & Fly-to-Cart Effect
 * Updates header cart notifications (desktop and mobile).
 * Also animates a box icon flying from the add-to-cart button
 * (provided via event.detail.source) to the destination cart button.
 ***************************************************/
function updateCartNotification(animate = false) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.length;

    // --- Desktop Cart Update ---
    const myCartButton = document.getElementById('my-cart');
    if (myCartButton) {
        const baseBgColor = cartCount > 0 ? "rgb(66, 197, 6)" : "rgb(226, 224, 223)";
        const textColor = cartCount > 0 ? "#fff" : "#272727";

        myCartButton.innerHTML = `
            <img src="assets/images/cart_icon.svg" alt="Cart Icon">
            My Cart ${cartCount > 0 ? `<span class="badge" id="cart-count">${cartCount}</span>` : ""}
        `;
        myCartButton.style.color = textColor;

        if (animate) {
            // Desktop sliding box animation
            myCartButton.style.position = 'relative';
            const slideBox = document.createElement('div');
            slideBox.className = 'slide-box';
            slideBox.style.position = 'absolute';
            slideBox.style.top = '0';
            slideBox.style.left = '-30%';
            slideBox.style.width = '100%';
            slideBox.style.height = '100%';
            slideBox.style.zIndex = '100';
            slideBox.style.backgroundColor = 'rgba(255,255,255,0.7)';
            slideBox.style.transition = 'left 0.5s ease-out';
            myCartButton.appendChild(slideBox);
            slideBox.getBoundingClientRect(); // Force reflow
            slideBox.style.left = '0';
            slideBox.addEventListener("transitionend", function () {
                myCartButton.style.backgroundColor = baseBgColor;
                myCartButton.removeChild(slideBox);
            });
        } else {
            myCartButton.style.backgroundColor = baseBgColor;
        }

        if (!myCartButton.dataset.hoverInitialized) {
            myCartButton.addEventListener("mouseover", function () {
                const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const currentCount = currentCart.length;
                const newHoverColor = currentCount > 0 ? "rgb(51, 152, 0)" : "rgb(200, 200, 200)";
                myCartButton.style.backgroundColor = newHoverColor;
            });
            myCartButton.addEventListener("mouseout", function () {
                const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const currentCount = currentCart.length;
                const originalColor = currentCount > 0 ? "rgb(66, 197, 6)" : "rgb(226, 224, 223)";
                myCartButton.style.backgroundColor = originalColor;
            });
            myCartButton.dataset.hoverInitialized = "true";
        }
    }

    // --- Mobile Cart Update & Bounce Animation ---
    const mobileCartBadge = document.getElementById('mobile-cart-count');
    if (mobileCartBadge) {
        mobileCartBadge.style.display = cartCount > 0 ? "block" : "none";
        mobileCartBadge.textContent = cartCount;
    }
    const mobileCart = document.querySelector('.myCart-mobile');
    if (mobileCart && animate) {
        mobileCart.style.transition = 'transform 0.5s ease-in-out';
        mobileCart.style.transform = 'scale(1.2)';
        setTimeout(() => {
            mobileCart.style.transform = 'scale(1)';
        }, 500);
    }
}

/***************************************************
 * Fly-to-Cart Animation
 * Animates a box icon flying from a source element (e.g., add-to-cart button)
 * to the target cart element (desktop: #my-cart, mobile: .myCart-mobile).
 ***************************************************/
function flyBoxToCart(sourceElement, targetElement) {
    // Get bounding rectangles relative to viewport
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Create the flying box element
    const flyBox = document.createElement('img');
    flyBox.src = "assets/images/box_icon.svg"; // Update with your box icon path
    flyBox.style.position = 'fixed'; // Fixed so it follows the viewport
    flyBox.style.width = '30px';
    flyBox.style.height = '30px';
    flyBox.style.zIndex = '2000';
    flyBox.style.transition = 'all 0.8s ease-in-out';

    // Position it at the center of the source element
    const startX = sourceRect.left + sourceRect.width / 2 - 15; // 15 = half width (30px/2)
    const startY = sourceRect.top + sourceRect.height / 2 - 15;
    flyBox.style.left = `${startX}px`;
    flyBox.style.top = `${startY}px`;

    document.body.appendChild(flyBox);

    // Calculate destination center point
    const endX = targetRect.left + targetRect.width / 2 - 15;
    const endY = targetRect.top + targetRect.height / 2 - 15;

    // Force reflow before starting animation
    flyBox.getBoundingClientRect();

    // Start the animation by setting new position
    flyBox.style.left = `${endX}px`;
    flyBox.style.top = `${endY}px`;
    flyBox.style.opacity = '0.2';
    flyBox.style.transform = 'scale(0.5)';

    // Remove the element after the animation completes
    flyBox.addEventListener('transitionend', () => {
        if (flyBox && flyBox.parentNode) {
            flyBox.parentNode.removeChild(flyBox);
        }
    });
}

/***************************************************
 * Listen for Cart Updates & Trigger Animations
 * When dispatching a cartUpdated event, pass a detail.source
 * that references the add-to-cart button.
 ***************************************************/
document.addEventListener('cartUpdated', function (e) {
    updateCartNotification(true);

    // Use window.matchMedia to determine if it's a mobile viewport
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const target = isMobile
        ? document.getElementById('my-cart-mobile')
        : document.getElementById('my-cart');

    if (e.detail && e.detail.source && target) {
        flyBoxToCart(e.detail.source, target);
    }
});

/***************************************************
 * Page Initialization
 ***************************************************/
function initializePage() {
    loadHTML('header.html', 'header', () => {
        initializeDropdown();
        initializeModals();
        initializeMenuToggle();
        updateUI();
        attachEventListeners();
        updateCartNotification(); // Initial cart update
    });

    loadHTML('footer.html', 'footer');

    // Hide search bars on "create-store.html"
    if (window.location.pathname.includes("create-store.html")) {
        document.addEventListener("DOMContentLoaded", () => {
            doElementsOfSelector(".search-bar", searchBar => {
                searchBar.style.display = "none";
            });
        });
    }
}

/***************************************************
 * Helper: Process Each Element for a Given Selector
 ***************************************************/
function doElementsOfSelector(selector, callback) {
    const elements = document.querySelectorAll(selector);
    Array.from(elements).forEach(callback);
}

// Initialize the page when DOM is ready.
document.addEventListener('DOMContentLoaded', initializePage);
