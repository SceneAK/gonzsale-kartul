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
}

// Function to update UI based on login state
function updateUI(isLoggedIn, username) {
    const loginForm = document.getElementById("loginForm");
    const manageProductsBtn = document.getElementById("manageProductsBtn");
    const addProductBtn = document.getElementById("addProductBtn");
    const dropdownLink = document.querySelector('.dropdown a');

    if (isLoggedIn) {
        if (dropdownLink) dropdownLink.textContent = username; // Show username instead of "Sign In"
        if (loginForm) loginForm.style.display = "none"; // Hide login form
        if (manageProductsBtn) manageProductsBtn.style.display = "block"; // Show "Manage Products" button
        if (addProductBtn) addProductBtn.style.display = "inline-block"; // Show "Add New Product" button
    }
}

// Function to toggle modals (added for mobile login modal functionality)
function toggleModal(modalId) {
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
    window.addEventListener("click", function (event) {
        const modal = document.querySelector(".modal-overlay.show");
        if (modal && event.target === modal) {
            modal.classList.remove("show");
        }
    });
}

// Load the header and footer, and ensure dropdown and modal functionalities initialize
function initializePage() {
    loadHTML('header.html', 'header', function () {
        const headerLoadedEvent = new Event('headerLoaded');
        document.dispatchEvent(headerLoadedEvent); // Notify other scripts
        initializeDropdown(); // Initialize dropdown functionality
        initializeModals(); // Initialize modal functionality
        updateUI(false, "JohnDoe"); // Update UI based on login state
    });

    loadHTML('footer.html', 'footer'); // Load footer if needed
}

// Call initializePage on load
document.addEventListener('DOMContentLoaded', initializePage);
// abi code