
var link = document.querySelector(".log_in");
var popup = document.querySelector(".modal-login");
var close = document.querySelector(".modal-close");
var login = popup.querySelector("[name=login]");
var password = popup.querySelector("[name=password]");
var form = popup.querySelector("form");
var storage = localStorage.getItem("login");
var isStorageSupport = true;
var storage = "";
try {
    storage = localStorage.getItem("login");
} catch (err) {
    isStorageSupport = false;
}
link.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.add("modal-show");
    login.focus();
    if (storage) {
        login.value = storage;
        password.focus();
    }  else {
        login.focus();
    }
});
close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-show");
});
form.addEventListener("submit", function (evt) {
    if (!login.value || !password.value) {
        evt.preventDefault();
        console.log("Нужно ввести логин и пароль");
    } else {
        localStorage.setItem("login", login.value);

    }
});
window.addEventListener("keydown", function (evt) {
    evt.preventDefault();
    if (evt.keyCode === 27) {
    }
});



