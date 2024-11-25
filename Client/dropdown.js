// dropdown.js

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
            dropdownContent.classList.toggle("show");
        });

        // Close dropdown if clicked outside
        window.addEventListener('click', function (event) {
            if (!event.target.closest('.dropdown')) {
                dropdownContent.classList.remove('show');
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

// Load the header and footer, and ensure dropdown initializes
function initializePage() {
    loadHTML('header.html', 'header', function () {
        const headerLoadedEvent = new Event('headerLoaded');
        document.dispatchEvent(headerLoadedEvent); // Notify other scripts
        initializeDropdown(); // Initialize dropdown functionality
        updateUI(False, "JohnDoe"); // Update UI based on login state
    });

    loadHTML('footer.html', 'footer'); // Load footer if needed
}
