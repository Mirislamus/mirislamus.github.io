var menuToggler = document.querySelector('.hamburger');
var menu = document.querySelector('.page-header__bottom');
var toggleFunction = function() {
    menu.classList.toggle('active');
}
menuToggler.addEventListener('click', function () {
    toggleFunction();
});