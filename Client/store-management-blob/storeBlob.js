import { store } from '../integration/fetches.js'
import common from '../common.js';

const createStoreModal = document.getElementById('create-store-modal');
window.openCreateStoreModal = async function () {
    createStoreModal.classList.add('active');
}
window.closeCreateStoreModal = async function () {
    createStoreModal.classList.remove('active');
}
loadStore();
// Load store data
export async function loadStore() {
    const storeContainer = document.getElementById("store-container");

    try {
        // Fetch the user's store (replace with your actual API call)
        const userStore = await store.fetchOwnedStore();

        if (!userStore) {
            // No store exists—check the logged-in user's role.
            const user = JSON.parse(localStorage.getItem('loginDetail'));
            if (user && user.role === 'STORE_MANAGER') {
                // If the user is a store manager, prompt to create a store.
                storeContainer.innerHTML = `
  <div style="text-align: center; padding: 20px;">
    <p>You haven't created a store yet.</p>
    <button class="btn-primary" onclick="openCreateStoreModal()">Create one now!</button>
  </div>
`;
                document.getElementById("create-store-form").addEventListener("submit", async function (event) {
                    event.preventDefault()

                    const formData = new FormData(this)

                    try {
                        await store.createStore(formData)
                        window.closeCreateStoreModal();
                        loadStore() // Reload store data
                    } catch (error) {
                        console.error("Error creating store:", error)
                        alert("There was an error creating the store. Please try again.")
                    }
                })
            } else {
                // Otherwise, show a message to contact the admins.
                storeContainer.innerHTML = `<p>Contact Admins to be granted Store Manager Role</p>`;
            }
        } else {
            // If a store exists, display its details.
            storeContainer.innerHTML = `
<div class="store-details">
  <h2>${userStore.name}</h2>
  <p>${userStore.description}</p>
  <img src="${userStore.image?.url || 'placeholder.png'}" alt="${userStore.name}" style="width: 100%; max-width: 300px; border-radius: 8px;">
  <p><strong>Bank Account:</strong> ${userStore.bankAccount}</p>
  <p><strong>Bank Name:</strong> ${userStore.bankName}</p>
  <button class="btn-primary" onclick="editStore()">Edit Store</button>
</div>
`;
        }
    } catch (error) {
        console.error("Error loading store:", error);
        storeContainer.innerHTML = `<p>Failed to load store data. Please try again later.</p>`;
    }
}


// Placeholder function for editing store
window.editStore = async function () {
    try {
        const userStore = await store.fetchOwnedStore();
        if (!userStore) {
            alert("No store found. Please create a store first.");
            return;
        }

        // Populate modal fields with fetched store details
        document.getElementById('edit-store-name').value = userStore.name;
        document.getElementById('edit-store-description').value = userStore.description;
        document.getElementById('edit-store-bankAccount').value = userStore.bankAccount;
        document.getElementById('edit-store-bankName').value = userStore.bankName;

        // Show the modal
        document.getElementById('edit-store-modal').classList.add('active');
    } catch (error) {
        console.error("Error fetching store details:", error);
        alert("Failed to fetch store details. Please try again later.");
    }
};

window.closeEditStoreModal = function () {
    document.getElementById('edit-store-modal').classList.remove('active');
};
window.closeEditStoreModal = function () {
    document.getElementById('edit-store-modal').classList.remove('active');
};
