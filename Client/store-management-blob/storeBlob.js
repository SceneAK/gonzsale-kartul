import { store } from '../integration/fetches.js'
import common from '../common.js';

const storeModal = document.getElementById('store-modal');
const storeForm = document.getElementById("store-form");
window.openCreateStoreModal = async function () {
    storeModal.classList.add('active');
}
window.closeStoreModal = async function () {
    storeModal.classList.remove('active');
}
loadStore();
// Load store data
const imageInput = document.getElementById('store-image-input');
export async function loadStore() {
    const storeContainer = document.getElementById("store-container");

    try {
        const userStore = await store.fetchOwnedStore();

        if (!userStore) {
            // No store exists—check the logged-in user's role.
            imageInput.setAttribute("required", "");
            const user = JSON.parse(localStorage.getItem('loginDetail'));
            if (user && user.role === 'STORE_MANAGER') {
                // If the user is a store manager, prompt to create a store.
                storeContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p>You haven't created a store yet.</p>
                        <button class="btn-primary" onclick="openCreateStoreModal()">Create one now!</button>
                    </div>
                    `;
                storeForm.onsubmit = async function (event) {
                    event.preventDefault()
                    const storeData = common.elementUtils.buildData('.store-inputs', storeModal);
                    await store.createStore(storeData);
                    await store.updateStoreImage(imageInput.files[0]);
                    await loadStore();
                    window.closeStoreModal();
                }
            } else {
                // Otherwise, show a message to contact the admins.
                storeContainer.innerHTML = `<p>Contact Admins to be granted Store Manager Role</p>`;
            }
        } else {
            if (imageInput.hasAttribute("required")) {
                imageInput.removeAttribute("required");
            }
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
        common.elementUtils.populateWithData('.store-inputs', userStore, storeModal);
        imageInput.value = null;

        storeModal.querySelector('h2').innerText = "Edit Store";
        document.getElementById('store-submit-button').innerText = "Edit Store";

        storeForm.onsubmit = async function (event) {
            event.preventDefault()
            const updatedValues = common.elementUtils.buildData('.store-inputs', storeModal);
            try {
                await store.editStore(updatedValues);
                if(imageInput.value) {
                    await store.updateStoreImage(imageInput.files[0]);
                }
                
                await loadStore();
                window.closeStoreModal();
            } catch (error) {
                alert("There was an error editting the store. Please try again.")
                throw error;
            }
        }

        storeModal.classList.add('active');
    } catch (error) {
        console.error("Error fetching store details:", error);
        alert("Failed to fetch store details. Please try again later.");
    }
}
