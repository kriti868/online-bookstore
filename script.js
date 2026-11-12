// ==================== SAMPLE BOOKS ====================
const books = [
{ id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", price: 299, image: "https://via.placeholder.com/250x350?text=Gatsby" },
{ id: 2, title: "Atomic Habits", author: "James Clear", category: "Self-Help", price: 399, image: "https://via.placeholder.com/250x350?text=Atomic+Habits" },
{ id: 3, title: "Sapiens", author: "Yuval Noah Harari", category: "History", price: 449, image: "https://via.placeholder.com/250x350?text=Sapiens" },
{ id: 4, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", price: 249, image: "https://via.placeholder.com/250x350?text=Alchemist" },
{ id: 5, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Finance", price: 349, image: "https://via.placeholder.com/250x350?text=Rich+Dad" },
{ id: 6, title: "Ikigai", author: "Héctor García", category: "Self-Help", price: 279, image: "https://via.placeholder.com/250x350?text=Ikigai" },
{ id: 7, title: "1984", author: "George Orwell", category: "Fiction", price: 299, image: "https://via.placeholder.com/250x350?text=1984" },
{ id: 8, title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", price: 399, image: "https://via.placeholder.com/250x350?text=Psychology+of+Money" }
];

// ==================== LOCAL STORAGE HELPERS ====================
function getUsers() {
return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
localStorage.setItem("currentUser", JSON.stringify(user));
}

function logout() {
localStorage.removeItem("currentUser");
window.location.href = "login.html";
}

function getCart() {
return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
localStorage.setItem("cart", JSON.stringify(cart));
}

// ==================== VALIDATION FUNCTIONS ====================
function showError(id, message) {
const el = document.getElementById(id);
if (el) {
el.style.display = "block";
el.textContent = message;
}
}

function hideError(id) {
const el = document.getElementById(id);
if (el) el.style.display = "none";
}

function validateEmail(email) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
return /^[0-9]{10}$/.test(phone);
}

// ==================== REGISTRATION ====================
function registerUser(event) {
event.preventDefault();

const name = document.getElementById("regName").value.trim();
const email = document.getElementById("regEmail").value.trim();
const phone = document.getElementById("regPhone").value.trim();
const address = document.getElementById("regAddress").value.trim();
const password = document.getElementById("regPassword").value;
const confirmPassword = document.getElementById("regConfirmPassword").value;

let isValid = true;

// Clear previous errors
["nameError", "emailError", "phoneError", "addressError", "passwordError", "confirmError"].forEach(hideError);

if (name.length < 3) {
showError("nameError", "Name must be at least 3 characters");
isValid = false;
}
if (!validateEmail(email)) {
showError("emailError", "Enter a valid email");
isValid = false;
}
if (!validatePhone(phone)) {
showError("phoneError", "Phone must be 10 digits");
isValid = false;
}
if (address.length < 10) {
showError("addressError", "Address is too short");
isValid = false;
}
if (password.length < 6) {
showError("passwordError", "Password must be at least 6 characters");
isValid = false;
}
if (password !== confirmPassword) {
showError("confirmError", "Passwords do not match");
isValid = false;
}

// Check if email already exists
const users = getUsers();
if (users.find(u => u.email === email)) {
showError("emailError", "Email already registered");
isValid = false;
}

if (!isValid) return;

// Save user
users.push({ name, email, phone, address, password });
saveUsers(users);

document.getElementById("regSuccess").style.display = "block";
document.getElementById("regSuccess").textContent = "Registration successful! Redirecting to login...";

setTimeout(() => {
window.location.href = "login.html";
}, 1500);
}

// ==================== LOGIN ====================
function loginUser(event) {
event.preventDefault();

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value;

hideError("loginEmailError");
hideError("loginPasswordError");

const users = getUsers();
const user = users.find(u => u.email === email && u.password === password);

if (!user) {
showError("loginEmailError", "Invalid email or password");
return;
}

setCurrentUser(user);
window.location.href = "profile.html";
}

// ==================== PROFILE ====================
function loadProfile() {
const user = getCurrentUser();
if (!user) {
window.location.href = "login.html";
return;
}

document.getElementById("profileName").textContent = user.name;
document.getElementById("profileEmail").textContent = user.email;
document.getElementById("profilePhone").textContent = user.phone;
document.getElementById("profileAddress").textContent = user.address;
}

function enableEdit() {
document.getElementById("editSection").style.display = "block";
document.getElementById("viewSection").style.display = "none";

const user = getCurrentUser();
document.getElementById("editName").value = user.name;
document.getElementById("editPhone").value = user.phone;
document.getElementById("editAddress").value = user.address;
}

function saveProfile(event) {
event.preventDefault();

const name = document.getElementById("editName").value.trim();
const phone = document.getElementById("editPhone").value.trim();
const address = document.getElementById("editAddress").value.trim();

if (name.length < 3 || !validatePhone(phone) || address.length < 10) {
alert("Please enter valid details");
return;
}

let user = getCurrentUser();
user.name = name;
user.phone = phone;
user.address = address;
setCurrentUser(user);

// Also update in users list
let users = getUsers();
const index = users.findIndex(u => u.email === user.email);
if (index !== -1) {
users[index] = user;
saveUsers(users);
}

loadProfile();
document.getElementById("editSection").style.display = "none";
document.getElementById("viewSection").style.display = "block";
alert("Profile updated successfully!");
}

// ==================== CATALOG ====================
function displayBooks(filterText = "", category = "all") {
const container = document.getElementById("booksContainer");
if (!container) return;

let filtered = books.filter(book => {
const matchesText = book.title.toLowerCase().includes(filterText.toLowerCase()) ||
book.author.toLowerCase().includes(filterText.toLowerCase());
const matchesCategory = category === "all" || book.category === category;
return matchesText && matchesCategory;
});

if (filtered.length === 0) {
container.innerHTML = "<p>No books found.</p>";
return;
}

container.innerHTML = filtered.map(book => `
<div class="book-card">
<img src="${book.image}" alt="${book.title}">
<div class="book-info">
<h3>${book.title}</h3>
<p>by ${book.author}</p>
<p>${book.category}</p>
<div class="price">₹${book.price}</div>
<button class="btn" onclick="addToCart(${book.id})">Add to Cart</button>
</div>
</div>
`).join("");
}

function addToCart(bookId) {
const book = books.find(b => b.id === bookId);
if (!book) return;

let cart = getCart();
const existing = cart.find(item => item.id === bookId);

if (existing) {
existing.quantity += 1;
} else {
cart.push({ ...book, quantity: 1 });
}

saveCart(cart);
alert(`"${book.title}" added to cart!`);
}

// ==================== CART ====================
function displayCart() {
const container = document.getElementById("cartContainer");
if (!container) return;

const cart = getCart();

if (cart.length === 0) {
container.innerHTML = "<p>Your cart is empty. <a href='catalog.html'>Go shopping</a></p>";
document.getElementById("totalsSection").style.display = "none";
return;
}

document.getElementById("totalsSection").style.display = "block";

container.innerHTML = `
<table class="cart-table">
<thead>
<tr>
<th>Book</th>
<th>Price</th>
<th>Quantity</th>
<th>Total</th>
<th>Action</th>
</tr>
</thead>
<tbody>
${cart.map(item => `
<tr>
<td>
<strong>${item.title}</strong><br>
<small>${item.author}</small>
</td>
<td>₹${item.price}</td>
<td>
<button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
${item.quantity}
<button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
</td>
<td>₹${item.price * item.quantity}</td>
<td>
<button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
</td>
</tr>
`).join("")}
</tbody>
</table>
`;

updateTotals();
}

function changeQuantity(id, change) {
let cart = getCart();
const item = cart.find(i => i.id === id);
if (!item) return;

item.quantity += change;
if (item.quantity <= 0) {
cart = cart.filter(i => i.id !== id);
}

saveCart(cart);
displayCart();
}

function removeFromCart(id) {
let cart = getCart().filter(i => i.id !== id);
saveCart(cart);
displayCart();
}

function updateTotals() {
const cart = getCart();
const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const tax = Math.round(subtotal * 0.05); // 5% tax
const total = subtotal + tax;

document.getElementById("subtotal").textContent = "₹" + subtotal;
document.getElementById("tax").textContent = "₹" + tax;
document.getElementById("grandTotal").textContent = "₹" + total;
}

// ==================== PAYMENT ====================
function processPayment(event) {
event.preventDefault();

const name = document.getElementById("cardName").value.trim();
const number = document.getElementById("cardNumber").value.trim().replace(/\s/g, "");
const expiry = document.getElementById("cardExpiry").value.trim();
const cvv = document.getElementById("cardCvv").value.trim();

// Clear errors
["cardNameError", "cardNumberError", "cardExpiryError", "cardCvvError"].forEach(hideError);

let isValid = true;

if (name.length < 3) {
showError("cardNameError", "Enter cardholder name");
isValid = false;
}
if (!/^[0-9]{16}$/.test(number)) {
showError("cardNumberError", "Card number must be 16 digits");
isValid = false;
}
if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
showError("cardExpiryError", "Use format MM/YY");
isValid = false;
}
if (!/^[0-9]{3,4}$/.test(cvv)) {
showError("cardCvvError", "CVV must be 3 or 4 digits");
isValid = false;
}

if (!isValid) return;

// Create order
const user = getCurrentUser();
const cart = getCart();
const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const tax = Math.round(subtotal * 0.05);
const total = subtotal + tax;

const order = {
orderId: "ORD" + Date.now(),
customerName: user ? user.name : name,
customerEmail: user ? user.email : "",
books: cart,
subtotal,
tax,
total,
date: new Date().toLocaleString()
};

localStorage.setItem("lastOrder", JSON.stringify(order));
localStorage.removeItem("cart"); // clear cart

window.location.href = "confirmation.html";
}

// ==================== CONFIRMATION ====================
function showConfirmation() {
const order = JSON.parse(localStorage.getItem("lastOrder"));
if (!order) {
document.getElementById("confirmationContent").innerHTML = "<p>No order found.</p>";
return;
}

document.getElementById("orderId").textContent = order.orderId;
document.getElementById("customerName").textContent = order.customerName;
document.getElementById("orderDate").textContent = order.date;
document.getElementById("orderTotal").textContent = "₹" + order.total;

const list = document.getElementById("orderedBooks");
list.innerHTML = order.books.map(b =>
`<li>${b.title} × ${b.quantity} = ₹${b.price * b.quantity}</li>`
).join("");
}

// ==================== SEARCH ON CATALOG ====================
function setupSearch() {
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categoryFilter");

if (searchInput) {
searchInput.addEventListener("input", () => {
displayBooks(searchInput.value, categorySelect.value);
});
}
if (categorySelect) {
categorySelect.addEventListener("change", () => {
displayBooks(searchInput.value, categorySelect.value);
});
}
}