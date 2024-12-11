import { hookSignIn, hookSignUp } from "./integration/user.js";

// Function to load external HTML file into a div
function loadHTML(file, elementId, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback(); // Call the callback after loading
        })
        .catch(err => console.error(`Error loading ${file}:`, err));
}

// Function to initialize dropdown functionality
function initializeDropdown() {
    const dropdownLink = document.querySelector('.dropdown a');
    const dropdownContent = document.getElementById("dropdown-content");

    if (dropdownLink && dropdownContent) {
        // Toggle dropdown visibility
        dropdownLink.addEventListener('click', function (event) {
            event.preventDefault();
            dropdownContent.classList.toggle("dropdown-show"); // Update to use dropdown-show
        });

        // Close dropdown if clicked outside
        window.addEventListener('click', function (event) {
            if (!event.target.closest('.dropdown')) {
                dropdownContent.classList.remove('dropdown-show'); // Update to use dropdown-show
            }
        });

        console.log('Dropdown functionality initialized.');
    } else {
        console.error('Dropdown elements not found.');
    }

    hookSignInWithElementIds('email', 'password', 'signIn')
}
function hookSignInWithElementIds(emailId, passwordId, signInId)
{
    const email = document.getElementById(emailId);
    const password = document.getElementById(passwordId);
    const signIn = document.getElementById(signInId);
    hookSignIn(signIn, email, password);
}

// Function to update UI based on login state
export function updateUI() {
    const loginForm = document.getElementById("loginForm");
    const manageProductsBtn = document.getElementById("manageProductsBtn");
    const addProductBtn = document.getElementById("addProductBtn");
    const dropdownLink = document.querySelector('.dropdown a');

    const loginDetail = localStorage.getItem('loginDetail');
    if (loginDetail) {
        if (dropdownLink) dropdownLink.textContent = loginDetail.user_name; // Show username instead of "Sign In"
        if (loginForm) loginForm.style.display = "none"; // Hide login form
        if(loginDetail.user_role == 'STORE_MANAGER')
        {
            if (manageProductsBtn) manageProductsBtn.style.display = "block"; // Show "Manage Products" button
            if (addProductBtn) addProductBtn.style.display = "inline-block"; // Show "Add New Product" button
        }
    }
}

// Function to toggle modals (added for mobile login modal functionality)
window.toggleModal = function(modalId) { 
    console.log(`Toggling modal with ID: ${modalId}`); // Debugging log
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found!`);
        return;
    }
    modal.classList.toggle("show");
}

// Add event listener for modal close when clicking outside
function initializeModals() {

    // Close Modal if click
    window.addEventListener("click", function (event) {
        const modal = document.querySelector(".modal-overlay.show");
        if (modal && event.target === modal) {
            modal.classList.remove("show");
        }
    });

    hookSignInWithElementIds('email_mobile', 'password_mobile', 'signIn_mobile')
}


// Load the header and footer, and ensure dropdown and modal functionalities initialize
function initializePage() {
    loadHTML('header.html', 'header', function () {
        const headerLoadedEvent = new Event('headerLoaded');
        document.dispatchEvent(headerLoadedEvent); // Notify other scripts

        initializeDropdown(); 
        initializeModals();
        updateUI(); 
    });

    loadHTML('footer.html', 'footer'); // Load footer if needed
}

// Call initializePage on load
document.addEventListener('DOMContentLoaded', initializePage);
// abi code