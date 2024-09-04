// Cập nhật số lương trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if(inputsQuantity.length > 0) {
    console.log(inputsQuantity);
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute("product-id");
            const quantity = input.value;
            console.log(input.value);
            window.location.href = `/cart/update/${productId}/${quantity}`;
        })
    })
    
}
// End Cập nhật số lương trong giỏ hàng