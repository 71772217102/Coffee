
/*
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
  import { getDatabase,ref,set,get,child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyBXNXh6enngNQD9W-apoEczB_zdkIIKBfo",
    authDomain: "coffee-ad50a.firebaseapp.com",
    databaseURL: "https://coffee-ad50a-default-rtdb.firebaseio.com",
    projectId: "coffee-ad50a",
    storageBucket: "coffee-ad50a.appspot.com",
    messagingSenderId: "760130183376",
    appId: "1:760130183376:web:b18131e2658473ca9c7ed5"
  };

  
  const app = initializeApp(firebaseConfig);

const db =getDatabase(app);
document.getElementById("submit").addEventListener("click",function(e){
    set(ref(db, 'user/' + document.getElementById("username").value),
{
    username:document.getElementById("username").value,
    email:document.getElementById("email").value,
    PhoneNumber:document.getElementById("phone").value
})
alert("Login sucessfull !");
})

*/



// script.js

let cart = [];
let selectedItem = null; // To hold the selected item for customization

// Function to add item to cart
function addToCart(name, price, image, customization = {}) {
    const item = { name, price, image, customization };
    cart.push(item);
    updateCart();
}

// Function to remove item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item from cart by index
    updateCart();
}

// Function to update cart display
function updateCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = ""; // Clear previous items

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "No items in cart";
    } else {
        cart.forEach((item, index) => {
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" height="50" width="50">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price}</p>
                    <p>Milk: ${item.customization.milk || 'None'}, Sugar: ${item.customization.sugar || 'None'}</p>
                    <!-- Cross Button for Deleting Item -->
                    <button class="remove-item" onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        });
    }
}

// Event listener for Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');
        
        // Save selected item temporarily for customization
        selectedItem = { name, price, image };
        openCustomizationModal(); // Open customization modal
    });
});

// Open the customization modal
function openCustomizationModal() {
    const modal = document.getElementById("customization-modal");
    modal.style.display = "block";
}

// Close the customization modal
function closeCustomizationModal() {
    const modal = document.getElementById("customization-modal");
    modal.style.display = "none";
}

// Confirm customization and add item to cart
document.getElementById('confirm-customization').addEventListener('click', () => {
    const milkType = document.getElementById('milk-type').value;
    const sugarLevel = document.getElementById('sugar-level').value;
    
    // Add item to cart with customization
    addToCart(selectedItem.name, selectedItem.price, selectedItem.image, { milk: milkType, sugar: sugarLevel });
    
    // Reset selectedItem and close modal
    selectedItem = null;
    closeCustomizationModal();
});

// Cancel customization
document.getElementById('cancel-customization').addEventListener('click', () => {
    selectedItem = null;
    closeCustomizationModal();
});

// Optional: Add event listener for cart icon button to toggle cart display
document.getElementById('cart-btn').addEventListener('click', () => {
    const cartDiv = document.getElementById('cart');
    cartDiv.style.display = cartDiv.style.display === 'none' || cartDiv.style.display === '' ? 'block' : 'none';
});

document.querySelectorAll('.star-rating .star').forEach(star => {
    star.addEventListener('click', function () {
        const value = this.getAttribute('data-value');
        const allStars = this.parentNode.querySelectorAll('.star');
        
        // Reset all stars
        allStars.forEach(star => {
            star.classList.remove('selected');
        });

        // Select stars up to the clicked one
        this.classList.add('selected');
        let previousSibling = this.previousElementSibling;
        while (previousSibling) {
            previousSibling.classList.add('selected');
            previousSibling = previousSibling.previousElementSibling;
        }

        // Update rating value display
        const ratingText = this.parentNode.nextElementSibling;
        ratingText.textContent = `Rating: ${value}/5`;
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceDiv = document.getElementById('total-price');
    const paymentButton = document.getElementById('payment-button');
    const paymentMessage = document.getElementById('payment-message');

    let cart = []; // Initialize an empty cart
    let totalCost = 0; // Initialize total cost

    // Function to update the cart display and total cost
    function updateCart() {
        cartItemsDiv.innerHTML = ""; // Clear current cart display
        totalCost = 0; // Reset total cost

        // Loop through each item in the cart and display them
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="50" height="50">
                <h3>${item.name}</h3>
                <h4>$${item.price.toFixed(2)}</h4>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
            totalCost += item.price; // Add item price to total cost
        });

        totalPriceDiv.innerText = `Total: $${totalCost.toFixed(2)}`;
        
        // Show or hide the payment button based on cart items
        paymentButton.style.display = cart.length > 0 ? 'block' : 'none';
    }

    // Event listener for adding items to the cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const image = this.dataset.image;

            // Add item to cart
            cart.push({ name, price, image });
            updateCart(); // Update cart display
            showPopupMessage("Item added to cart!");
        });
    });

    // Event listener for removing items from the cart
    cartItemsDiv.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-from-cart')) {
            const index = event.target.dataset.index;
            // Reduce the total cost by the price of the removed item
            totalCost -= cart[index].price; 
            cart.splice(index, 1); // Remove item from cart
            updateCart(); // Update cart display
            totalPriceDiv.innerText = `Total: $${totalCost.toFixed(2)}`; // Update total price display
        }
    });
    

    // Event listener for payment button
    paymentButton.addEventListener('click', function () {
        paymentMessage.style.display = 'block'; // Show payment success message
        setTimeout(() => {
            paymentMessage.style.display = 'none'; // Hide message after 3 seconds
            cart = []; // Clear cart after payment
            totalCost = 0; // Reset total cost
            updateCart(); // Update cart display
        }, 3000);
    });

    // Function to show a popup message
    function showPopupMessage(message) {
        const popup = document.getElementById('popup-message');
        popup.innerText = message;
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000);
    }
});


let totalCost = 0; // Initialize total cost globally


// Function to add item to cart
function addToCart(name, price, image, customization = {}) {
    const item = { name, price, image, customization };
    cart.push(item);
    totalCost += parseFloat(price); // Add item price to total cost
    updateCart(); // Update cart after adding item
}

// Function to remove item from the cart
function removeFromCart(index) {
    totalCost -= parseFloat(cart[index].price); // Subtract the item price from total cost
    cart.splice(index, 1); // Remove item from cart by index
    updateCart(); // Update cart display
}

// Function to update cart display
function updateCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    const totalPriceDiv = document.getElementById('total-price');
    cartItemsDiv.innerHTML = ""; // Clear previous items

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "No items in cart";
        totalPriceDiv.innerText = "Total: $0.00"; // Reset total price display
    } else {
        cart.forEach((item, index) => {
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" height="50" width="50">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price}</p>
                    <p>Milk: ${item.customization.milk || 'None'}, Sugar: ${item.customization.sugar || 'None'}</p>
                    <button class="remove-item" onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        });

        totalPriceDiv.innerText = `Total: $${totalCost.toFixed(2)}`; // Update total price display
    }
}

// Event listener for payment button
document.getElementById('payment-button').addEventListener('click', function () {
    const paymentMessage = document.getElementById('payment-message');
    
    if (cart.length > 0) {
        paymentMessage.style.display = 'block'; // Show payment success message
        setTimeout(() => {
            paymentMessage.style.display = 'none'; // Hide message after 3 seconds
            cart = []; // Clear cart after payment
            totalCost = 0; // Reset total cost
            updateCart(); // Update cart display
        }, 3000);
    }
});

document.getElementById("payment-button").addEventListener("click", function() {
    alert("Your payment is successful");
});

  

