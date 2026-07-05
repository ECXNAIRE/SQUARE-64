const popup = document.getElementById("guestPopup");

const guestBtn = document.getElementById("guestLoginBtn");
const cancelBtn = document.getElementById("cancelBtn");
const continueBtn = document.getElementById("continueBtn");

guestBtn.addEventListener("click", () => {
    popup.classList.add("show");
});

cancelBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});

continueBtn.addEventListener("click", () => {
    window.location.href = "/menu";
});

popup.addEventListener ("click", (event) => {
    if (event.target === popup) {
        popup.classList.remove("show");
    }
})