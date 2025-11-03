import {mydata} from "../../../database/shoe.js"
  // form.js - Shoe Management (Simplified Fields)
console.log(mydata);


let shoes = [
  {
    id: 1,
    shoeBrand: "Nike",
    shoeName: "Air Runner",
    shoeSize: "9",
    feetShape: "Wide",
    sourceLink: "https://nike.com/airrunner"
  },
  {
    id: 2,
    shoeBrand: "Adidas",
    shoeName: "Ultra Boost",
    shoeSize: "10",
    feetShape: "Narrow",
    sourceLink: "https://adidas.com/ultraboost"
  }
];

let editingId = null;

// DOM Elements
const shoeContainer = document.getElementById("shoeContainer");
const form = document.getElementById("shoeForm");
const searchInput = document.getElementById("searchInput");
const shoeCountBadge = document.getElementById("shoeCount");
const alertBanner = document.getElementById("alert-banner");
const alertMessage = document.getElementById("alert-message");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  renderShoes();
  updateShoeCount();
});

// Render shoes
function renderShoes(filterText = "") {
  const filtered = shoes.filter(
    (shoe) =>
      shoe.shoeName.toLowerCase().includes(filterText.toLowerCase()) ||
      shoe.shoeBrand.toLowerCase().includes(filterText.toLowerCase())
  );

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

  shoeContainer.innerHTML = filtered
    .map(
      (shoe) => `
      <div class="card">
        <h3>${escapeHtml(shoe.shoeName)}</h3>
        <p><strong>Brand:</strong> ${escapeHtml(shoe.shoeBrand)}</p>
        <p><strong>Size:</strong> ${escapeHtml(shoe.shoeSize)}</p>
        <p><strong>Feet Shape:</strong> ${escapeHtml(shoe.feetShape)}</p>
        <p><strong>Source Link:</strong><br>
          <a href="${escapeHtml(shoe.sourceLink)}" target="_blank">${truncateUrl(shoe.sourceLink)}</a>
        </p>
        <div class="flex gap-2 mt-4">
          <button class="edit-btn flex-1" onclick="editShoe(${shoe.id})">Edit</button>
          <button class="delete-btn flex-1" onclick="deleteShoe(${shoe.id})">Delete</button>
        </div>
      </div>`
    )
    .join("");

  updateShoeCount();
}

// Submit Handler
form.addEventListener("submit", (e) => {
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
  renderShoes(searchInput.value);
});

// Delete
function deleteShoe(id) {
  if (confirm("Are you sure you want to delete this shoe?")) {
    shoes = shoes.filter((shoe) => shoe.id !== id);
    renderShoes(searchInput.value);
    showAlert("Shoe deleted successfully!");
  }
}

// Edit
function editShoe(id) {
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
}

// Search
searchInput.addEventListener("input", (e) => renderShoes(e.target.value));

// Count
function updateShoeCount() {
  shoeCountBadge.textContent = shoes.length;
}

// Alert
function showAlert(message) {
  alertMessage.textContent = message;
  alertBanner.classList.remove("hidden");
  setTimeout(() => alertBanner.classList.add("hidden"), 3000);
}

// Utilities
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function truncateUrl(url, max = 40) {
  return url.length > max ? url.substring(0, max) + "..." : url;
}













