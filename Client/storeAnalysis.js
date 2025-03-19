import { store } from "./integration/fetches.js";

const endDateElement = document.getElementById('end-date');
const startDateElement = document.getElementById('start-date');
const storeRevenueElement = document.getElementById('store-revenue');
export function setupAnalyticsDateRange() {
    // Default Start date = first date of this month
    const today = new Date();
    const format = (date) => date.toISOString().split('T')[0];
    endDateElement.value = format(today);
    startDateElement.value = format(new Date(today.getFullYear(), today.getMonth(), 2));
}
setupAnalyticsDateRange();
export async function loadAnalysis(storeId) {
    endDateElement.onchange = () => calculateRevenue(storeId);
    startDateElement.onchange = () => calculateRevenue(storeId);
    calculateRevenue(storeId)
}
export async function calculateRevenue(storeId) {
    const { startDate, endDate } = getStartEndDate();
    const analytics = await store.fetchStoreAnalytics(storeId, startDate, endDate)
    storeRevenueElement.innerText = `Revenue: Rp ${analytics.revenue.toLocaleString('id-ID')}`;
}

function getStartEndDate() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
}