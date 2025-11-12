// form.js - Shoe Management (Simplified Fields) - Using ES6 Arrow Functions
import { initialShoes } from "../../../database/shoes.js";

let shoes = [...initialShoes];

let editingId = null;

// DOM Elements - will be initialized after DOM loads
let shoeContainer;
let form;
let searchInput;
let shoeCountBadge;
let alertBanner;
let alertMessage;
let sortSelect;
let sortOption = 'recent';

// Initialize - Using Arrow Function
const initialize = () => {
  // Initialize DOM elements
  shoeContainer = document.getElementById("shoeContainer");
  form = document.getElementById("shoeForm");
  searchInput = document.getElementById("searchInput");
  shoeCountBadge = document.getElementById("shoeCount");
  alertBanner = document.getElementById("alert-banner");
  alertMessage = document.getElementById("alert-message");
  sortSelect = document.getElementById("sortSelect");

  // Set up event listeners
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
  
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortOption = e.target.value;
      renderShoes(searchInput?.value || "");
    });
  }

  // Initial render
  renderShoes();
  updateShoeCount();
};

document.addEventListener("DOMContentLoaded", initialize);

// Helper to apply selected sort
const applySort = (arr) => {
  const copy = [...arr];
  if (sortOption === 'brand') {
    return copy.sort((a, b) => a.shoeBrand.localeCompare(b.shoeBrand));
  }
  if (sortOption === 'name') {
    return copy.sort((a, b) => a.shoeName.localeCompare(b.shoeName));
  }
  // 'recent' default: by id/time desc (newest first)
  return copy.sort((a, b) => (b.id - a.id));
};

// Render shoes - Using Arrow Function
const renderShoes = (filterText = "") => {
  const filtered = shoes.filter(
    (shoe) =>
      shoe.shoeName.toLowerCase().includes(filterText.toLowerCase()) ||
      shoe.shoeBrand.toLowerCase().includes(filterText.toLowerCase())
  );

  const list = applySort(filtered);

  if (filtered.length === 0) {
    shoeContainer.innerHTML = `
      <div class="col-span-full empty-state">
        <svg class="mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-xl font-semibold text-gray-600">No shoes found</p>
        <p class="text-gray-500 mt-2">Try adjusting your search or add a new shoe</p>
      </div>`;
    return;
  }

  shoeContainer.innerHTML = list
    .map(
      (shoe) => `
      <div class="card group">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            ${escapeHtml(shoe.shoeBrand.charAt(0).toUpperCase())}
          </div>
          <h3 class="flex-1 m-0">${escapeHtml(shoe.shoeName)}</h3>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            <p class="m-0"><strong>Brand:</strong> ${escapeHtml(shoe.shoeBrand)}</p>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <p class="m-0"><strong>Size:</strong> ${escapeHtml(shoe.shoeSize)}</p>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="m-0"><strong>Feet Shape:</strong> ${escapeHtml(shoe.feetShape)}</p>
          </div>
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            <p class="m-0 break-all">
              <strong>Source:</strong><br>
              <a href="${escapeHtml(shoe.sourceLink)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:underline">
                ${truncateUrl(shoe.sourceLink, 35)}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </p>
          </div>
        </div>
        <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button class="edit-btn flex-1 flex items-center justify-center gap-2" onclick="window.editShoe(${shoe.id})">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit
          </button>
          <button class="delete-btn flex-1 flex items-center justify-center gap-2" onclick="window.deleteShoe(${shoe.id})">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Delete
          </button>
        </div>
      </div>`
    )
    .join("");

  updateShoeCount();
};

// Submit Handler - Using Arrow Function
const handleSubmit = (e) => {
  e.preventDefault();

  const shoeData = {
    id: editingId || Date.now(),
    shoeBrand: document.getElementById("shoeBrand").value.trim(),
    shoeName: document.getElementById("shoeName").value.trim(),
    shoeSize: document.getElementById("shoeSize").value.trim(),
    feetShape: document.getElementById("feetShape").value.trim(),
    sourceLink: document.getElementById("sourceLink").value.trim(),
  };

  if (editingId) {
    const index = shoes.findIndex((s) => s.id === editingId);
    if (index !== -1) {
      shoes[index] = shoeData;
      showAlert("Shoe updated successfully!");
      editingId = null;
    }
  } else {
    shoes.push(shoeData);
    showAlert("Shoe added successfully!");
  }

  form.reset();
  renderShoes(searchInput?.value || "");
};

// Delete - Using Arrow Function
const deleteShoe = (id) => {
  if (confirm("Are you sure you want to delete this shoe?")) {
    shoes = shoes.filter((shoe) => shoe.id !== id);
    renderShoes(searchInput?.value || "");
    showAlert("Shoe deleted successfully!");
  }
};

// Edit - Using Arrow Function
const editShoe = (id) => {
  const shoe = shoes.find((s) => s.id === id);
  if (shoe) {
    document.getElementById("shoeBrand").value = shoe.shoeBrand;
    document.getElementById("shoeName").value = shoe.shoeName;
    document.getElementById("shoeSize").value = shoe.shoeSize;
    document.getElementById("feetShape").value = shoe.feetShape;
    document.getElementById("sourceLink").value = shoe.sourceLink;
    editingId = id;
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
  }
};

// Make functions available globally for onclick handlers
window.editShoe = editShoe;
window.deleteShoe = deleteShoe;

// Search - Using Arrow Function
const handleSearch = (e) => renderShoes(e.target.value);

// Count - Using Arrow Function
const updateShoeCount = () => {
  shoeCountBadge.textContent = shoes.length;
};

// Alert - Using Arrow Function
const showAlert = (message) => {
  alertMessage.textContent = message;
  alertBanner.classList.remove("hidden");
  setTimeout(() => alertBanner.classList.add("hidden"), 3000);
};

// Utilities - Using Arrow Functions
const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const truncateUrl = (url, max = 40) => {
  return url.length > max ? url.substring(0, max) + "..." : url;
};













