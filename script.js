/* =========================================================
   URBANWEAR
   COMPLETE CART + DEMO CHECKOUT JAVASCRIPT
   CURRENCY: INDIAN RUPEE (₹)
========================================================= */


/* =========================================================
   1. MOBILE MENU
========================================================= */

const bar = document.getElementById("bar");
const navbar = document.getElementById("navbar");

if (bar && navbar) {

    bar.addEventListener("click", function () {

        navbar.classList.toggle("show");

        if (navbar.classList.contains("show")) {

            bar.classList.remove("fa-bars");
            bar.classList.add("fa-xmark");

        } else {

            bar.classList.remove("fa-xmark");
            bar.classList.add("fa-bars");

        }

    });

}


/* =========================================================
   2. CART
========================================================= */

let cart = JSON.parse(
    localStorage.getItem("urbanwear-cart")
) || [];


/* =========================================================
   3. CURRENCY FORMATTER
========================================================= */

function formatPrice(amount) {

    return "₹" + Number(amount || 0).toFixed(2);

}


/* =========================================================
   4. SIZE OPTIONS
========================================================= */

const sizeOptions = {

    clothing: [
        "S",
        "M",
        "L",
        "XL"
    ],

    shoes: [
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
    ],

    none: []

};


/* =========================================================
   5. PRODUCT SIZE TYPE
========================================================= */

function getSizeType(productName) {

    const name =
        String(productName || "").toLowerCase();


    if (
        name.includes("shoe") ||
        name.includes("sneaker") ||
        name.includes("trainer") ||
        name.includes("boot") ||
        name.includes("footwear")
    ) {

        return "shoes";

    }


    if (
        name.includes("bag") ||
        name.includes("backpack") ||
        name.includes("purse") ||
        name.includes("wallet") ||
        name.includes("belt") ||
        name.includes("cap") ||
        name.includes("hat") ||
        name.includes("watch")
    ) {

        return "none";

    }


    return "clothing";

}


/* =========================================================
   6. DEFAULT SIZE
========================================================= */

function getDefaultSize(sizeType) {

    if (sizeType === "shoes") {

        return "8";

    }

    if (sizeType === "clothing") {

        return "M";

    }

    return "";

}


/* =========================================================
   7. GET CART IMAGE
========================================================= */

function getCartImage(image) {

    if (!image) {

        return "";

    }

    image =
        String(image).trim();


    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
    ) {

        return image;

    }


    image =
        image.replace(/^\.\/+/, "");


    return image;

}


/* =========================================================
   8. IMAGE ERROR
========================================================= */

function imageError(imageElement) {

    if (!imageElement) {

        return;

    }

    imageElement.onerror = null;

    imageElement.src =
        "images/no-image.jpg";

}


/* =========================================================
   9. ADD TO CART
========================================================= */

function addToCart(
    name,
    price,
    image,
    quantity = 1,
    size = null
) {

    const sizeType =
        getSizeType(name);


    const productImage =
        getCartImage(image);


    quantity =
        Number(quantity);


    if (
        isNaN(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    if (sizeType === "none") {

        size = "";

    }


    if (
        sizeType !== "none" &&
        !size
    ) {

        size =
            getDefaultSize(sizeType);

    }


    const existingProduct =
        cart.find(function (item) {

            return (

                item.name === name &&

                String(item.size || "") ===
                String(size || "")

            );

        });


    if (existingProduct) {

        existingProduct.quantity +=
            quantity;


        if (productImage) {

            existingProduct.image =
                productImage;

        }

    }

    else {

        cart.push({

            name: name,

            price: Number(price) || 0,

            image: productImage,

            quantity: quantity,

            size: size,

            sizeType: sizeType

        });

    }


    saveCart();

    updateCartCount();


    alert(

        name +

        (
            size
                ? " - Size " + size
                : ""
        ) +

        " added to cart!"

    );

}


/* =========================================================
   10. SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "urbanwear-cart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   11. UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {

        return;

    }


    let totalItems = 0;


    cart.forEach(function (item) {

        totalItems +=
            Number(item.quantity) || 0;

    });


    cartCount.textContent =
        totalItems;

}


/* =========================================================
   12. CREATE SIZE SELECTOR
========================================================= */

function createSizeSelector(
    item,
    index
) {

    const sizeType =
        item.sizeType ||
        getSizeType(item.name);


    if (sizeType === "none") {

        return `

            <div class="no-size">

                <i class="fa-solid fa-check"></i>

                No Size Required

            </div>

        `;

    }


    const sizes =
        sizeOptions[sizeType] || [];


    let options = "";


    sizes.forEach(function (size) {

        options += `

            <option
                value="${size}"
                ${
                    String(item.size) ===
                    String(size)
                        ? "selected"
                        : ""
                }
            >

                ${size}

            </option>

        `;

    });


    return `

        <div class="cart-size">

            <label>

                <i class="fa-solid fa-ruler"></i>

                Size:

            </label>


            <select

                onchange="
                    changeSize(
                        ${index},
                        this.value
                    )
                "

                class="${
                    sizeType === "shoes"
                        ? "shoe-size"
                        : "clothing-size"
                }"

            >

                ${options}

            </select>

        </div>

    `;

}


/* =========================================================
   13. LOAD CART
========================================================= */

function loadCart() {

    const container =
        document.getElementById(
            "cart-items"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">

                    <i class="
                        fa-solid
                        fa-cart-shopping
                    "></i>

                </div>


                <h2>
                    Your cart is empty
                </h2>


                <p>
                    You haven't added
                    any products yet.
                </p>


                <br>


                <a
                    href="shop.html"
                    class="primary-btn"
                >

                    Start Shopping

                </a>

            </div>

        `;


        updateCartTotals();

        updateCheckoutSummary();

        return;

    }


    cart.forEach(function (item, index) {


        if (!item.sizeType) {

            item.sizeType =
                getSizeType(
                    item.name
                );

        }


        item.image =
            getCartImage(
                item.image
            );


        if (
            item.sizeType === "none"
        ) {

            item.size = "";

        }


        if (
            item.sizeType !== "none" &&
            !item.size
        ) {

            item.size =
                getDefaultSize(
                    item.sizeType
                );

        }


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        const productImage =
            item.image;


        cartItem.innerHTML = `

            <div class="cart-image-box">

                <img

                    class="cart-product-image"

                    src="${productImage}"

                    alt="${item.name}"

                    onerror="
                        imageError(this)
                    "

                >

            </div>


            <div class="cart-product-info">

                <h4>
                    ${item.name}
                </h4>


                <p class="cart-price">

                    ${formatPrice(item.price)}

                </p>


                ${createSizeSelector(
                    item,
                    index
                )}

            </div>


            <div class="cart-quantity">

                <label>
                    Qty
                </label>


                <input

                    type="number"

                    min="1"

                    value="${item.quantity}"

                    onchange="
                        changeQuantity(
                            ${index},
                            this.value
                        )
                    "

                >

            </div>


            <button

                class="remove-btn"

                onclick="
                    removeFromCart(
                        ${index}
                    )
                "

                title="Remove product"

            >

                <i class="
                    fa-solid
                    fa-trash
                "></i>

            </button>

        `;


        container.appendChild(
            cartItem
        );

    });


    saveCart();

    updateCartTotals();

    updateCheckoutSummary();

}


/* =========================================================
   14. CHANGE SIZE
========================================================= */

function changeSize(
    index,
    newSize
) {

    const item =
        cart[index];


    if (!item) {

        return;

    }


    const sizeType =
        item.sizeType ||
        getSizeType(
            item.name
        );


    if (sizeType === "none") {

        item.size = "";

        saveCart();

        return;

    }


    const validSizes =
        sizeOptions[sizeType];


    if (
        !validSizes.includes(
            String(newSize)
        )
    ) {

        alert(
            "Invalid size selected."
        );

        loadCart();

        return;

    }


    const duplicateIndex =
        cart.findIndex(
            function (
                product,
                productIndex
            ) {

                return (

                    productIndex !== index &&

                    product.name ===
                        item.name &&

                    String(
                        product.size
                    ) ===
                    String(newSize)

                );

            }
        );


    if (
        duplicateIndex !== -1
    ) {

        cart[
            duplicateIndex
        ].quantity +=
            Number(item.quantity);


        cart.splice(
            index,
            1
        );

    }

    else {

        item.size =
            String(newSize);

    }


    saveCart();

    loadCart();

    updateCartCount();

}


/* =========================================================
   15. CHANGE QUANTITY
========================================================= */

function changeQuantity(
    index,
    quantity
) {

    if (!cart[index]) {

        return;

    }


    quantity =
        Number(quantity);


    if (
        isNaN(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    cart[index].quantity =
        quantity;


    saveCart();

    loadCart();

    updateCartCount();

}


/* =========================================================
   16. REMOVE FROM CART
========================================================= */

function removeFromCart(
    index
) {

    if (!cart[index]) {

        return;

    }


    const product =
        cart[index];


    const answer =
        confirm(

            "Remove " +
            product.name +

            (
                product.size
                    ? " - Size " +
                      product.size
                    : ""
            ) +

            " from cart?"

        );


    if (!answer) {

        return;

    }


    cart.splice(
        index,
        1
    );


    saveCart();

    loadCart();

    updateCartCount();

}


/* =========================================================
   17. CALCULATE SUBTOTAL
========================================================= */

function calculateSubtotal() {

    let subtotal = 0;


    cart.forEach(function (item) {

        subtotal +=

            Number(item.price || 0) *

            Number(item.quantity || 0);

    });


    return subtotal;

}


/* =========================================================
   18. CART TOTALS
========================================================= */

function updateCartTotals() {

    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (
        !subtotalElement ||
        !totalElement
    ) {

        return;

    }


    const subtotal =
        calculateSubtotal();


    subtotalElement.textContent =
        formatPrice(subtotal);


    totalElement.textContent =
        formatPrice(subtotal);

}


/* =========================================================
   19. PRODUCT PAGE ADD TO CART
========================================================= */

function addProductFromPage() {

    const nameElement =
        document.getElementById(
            "product-name"
        );


    const priceElement =
        document.getElementById(
            "product-price"
        );


    const imageElement =
        document.getElementById(
            "product-image"
        );


    const sizeElement =
        document.getElementById(
            "size"
        );


    const quantityElement =
        document.getElementById(
            "product-quantity"
        );


    const name =
        nameElement
            ? nameElement.textContent.trim()
            : "Product";


    const price =
        priceElement
            ? parseFloat(
                priceElement.textContent
                    .replace("₹", "")
                    .replace(",", "")
            )
            : 0;


    const image =
        imageElement
            ? imageElement.src
            : "";


    const sizeType =
        getSizeType(name);


    let size = null;


    if (
        sizeType !== "none"
    ) {

        if (
            sizeElement &&
            sizeElement.value
        ) {

            size =
                sizeElement.value;

        }

        else {

            size =
                getDefaultSize(
                    sizeType
                );

        }

    }


    const quantity =
        quantityElement
            ? Number(
                quantityElement.value
            )
            : 1;


    addToCart(

        name,

        price,

        image,

        quantity,

        size

    );

}


/* =========================================================
   20. DIRECT PRODUCT ADD
========================================================= */

function addProduct(
    name,
    price,
    image,
    quantity = 1,
    size = null
) {

    addToCart(
        name,
        price,
        image,
        quantity,
        size
    );

}


/* =========================================================
   21. SCROLL TO CHECKOUT
========================================================= */

function checkout() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const paymentSection =
        document.getElementById(
            "payment-section"
        );


    if (paymentSection) {

        paymentSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


/* =========================================================
   22. CHECKOUT PRODUCT SUMMARY
========================================================= */

function updateCheckoutSummary() {

    const productsContainer =
        document.getElementById(
            "checkout-products"
        );


    const subtotalElement =
        document.getElementById(
            "checkout-subtotal"
        );


    const totalElement =
        document.getElementById(
            "checkout-total"
        );


    const itemCountElement =
        document.getElementById(
            "checkout-item-count"
        );


    if (
        !productsContainer ||
        !subtotalElement ||
        !totalElement
    ) {

        return;

    }


    productsContainer.innerHTML = "";


    let totalQuantity = 0;


    cart.forEach(function (item) {

        const quantity =
            Number(item.quantity) || 0;


        totalQuantity +=
            quantity;


        const productTotal =
            Number(item.price || 0) *
            quantity;


        const product =
            document.createElement("div");


        product.className =
            "checkout-product";


        product.innerHTML = `

            <div class="checkout-product-image">

                <img
                    src="${getCartImage(item.image)}"
                    alt="${item.name}"
                    onerror="imageError(this)"
                >

                <span class="checkout-product-qty">
                    ${quantity}
                </span>

            </div>


            <div class="checkout-product-info">

                <strong>
                    ${item.name}
                </strong>

                ${
                    item.size
                        ? `<small>Size: ${item.size}</small>`
                        : ""
                }

            </div>


            <strong class="checkout-product-price">

                ${formatPrice(productTotal)}

            </strong>

        `;


        productsContainer.appendChild(
            product
        );

    });


    const subtotal =
        calculateSubtotal();


    subtotalElement.textContent =
        formatPrice(subtotal);


    totalElement.textContent =
        formatPrice(subtotal);


    if (itemCountElement) {

        itemCountElement.textContent =

            totalQuantity === 1

                ? "1 item"

                : totalQuantity + " items";

    }

}


/* =========================================================
   23. PAYMENT METHOD SWITCHER
========================================================= */

function showPaymentForm(method) {

    const cardForm =
        document.getElementById(
            "card-form"
        );


    const upiForm =
        document.getElementById(
            "upi-form"
        );


    const codForm =
        document.getElementById(
            "cod-form"
        );


    if (cardForm) {

        cardForm.style.display =
            method === "card"
                ? "block"
                : "none";

    }


    if (upiForm) {

        upiForm.style.display =
            method === "upi"
                ? "block"
                : "none";

    }


    if (codForm) {

        codForm.style.display =
            method === "cod"
                ? "block"
                : "none";

    }


    const paymentMethods =
        document.querySelectorAll(
            ".payment-method"
        );


    paymentMethods.forEach(
        function (paymentMethod) {

            const radio =
                paymentMethod.querySelector(
                    'input[type="radio"]'
                );


            if (
                radio &&
                radio.value === method
            ) {

                paymentMethod.classList.add(
                    "active"
                );

            }

            else {

                paymentMethod.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   24. DELIVERY VALIDATION
========================================================= */

function validateDeliveryInformation() {

    const fields = [

        {
            id: "customer-name",
            name: "Full Name"
        },

        {
            id: "customer-phone",
            name: "Phone Number"
        },

        {
            id: "customer-email",
            name: "Email Address"
        },

        {
            id: "customer-address",
            name: "Address"
        },

        {
            id: "customer-city",
            name: "City"
        },

        {
            id: "customer-state",
            name: "State"
        },

        {
            id: "customer-pincode",
            name: "PIN Code"
        },

        {
            id: "customer-country",
            name: "Country"
        }

    ];


    for (
        let i = 0;
        i < fields.length;
        i++
    ) {

        const element =
            document.getElementById(
                fields[i].id
            );


        if (
            !element ||
            !element.value.trim()
        ) {

            alert(
                "Please enter your " +
                fields[i].name +
                "."
            );


            if (element) {

                element.focus();

            }


            return false;

        }

    }


    const email =
        document.getElementById(
            "customer-email"
        );


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        email &&
        !emailPattern.test(
            email.value.trim()
        )
    ) {

        alert(
            "Please enter a valid email address."
        );

        email.focus();

        return false;

    }


    const phone =
        document.getElementById(
            "customer-phone"
        );


    const phoneDigits =
        phone
            ? phone.value.replace(/\D/g, "")
            : "";


    if (
        phoneDigits.length < 10
    ) {

        alert(
            "Please enter a valid phone number."
        );

        if (phone) {

            phone.focus();

        }

        return false;

    }


    const pincode =
        document.getElementById(
            "customer-pincode"
        );


    if (
        pincode &&
        !/^\d{6}$/.test(
            pincode.value.trim()
        )
    ) {

        alert(
            "Please enter a valid 6-digit PIN Code."
        );

        pincode.focus();

        return false;

    }


    return true;

}


/* =========================================================
   25. CARD VALIDATION - DEMO
========================================================= */

function validateCardPayment() {

    const cardName =
        document.getElementById(
            "card-name"
        );


    const cardNumber =
        document.getElementById(
            "card-number"
        );


    const expiry =
        document.getElementById(
            "expiry"
        );


    const cvv =
        document.getElementById(
            "cvv"
        );


    if (
        !cardName ||
        !cardName.value.trim()
    ) {

        alert(
            "Please enter the cardholder name."
        );

        if (cardName) {

            cardName.focus();

        }

        return false;

    }


    if (
        !cardNumber ||
        !cardNumber.value.trim()
    ) {

        alert(
            "Please enter a card number."
        );

        if (cardNumber) {

            cardNumber.focus();

        }

        return false;

    }


    const cardDigits =
        cardNumber.value.replace(
            /\D/g,
            ""
        );


    if (
        cardDigits.length < 13 ||
        cardDigits.length > 19
    ) {

        alert(
            "Please enter a valid demo card number."
        );

        cardNumber.focus();

        return false;

    }


    if (
        !expiry ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
            expiry.value.trim()
        )
    ) {

        alert(
            "Please enter expiry in MM/YY format."
        );

        if (expiry) {

            expiry.focus();

        }

        return false;

    }


    if (
        !cvv ||
        !/^\d{3,4}$/.test(
            cvv.value.trim()
        )
    ) {

        alert(
            "Please enter a valid 3 or 4 digit CVV."
        );

        if (cvv) {

            cvv.focus();

        }

        return false;

    }


    return true;

}


/* =========================================================
   26. UPI VALIDATION - DEMO
========================================================= */

function validateUPIPayment() {

    const upi =
        document.getElementById(
            "upi-id"
        );


    if (
        !upi ||
        !upi.value.trim()
    ) {

        alert(
            "Please enter your UPI ID."
        );

        if (upi) {

            upi.focus();

        }

        return false;

    }


    const upiPattern =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;


    if (
        !upiPattern.test(
            upi.value.trim()
        )
    ) {

        alert(
            "Please enter a valid demo UPI ID.\nExample: example@upi"
        );

        upi.focus();

        return false;

    }


    return true;

}


/* =========================================================
   27. GET SELECTED PAYMENT METHOD
========================================================= */

function getSelectedPaymentMethod() {

    const selected =
        document.querySelector(
            'input[name="payment-method"]:checked'
        );


    return selected
        ? selected.value
        : "card";

}


/* =========================================================
   28. PAYMENT METHOD NAME
========================================================= */

function getPaymentMethodName(method) {

    if (method === "card") {

        return "Credit / Debit Card";

    }


    if (method === "upi") {

        return "UPI";

    }


    if (method === "cod") {

        return "Cash on Delivery";

    }


    return method;

}


/* =========================================================
   29. GENERATE DEMO ORDER NUMBER
========================================================= */

function generateOrderNumber() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "UW-" + randomNumber;

}


/* =========================================================
   30. MAKE PAYMENT - DEMO ONLY
========================================================= */

function makePayment() {

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    if (
        !validateDeliveryInformation()
    ) {

        return;

    }


    const paymentMethod =
        getSelectedPaymentMethod();


    if (
        paymentMethod === "card"
    ) {

        if (
            !validateCardPayment()
        ) {

            return;

        }

    }


    if (
        paymentMethod === "upi"
    ) {

        if (
            !validateUPIPayment()
        ) {

            return;

        }

    }


    const total =
        calculateSubtotal();


    const orderNumber =
        generateOrderNumber();


    const customerName =
        document.getElementById(
            "customer-name"
        ).value.trim();


    const paymentName =
        getPaymentMethodName(
            paymentMethod
        );


    const successMessage =

        "ORDER PLACED SUCCESSFULLY!\n\n" +

        "Order Number: " +
        orderNumber +

        "\n\nCustomer: " +
        customerName +

        "\nPayment: " +
        paymentName +

        "\nTotal: " +
        formatPrice(total) +

        "\n\n" +

        "This is a DEMO checkout.\n" +

        "No real payment has been processed.";


    alert(
        successMessage
    );


    cart = [];


    saveCart();

    updateCartCount();

    loadCart();


    resetCheckoutForm();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   31. RESET CHECKOUT FORM
========================================================= */

function resetCheckoutForm() {

    const formIds = [

        "customer-name",
        "customer-phone",
        "customer-email",
        "customer-address",
        "customer-city",
        "customer-state",
        "customer-pincode",

        "card-name",
        "card-number",
        "expiry",
        "cvv",

        "upi-id"

    ];


    formIds.forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (element) {

                element.value = "";

            }

        }
    );


    const country =
        document.getElementById(
            "customer-country"
        );


    if (country) {

        country.value =
            "India";

    }


    const cardRadio =
        document.querySelector(
            'input[name="payment-method"][value="card"]'
        );


    if (cardRadio) {

        cardRadio.checked = true;

    }


    showPaymentForm("card");

}


/* =========================================================
   32. FORMAT CARD NUMBER
========================================================= */

const cardNumberInput =
    document.getElementById(
        "card-number"
    );


if (cardNumberInput) {

    cardNumberInput.addEventListener(
        "input",
        function () {

            let value =
                this.value.replace(
                    /\D/g,
                    ""
                );


            value =
                value.substring(
                    0,
                    19
                );


            let formatted = "";


            for (
                let i = 0;
                i < value.length;
                i++
            ) {

                if (
                    i > 0 &&
                    i % 4 === 0
                ) {

                    formatted += " ";

                }


                formatted +=
                    value[i];

            }


            this.value =
                formatted;

        }
    );

}


/* =========================================================
   33. FORMAT EXPIRY DATE
========================================================= */

const expiryInput =
    document.getElementById(
        "expiry"
    );


if (expiryInput) {

    expiryInput.addEventListener(
        "input",
        function () {

            let value =
                this.value.replace(
                    /\D/g,
                    ""
                );


            value =
                value.substring(
                    0,
                    4
                );


            if (
                value.length >= 3
            ) {

                value =
                    value.substring(0, 2) +
                    "/" +
                    value.substring(2);

            }


            this.value =
                value;

        }
    );

}


/* =========================================================
   34. CVV ONLY NUMBERS
========================================================= */

const cvvInput =
    document.getElementById(
        "cvv"
    );


if (cvvInput) {

    cvvInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .substring(
                        0,
                        4
                    );

        }
    );

}


/* =========================================================
   35. PIN CODE ONLY NUMBERS
========================================================= */

const pincodeInput =
    document.getElementById(
        "customer-pincode"
    );


if (pincodeInput) {

    pincodeInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .substring(
                        0,
                        6
                    );

        }
    );

}


/* =========================================================
   36. INITIALIZE WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadCart();

        updateCheckoutSummary();


        /*
            Default payment method
        */

        showPaymentForm("card");

    }
);
