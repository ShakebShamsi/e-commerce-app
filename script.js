document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: "iPhone 17", price: 799 },
    { id: 2, name: "iPhone 17 Air", price: 899 },
    { id: 3, name: "iPhone 17 Pro", price: 999 },
    { id: 4, name: "iPhone 17 Pro Max", price: 1199 }
  ];

  const cart = [];

  const productList = document.getElementById('product-list');
  const cartItems = document.getElementById('cart-items');
  const emptyCartMessage = document.getElementById('empty-cart');
  const cartTotalMessage = document.getElementById('cart-total');
  const totalPriceDisplay = document.getElementById('total-price');
  const checkOutBtn = document.getElementById('checkout-btn');

  // Render product list
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <span>${product.name} - $${product.price}</span>
      <button data-id="${product.id}">Add to cart</button>
    `;
    productList.appendChild(productDiv);
  });

  // Add to cart button click
  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const product = products.find(p => p.id === productId);
      addToCart(product);
    }
  });

  // Add to cart (with quantity)
  function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage();
    cartRender();
  }

  // Render cart
  function cartRender() {
    cartItems.innerText = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden");
      cartTotalMessage.classList.remove("hidden");

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
          ${item.name} - $${item.price} × ${item.quantity} = $${itemTotal}
          <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartItems.appendChild(cartItem);
      });

      totalPriceDisplay.textContent = `$${totalPrice}`;
    } else {
        emptyCartMessage.classList.remove("hidden");
        cartTotalMessage.classList.add("hidden");
        totalPriceDisplay.textContent = `$0.00`;
    }

    // Remove button click handlers
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        if (!isNaN(index)) {
          cart.splice(index, 1);
          saveCartToLocalStorage();
          cartRender();
        }
      });
    });
  }

  // Checkout button
  checkOutBtn.addEventListener('click', () => {
    cart.length = 0;
    localStorage.removeItem('cart');
    alert("Checkout Successful!");
    cartRender();
  });

  // Save to localStorage
  function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Load from localStorage
  function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      parsedCart.forEach(item => cart.push(item));
    }
  }

  // Initial load
  loadCartFromLocalStorage();
  cartRender();
});
