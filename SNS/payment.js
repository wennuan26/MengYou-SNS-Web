// ============ INIT CHECKOUT ============ //This sets up all features once the page is fully loaded.//
document.addEventListener('DOMContentLoaded', function () {
  initializeDateSelectors();
  initializePaymentMethods();
  initializeFormValidation();
  initializeCardFormatting();
  initializeProductData();  // use selectedProduct from localStorage
  loadSavedFormData();
  bindFormSubmit();
  console.log('Checkout page initialized');

  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('input', autoSaveFormData);
  }
});

// ============ DATE SELECTORS ============ //
function initializeDateSelectors() {
  const monthSelect = document.getElementById('birthMonth');
  const daySelect = document.getElementById('birthDay');
  const yearSelect = document.getElementById('birthYear');
  for (let day = 1; day <= 31; day++) {
    const option = document.createElement('option');
    option.value = day.toString().padStart(2, '0');
    option.textContent = day;
    daySelect.appendChild(option);
  }
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1950; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
  monthSelect.addEventListener('change', updateDaysInMonth);
  yearSelect.addEventListener('change', updateDaysInMonth);
}

function updateDaysInMonth() {
  const month = parseInt(document.getElementById('birthMonth').value);
  const year = parseInt(document.getElementById('birthYear').value);
  const daySelect = document.getElementById('birthDay');
  if (month && year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentDay = daySelect.value;
    daySelect.innerHTML = '<option value="">Day</option>';
    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement('option');
      option.value = day.toString().padStart(2, '0');
      option.textContent = day;
      daySelect.appendChild(option);
    }
    if (currentDay && parseInt(currentDay) <= daysInMonth) {
      daySelect.value = currentDay;
    }
  }
}

// ============ PRODUCT LOADING & TOTAL ============ //
function initializeProductData() {
  const data = localStorage.getItem("selectedProduct");
  if (!data) {
    console.warn("No product selected.");
    return;
  }

  const { name, description, imageUrl, price } = JSON.parse(data);

  const img = document.querySelector("#orderItem .item-image img");
  const nameField = document.getElementById("itemName");
  const descField = document.getElementById("itemDesc");
  const priceField = document.getElementById("itemPrice");
  const subtotalField = document.getElementById("subtotal");

  if (img) img.src = imageUrl;
  if (img) img.alt = name;
  if (nameField) nameField.textContent = name;
  if (descField) descField.textContent = description;
  if (priceField) priceField.textContent = `$${price.toFixed(2)}`;
  if (subtotalField) subtotalField.textContent = `$${price.toFixed(2)}`;

  recalculateTotal(price);
}

function recalculateTotal(price) {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';
  const shipping = paymentMethod === 'cod' ? 8.99 : 5.99;
  const tax = 7.20;
  const total = price + shipping + tax;

  document.getElementById("shippingCost").textContent = `$${shipping.toFixed(2)}`;
  document.getElementById("taxAmount").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("finalTotal").textContent = `$${total.toFixed(2)}`;
}

// ============ PAYMENT METHOD HANDLING ============ //
function initializePaymentMethods() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const cardDetails = document.getElementById('cardDetails');
  paymentMethods.forEach(method => {
    method.addEventListener('change', function () {
      if (this.value === 'visa' || this.value === 'mastercard') {
        cardDetails.style.display = 'block';
        makeCardFieldsRequired(true);
      } else {
        cardDetails.style.display = 'none';
        makeCardFieldsRequired(false);
      }
      const data = localStorage.getItem("selectedProduct");
      if (data) {
        const { price } = JSON.parse(data);
        recalculateTotal(price);
      }
    });
  });
}

function makeCardFieldsRequired(required) {
  const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
  cardFields.forEach(id => {
    const field = document.getElementById(id);
    if (field) field.required = required;
  });
}

// ============ FORM VALIDATION ============ //
function initializeFormValidation() {
  const form = document.getElementById('checkoutForm');
  const idInput = document.getElementById('idNumber');
  const contactInput = document.getElementById('contactNumber');

  idInput.addEventListener('input', function () {
    let val = this.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    this.value = val;
    this.style.borderColor = val.length === 10 ? '#4CAF50' : '';
  });

  contactInput.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');
    if (val.length >= 10) {
      val = val.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    this.value = val;
  });
}

// ============ CARD FORMATTING ============ //
function initializeCardFormatting() {
  const cardNumber = document.getElementById('cardNumber');
  const expiry = document.getElementById('expiryDate');
  const cvv = document.getElementById('cvv');

  if (cardNumber) {
    cardNumber.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      this.value = val.slice(0, 19);
    });
  }

  if (expiry) {
    expiry.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '');
      this.value = val.length >= 3 ? val.slice(0, 2) + '/' + val.slice(2, 4) : val;
    });
  }

  if (cvv) {
    cvv.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
    });
  }
}

// ============ AUTO SAVE ============ //
function autoSaveFormData() {
  const form = document.getElementById('checkoutForm');
  const formData = new FormData(form);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  localStorage.setItem('checkoutFormData', JSON.stringify(data));
}

function loadSavedFormData() {
  const data = localStorage.getItem('checkoutFormData');
  if (data) {
    const parsed = JSON.parse(data);
    Object.keys(parsed).forEach(key => {
      const field = document.getElementById(key);
      if (field && field.type !== 'radio' && field.type !== 'checkbox') {
        field.value = parsed[key];
      }
    });
  }
}

// ============ FORM SUBMIT ============ //
function bindFormSubmit() {
  const form = document.getElementById('checkoutForm');
  const btnText = document.querySelector('.btn-text');
  const btnLoading = document.querySelector('.btn-loading');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    setTimeout(() => {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      document.getElementById('successModal').style.display = 'flex';
      document.getElementById('orderIdDisplay').textContent = generateOrderID();
    }, 1500);
  });
}

function generateOrderID() {
  const now = Date.now().toString();
  return `#DF${now.slice(-7)}`;
}

// ============ NAV BACK ============ //
function goBack() {
  window.location.href = 'home.html';
}
