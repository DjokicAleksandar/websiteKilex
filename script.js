window.addEventListener("DOMContentLoaded", function(){
    var navbar = document.querySelector(".navbar").offsetHeight;
    document.querySelector(".imageContainer").style.marginTop = navbar + "px";
})

window.addEventListener("load", function(){
    document.querySelector(".velikaSlika").style.right = "0";
})

//-------

//--------------------



//------------------

const emptyCart = document.querySelector(".emptyCart");

const cartBtn = document.querySelector(".icoCart");
const popUp = document.querySelector(".popUpCart");
const cartContent = document.querySelector(".cartContent");
const closeIcon = document.querySelector(".closeIcon");

//prikazi
cartBtn.addEventListener("click", () => {
    popUp.classList.add("show");
    popUp.classList.remove("hide");
})

//sakrij
closeIcon.addEventListener("click", () => {
    popUp.classList.add("hide");
    popUp.classList.remove("show");
})

popUp.addEventListener("click", (e) => {
    popUp.classList.add("hide")
    popUp.classList.remove("show");
})

cartContent.addEventListener("click", (e) => {
    e.stopPropagation();
})

//----------
//proizvodi

//button for cart page
let openCartPageBtn = document.querySelector('.openCartPageBtn');
openCartPageBtn.disabled = true;
//-----

let listProductHTML = document.querySelector(".items");
let listCartHTML = document.querySelector(".listCart");
let iconCartNumber = document.querySelector(".cartNumber");
let totalPrice = document.querySelector("#totalPrice");
let listProduct = [];
let carts = [];

//svi proizvodi
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProduct.length > 0)
    {
        listProduct.forEach(product => {
            let newProduct = document.createElement('li');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `<a href="#" class="itemLink">
                        <img src="${product.image}" class="itemImage" draggable="false">
                    </a>
                    <p class="itemBadge"> ${product.badge} </p>
                    <h2 class="itemName"> ${product.name} </h2>
                    <h3 class="itemPrice"> ${product.price} RSD </h3>
                    <button class="addToCartButton"> DODAJ U KORPU </button>`;
                    
            listProductHTML.appendChild(newProduct)
        })
    }
}
//--
//add to cart
const addToCart = (productId) => {
    let positionThisProductInCart = carts.findIndex((value) => value.productId == productId);
    if (carts.length <= 0)
    {
        carts = [{
            productId: productId,
            quantity: 1
        }]
    }
    else if (positionThisProductInCart < 0)
    {
        carts.push({
           productId: productId,
           quantity: 1 
        })
    }
    else
    {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
}

const addCartToMemory = () => {
    //24:55
}

let cartItemTotal = document.querySelector(".cartItemTotal");
let cartIsEmpty = true;

const emptyCartPrice = document.querySelector(".price");

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPriceValue = 0;

    if (carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('cartItem');
            newCart.dataset.id = cart.productId;

            let positionProduct = listProduct.findIndex((value) => value.id == cart.productId);
            let info = listProduct[positionProduct];

            let itemTotalPrice = info.price*cart.quantity;
            totalPriceValue += itemTotalPrice;

            let formattedPrice = itemTotalPrice.toLocaleString('de-DE', {minimumFractionDigits: 0});

            newCart.innerHTML = `<div class="cartItemImage">
                            <img src="${info.image}" height="50px"> 
                        </div>
                        <div class="cartItemName">
                            ${info.name}
                        </div>
                        <div class="cartItemTotal">
                            ${formattedPrice} RSD
                        </div>
                        <div class="quantity">
                            <div class="minus"> - </div>
                            <div class="quantityNumber"> ${cart.quantity} </div>
                            <div class="plus"> + </div>
                        </div>`;
                
            listCartHTML.appendChild(newCart);
        })
        emptyCart.style.display = 'none'; //cart is empty text
        emptyCartPrice.classList.add("showPrice");
        emptyCartPrice.classList.remove("hidePrice");
        cartIsEmpty = false;//////////////
    }
    else{
        emptyCart.style.display = 'block'; //cart is empty text
        emptyCartPrice.classList.add("hidePrice");
        emptyCartPrice.classList.remove("showPrice");
        cartIsEmpty = true;///////////////
    }
    iconCartNumber.innerText = totalQuantity;

    let formattedTotalPrice = totalPriceValue.toLocaleString('de-DE', {minimumFractionDigits: 0});
    totalPrice.innerText = `${formattedTotalPrice} RSD`;

    //disable button for cart page
    if (cartIsEmpty)
        openCartPageBtn.disabled = true;
    else
    {
        openCartPageBtn.disabled = false;

        openCartPageBtn.addEventListener('click', () => {
            localStorage.setItem("selectedProducts", JSON.stringify(carts)); //local storage
            localStorage.setItem("allProducts", JSON.stringify(listProduct));
            window.location.href = "cart.html"; 
        })
    }
    //----
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus'))
    {
        let productId = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')){
            type = 'plus';
        }

        changeQuantity(productId, type);
    }
})

const changeQuantity = (productId, type) => {
    let positionItemInCart = carts.findIndex((value) => value.productId == productId);
    if (positionItemInCart >= 0)
    {
        switch(type){
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;

            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }
                else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    //addCartToMemory
    addCartToHTML();
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addToCartButton')){
        let productId = positionClick.parentElement.dataset.id;
        addToCart(productId);
    }
})

//data from json
const initApp = () => {
    fetch("products.json")
    .then(response => response.json())
    .then(data => {
        listProduct = data;
        addDataToHTML();
    })
}
initApp();

//-------------
//menu icon

const icoMenu = document.querySelector(".icoMenu");

icoMenu.addEventListener("click", function(){
    window.location.href = "main.html";
})

//------------
//animacije za scroll

document.addEventListener("scroll", function(){
    let itemsForAnimation = document.querySelectorAll(".item");

    itemsForAnimation.forEach(items => {
        const box = items.getBoundingClientRect();

        if (box.top <= window.innerHeight && box.bottom >= 0){
            items.classList.add("visible");
        }
        else{
            items.classList.remove("visible");
        }
    })
})

//-----------------------
//animacija za whatsapp kartu
const velikaSlika = document.querySelector(".velikaSlika");
const whatsapp = document.querySelector(".contact");

document.addEventListener("scroll", function() {
    const donjaGranica = velikaSlika.getBoundingClientRect().bottom;
    const trenutniScroll = window.scrollY;

    if (trenutniScroll > donjaGranica){
        whatsapp.classList.add("visibleContact");
    }
    else{
        whatsapp.classList.remove("visibleContact");
    }
})



const messages = ["Imate pitanja ?", "Kontaktirajte nas !"];
let currentMessage = 0;

function ChangeText(){
    currentMessage = (currentMessage + 1) % messages.length;
    whatsapp.textContent = messages[currentMessage];
}

setInterval(ChangeText, 5000);
//---------
//prikazi kad se doda u korpu

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addToCartButton')){
        popUp.classList.add("show");
        popUp.classList.remove("hide");
    }
})