/* =========================================================
   URBANWEAR
   MAIN JAVASCRIPT
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
   3. SIZE OPTIONS
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
   4. PRODUCT SIZE TYPE
========================================================= */

function getSizeType(productName) {

    const name =
        String(productName || "").toLowerCase();


    /*
        SHOES
    */

    if (
        name.includes("shoe") ||
        name.includes("sneaker") ||
        name.includes("trainer") ||
        name.includes("boot") ||
        name.includes("footwear")
    ) {

        return "shoes";

    }


    /*
        PRODUCTS WITHOUT SIZE
    */

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


    /*
        EVERYTHING ELSE
        IS CLOTHING
    */

    return "clothing";

}


/* =========================================================
   5. DEFAULT SIZE
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
   6. GET PRODUCT IMAGE
========================================================= */

/*
    IMPORTANT:

    This function does NOT change the image path.

    If your image is:

    images/shoe.jpg

    it stays:

    images/shoe.jpg

    If browser gives:

    http://127.0.0.1:5500/UrbanWear/images/shoe.jpg

    it also stays exactly the same.
*/

function getCartImage(image) {

    if (!image) {

        return "";

    }


    image =
        String(image).trim();


    /*
        Full URL
    */

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
    ) {

        return image;

    }


    /*
        Remove ./ from beginning
    */

    image =
        image.replace(/^\.\/+/, "");


    return image;

}


/* =========================================================
   7. IMAGE FALLBACK
========================================================= */

function imageError(imageElement) {

    if (!imageElement) {

        return;

    }


    /*
        Stop infinite error loop
    */

    imageElement.onerror = null;


    /*
        Change this path if your
        fallback image has another name.
    */

    imageElement.src =
        "images/no-image.jpg";

}


/* =========================================================
   8. ADD TO CART
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


    /*
        FIX IMAGE
    */

    const productImage =
        getCartImage(image);


    /*
        QUANTITY
    */

    quantity =
        Number(quantity);


    if (
        isNaN(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    /*
        PRODUCT WITHOUT SIZE
    */

    if (sizeType === "none") {

        size = "";

    }


    /*
        PRODUCT WITH SIZE
    */

    if (
        sizeType !== "none" &&
        !size
    ) {

        size =
            getDefaultSize(sizeType);

    }


    /*
        FIND EXISTING PRODUCT
    */

    const existingProduct =
        cart.find(function (item) {

            return (

                item.name === name &&

                String(item.size || "") ===
                String(size || "")

            );

        });


    /*
        PRODUCT ALREADY EXISTS
    */

    if (existingProduct) {

        existingProduct.quantity +=
            quantity;


        /*
            Update image too
        */

        if (productImage) {

            existingProduct.image =
                productImage;

        }

    }


    /*
        NEW PRODUCT
    */

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


    /*
        SAVE
    */

    saveCart();


    /*
        UPDATE CART ICON
    */

    updateCartCount();


    /*
        MESSAGE
    */

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
   9. SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "urbanwear-cart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   10. UPDATE CART COUNT
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
   11. CREATE SIZE SELECTOR
========================================================= */

function createSizeSelector(
    item,
    index
) {

    const sizeType =
        item.sizeType ||
        getSizeType(item.name);


    /*
        NO SIZE
    */

    if (sizeType === "none") {

        return `

            <div class="no-size">

                <i class="fa-solid fa-check"></i>

                No Size Required

            </div>

        `;

    }


    /*
        AVAILABLE SIZES
    */

    const sizes =
        sizeOptions[sizeType] || [];


    /*
        CREATE OPTIONS
    */

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


    /*
        RETURN SELECTOR
    */

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
   12. LOAD CART
========================================================= */

function loadCart() {

    const container =
        document.getElementById(
            "cart-items"
        );


    /*
        Not cart page
    */

    if (!container) {

        return;

    }


    container.innerHTML = "";


    /*
        EMPTY CART
    */

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

        return;

    }


    /*
        DISPLAY PRODUCTS
    */

    cart.forEach(function (item, index) {


        /*
            FIX OLD CART DATA
        */

        if (!item.sizeType) {

            item.sizeType =
                getSizeType(
                    item.name
                );

        }


        /*
            FIX IMAGE
        */

        item.image =
            getCartImage(
                item.image
            );


        /*
            FIX SIZE
        */

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


        /*
            CREATE CART ITEM
        */

        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        /*
            IMAGE
        */

        const productImage =
            item.image;


        cartItem.innerHTML = `

            <!-- PRODUCT IMAGE -->

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


            <!-- PRODUCT INFO -->

            <div class="cart-product-info">

                <h4>

                    ${item.name}

                </h4>


                <p class="cart-price">

                    $${Number(
                        item.price || 0
                    ).toFixed(2)}

                </p>


                ${createSizeSelector(
                    item,
                    index
                )}

            </div>


            <!-- QUANTITY -->

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


            <!-- REMOVE -->

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


    /*
        Save repaired cart
    */

    saveCart();


    updateCartTotals();

}


/* =========================================================
   13. CHANGE SIZE
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


    /*
        NO SIZE
    */

    if (sizeType === "none") {

        item.size = "";

        saveCart();

        return;

    }


    /*
        VALID SIZES
    */

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


    /*
        FIND DUPLICATE
    */

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


    /*
        DUPLICATE FOUND
    */

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


    /*
        CHANGE SIZE
    */

    else {

        item.size =
            String(newSize);

    }


    saveCart();

    loadCart();

    updateCartCount();

}


/* =========================================================
   14. CHANGE QUANTITY
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
   15. REMOVE FROM CART
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
   16. CART TOTALS
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


    let subtotal = 0;


    cart.forEach(function (item) {

        subtotal +=

            Number(item.price || 0) *

            Number(item.quantity || 0);

    });


    subtotalElement.textContent =
        "$" +
        subtotal.toFixed(2);


    totalElement.textContent =
        "$" +
        subtotal.toFixed(2);

}


/* =========================================================
   17. PRODUCT PAGE ADD TO CART
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


    /*
        PRODUCT NAME
    */

    const name =
        nameElement
            ? nameElement.textContent.trim()
            : "Product";


    /*
        PRICE
    */

    const price =
        priceElement
            ? parseFloat(
                priceElement.textContent
                    .replace("$", "")
                    .replace("₹", "")
                    .replace(",", "")
            )
            : 0;


    /*
        IMPORTANT IMAGE FIX

        .src gives the actual URL
        of the image currently displayed.
    */

    const image =
        imageElement
            ? imageElement.src
            : "";


    /*
        SIZE TYPE
    */

    const sizeType =
        getSizeType(name);


    let size = null;


    /*
        SIZE
    */

    if (
        sizeType !== "none"
    ) {

        if (
            sizeElement &&
            sizeElement.value
        ) {

            size =
                sizeElement.value;

        } else {

            size =
                getDefaultSize(
                    sizeType
                );

        }

    }


    /*
        QUANTITY
    */

    const quantity =
        quantityElement
            ? Number(
                quantityElement.value
            )
            : 1;


    /*
        ADD PRODUCT
    */

    addToCart(

        name,

        price,

        image,

        quantity,

        size

    );

}


/* =========================================================
   18. OPTIONAL DIRECT PRODUCT ADD
========================================================= */

/*
    You can use this function from
    shop.html product cards.

    Example:

    addProduct(
        "Classic T-Shirt",
        29.99,
        "images/tshirt.jpg"
    );
*/

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
   19. CHECKOUT
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


    let order =
        "YOUR ORDER\n\n";


    cart.forEach(function (item) {

        order +=
            item.name;


        if (item.size) {

            order +=
                " | Size: " +
                item.size;

        }


        order +=
            " | Qty: " +
            item.quantity;


        order += "\n";

    });


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    const total =
        totalElement
            ? totalElement.textContent
            : "$0.00";


    order +=
        "\nTotal: " +
        total;


    alert(

        order +

        "\n\nCheckout demo."

    );

}


/* =========================================================
   20. INITIALIZE WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadCart();

    }
);