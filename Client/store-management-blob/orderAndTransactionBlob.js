import { product, order, transaction, variant } from '../integration/fetches.js'
import common from '../common.js';
import PaginationManager from '../pagination.js';
import { syncVariantOptions } from './variantBlob.js';

const orderDiv = document.getElementById('orders')
const paginationManager = new PaginationManager(orderDiv, loadOrders);
// Load orders data
let orderFilters = {};
paginationManager.callLoadPageHandler();
async function loadOrders(page) {
    const orderTableBody = document.getElementById('order-table-body')
    const loader = document.getElementById('loader')
    loader.style.display = 'block'
    try {
        const result = await order.fetchIncomingOrders(page, orderFilters)
        const orders = result.items;
        paginationManager.updatePaginationValues(orders.length, result.totalItems, result.page, result.totalPages);
        
        orderTableBody.innerHTML = ""
        orders.forEach(order => {
            const createdAt = new Date(order.createdAt)
            const createdAtFormatted = createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            const transactionImage = order.Transactions.length > 0
                ? `Payment ${order.Transactions[0].method.toLowerCase()}`
                : 'Missing'
            // Main order row
            const row = document.createElement('tr')
            row.classList.add("main-order-row")
            row.innerHTML = `
                <td>${order.customerName}</td>
                <td>${order.numberOfItems}</td>
                <td>${createdAtFormatted}</td>
                <td>${transactionImage}</td>
                <td>
                    ${order.Transactions.length > 0 && order.Transactions[0].method === 'PROOF-BASED'
                    ? `<button class="action-btn" onclick="openTransactionImage('${order.Transactions[0].id}')">View Image</button>`
                    : 'Missing'
                }
                </td>
                <td class="${getStatusClass(order.status)}">${order.status}</td>
                <td>
                    <button class="action-btn expand-btn" onclick="toggleOrderDetails('${order.id}', this)">
                        Expand
                    </button>
                </td>
            `
            orderTableBody.appendChild(row)
            // Detail row for order items
            const detailRow = document.createElement('tr')
            detailRow.style.display = 'none'
            detailRow.classList.add('order-details')
            detailRow.id = 'details-' + order.id
            const detailCell = document.createElement('td')
            detailCell.colSpan = 8
            detailCell.style = 'width: 100%;'
            detailCell.innerHTML = `
                    <div><strong class="orderIdCopy" onclick="copyToClipboard('${order.id}')">${order.customerName}'s Order:</strong></div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #ff9900; color: #fff;">
                                <th style="padding: 5px; border: 1px solid #ddd;">Product</th>
                                <th style="padding: 5px; border: 1px solid #ddd;">Variant</th>
                                <th style="padding: 5px; border: 1px solid #ddd;">Quantity</th>
                                <th style="padding: 5px; border: 1px solid #ddd;">Price</th>
                                <th style="padding: 5px; border: 1px solid #ddd;">Notes</th>
                                <th style="padding: 5px; border: 1px solid #ddd;">Status</th>
                                <th style="padding: 5px; border: 1px solid #ddd;">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div class="transactionDetails" style="max-width: 30%; max-height: 40%; margin: auto;"></div>
                    <div class="extraOrderDetails" style="margin: auto;"> 
                        <p>Customer Contacts</p>
                        <p>${order.customerEmail} ・ ${order.customerPhone}</p>
                    </div>
                `
            detailRow.appendChild(detailCell)
            orderTableBody.appendChild(detailRow)
        })
        // After populating rows, update the search filter (only main rows) so that detail rows remain collapsed.
    } catch (error) {
        console.error('Error loading orders:', error)
    } finally {
        loader.style.display = 'none'
    }
}

let cachedVariants = [];
const variantFilterSelect = document.getElementById('order-variant-filter-select');
variantFilterSelect.addEventListener('change', function () {
    const selectedIndex = variantFilterSelect.value;
    orderFilters.variantId = cachedVariants[selectedIndex].id;
    formatFilterAndReloadOrders()
})
function cacheVariantUpdateSelect(variants) {
    cachedVariants = variants;
    variantFilterSelect.disabled = !variants;
    variantFilterSelect.innerHTML = "";
    if (variants) {
        syncVariantOptions(variants, variantFilterSelect);
        orderFilters.variantId = variants.find(variant => variant.isDefault).id;
        variantFilterSelect.selected = orderFilters.variantId;
    } else {
        variantFilterSelect.innerHTML = "<option>...</option>"
        orderFilters.variantId = undefined;
    }
    formatFilterAndReloadOrders()
}

const productSearch = document.getElementById("search-product");
common.InputDebouncer.listen(productSearch, updateOrderVariantFilter, true)
productSearch.onblur = updateOrderVariantFilter;
let lastNameSearched = "";
async function updateOrderVariantFilter()
{
    if (productSearch.value != lastNameSearched) {
        lastNameSearched = productSearch.value;
        const results = await product.fetchOwnedProducts(1, { name: productSearch.value });
        const productWithMatchingName = results.items[0];
        cacheVariantUpdateSelect(productWithMatchingName?.Variants);
    }
}

const noteSearch = document.getElementById("search-notes");
common.InputDebouncer.listen(noteSearch, updateOrderNotesFilter, true)
noteSearch.onblur = updateOrderNotesFilter;
let lastNoteSearched = "";
async function updateOrderNotesFilter()
{
    if(noteSearch.value != lastNoteSearched)
    {
        lastNoteSearched = noteSearch.value;
        console.log("CHAGED");
        orderFilters.notes = noteSearch.value;
        formatFilterAndReloadOrders();
    }
}

common.InputDebouncer.listen(noteSearch, async function () {
    if (noteSearch.value == "") return;
    // just update the cachedFilter and reload orders;
}, true)

function formatFilterAndReloadOrders() {
    for (const key in orderFilters) {
        if (!orderFilters[key]) // if it's falsy
        {
            delete orderFilters[key];
        }
    }
    paginationManager.callLoadPageHandler(1);
}

function getStatusClass(status) {
    if (status.includes('COMPLETED')) {
        return 'status-completed'
    } else if (status.includes('READ')) {
        return 'status-ready'
    } else if (status.includes('CANCELLED')) {
        return 'status-cancelled'
    } else {
        return 'status-pending'
    }
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text)
}

window.toggleOrderDetails = function (orderId, buttonElement) {
    const detailRow = document.getElementById('details-' + orderId)
    if (detailRow.style.display === 'none' || detailRow.style.display === '') {
        detailRow.style.display = 'table-row'
        buttonElement.innerText = 'Collapse'
        populatetDetailRow(orderId, detailRow)
    } else {
        detailRow.style.display = 'none'
        buttonElement.innerText = 'Expand'
    }
}

const cachedOrders = {}
async function populatetDetailRow(orderId, detailRow) {
    if (!cachedOrders[orderId]) cachedOrders[orderId] = await order.fetchOrder(orderId)
    const fullOrder = cachedOrders[orderId]
    const tbody = detailRow.querySelector('tbody')
    tbody.innerHTML = ""
    fullOrder.OrderItems.forEach(orderItem => {
        tbody.innerHTML += `
                <tr style="border: 1px solid #ddd;" id="tbodyrow-${orderItem.id}">
                    <td style="padding: 5px; border: 1px solid #ddd;">${orderItem.productName}</td>
                    <td style="padding: 5px; border: 1px solid #ddd;">${orderItem.variantName}</td>
                    <td style="padding: 5px; border: 1px solid #ddd;">${orderItem.quantity}</td>
                    <td style="padding: 5px; border: 1px solid #ddd;">Rp ${orderItem.variantPrice.toLocaleString('id-ID')}</td>
                    <td style="padding: 5px; border: 1px solid #ddd;" class="${getStatusClass(orderItem.status)}">${orderItem.status}</td>
                    <td style="padding: 5px; border: 1px solid #ddd;">${orderItem.notes || ""}</td>
                    <td style="padding: 5px; border: 1px solid #ddd;">
                      <select class="status-select" data-order-item-id="${orderItem.id}">
                          <option value="PENDING" ${orderItem.status === "PENDING" ? "selected" : ""}>PENDING</option>
                          <option value="READY" ${orderItem.status === "READY" ? "selected" : ""}>READY</option>
                          <option value="COMPLETED" ${orderItem.status === "COMPLETED" ? "selected" : ""}>COMPLETED</option>
                          <option value="CANCELLED" ${orderItem.status === "CANCELLED" ? "selected" : ""}>CANCELED</option>
                      </select>
                    </td>
                </tr>
            `
    })
    fullOrder.OrderItems.forEach(orderItem => {
        const selectElement = document.querySelector(`#tbodyrow-${orderItem.id} .status-select`)
        console.log(selectElement);
        if (selectElement) {
            selectElement.addEventListener('change', async event => {
                console.log("TEST");
                const newStatus = event.target.value
                if (newStatus !== orderItem.status) {
                    try {

                        await order.updateItemStatus(orderItem.id, newStatus)

                        const statusTd = document.querySelector(`#tbodyrow-${orderItem.id} td:nth-child(5)`)
                        statusTd.textContent = newStatus
                        statusTd.className = getStatusClass(newStatus)
                        orderItem.status = newStatus
                    } catch (err) {
                        event.target.value = orderItem.status
                        throw err;
                    }
                }
            })
        }
    })
}

window.openTransactionImage = async function (transactionId) {
    try {
        const proofTransaction = await transaction.fetchTransaction(transactionId)
        if (proofTransaction && proofTransaction.Image && proofTransaction.Image.url) {
            const imageUrl = proofTransaction.Image.url
            window.open('image.html?src=' + encodeURIComponent(imageUrl), '_blank')
        } else {
            alert('No transaction image found.')
        }
    } catch (error) {
        console.error('Error fetching transaction image:', error)
        alert('Failed to fetch transaction image.')
    }
}
async function deleteOrder(orderId) {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
        // order.deleteOrder(orderId)
        alert(`Order ${orderId} deleted.`)
    }
}

const bulkStatusUpdateSelect = document.getElementById("bulk-status-update-select");
window.bulkUpdateStatusByProduct = async function() {
    const newStatus = bulkStatusUpdateSelect.value;
    await order.updateItemStatusWhere(orderFilters, newStatus);
    paginationManager.callLoadPageHandler();
}