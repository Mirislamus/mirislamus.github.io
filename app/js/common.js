
var link = document.querySelector(".log_in");
var popup = document.querySelector(".modal-login");
var close = document.querySelector(".modal-close");
link.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.add("modal-show");

});

