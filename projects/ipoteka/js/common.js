(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{document.querySelectorAll(".CustomSelect").forEach((function(t){const e=t.querySelector(".custom-select__trigger"),n=t.querySelector(".custom-options");e.addEventListener("click",(function(){t.classList.toggle("open")})),n.addEventListener("click",(function(e){if("INPUT"===e.target.tagName){const n=e.target.closest("label");if(n){const e=n.querySelector(".custom-option__data").innerHTML;t.querySelector(".custom-select__trigger span").innerHTML=e,t.classList.remove("open"),t.querySelectorAll(".custom-option.selected").forEach((t=>{t.classList.remove("selected")})),n.classList.add("selected")}}}))})),window.addEventListener("click",(function(t){document.querySelectorAll(".CustomSelect").forEach((function(e){e.contains(t.target)||e.classList.remove("open")}))}));{const t=document.querySelector(".lang"),e=document.querySelectorAll(".lang-btn");function n(t){const n=t.toUpperCase();e.forEach((t=>{t.getAttribute("data-lang").toUpperCase()===n?t.classList.add("current"):t.classList.remove("current")}))}function o(e){localStorage.setItem("selectedLang",e),document.documentElement.lang=e,n(e),t.classList.remove("active"),document.querySelectorAll("[data-uz], [data-en], [data-ru]").forEach((t=>{t.textContent=t.getAttribute(`data-${e}`)}))}o(localStorage.getItem("selectedLang")||"uz"),e.forEach((t=>{t.addEventListener("click",(function(){o(this.getAttribute("data-lang"))}))})),document.addEventListener("click",(function(e){t.contains(e.target)||t.classList.remove("active")}))}ymaps.ready((function(){const t=new ymaps.Map("map",{center:[41.284276,69.251673],zoom:17});t.controls.remove("fullscreenControl"),[{latitude:41.284276,longitude:69.251673,hintContent:"Shota Rustavelli filiali",balloonContent:"Yakkasaroy tumani, Usmon Nosir  koʻchasi 48-uy"},{latitude:41.320883,longitude:69.251898,hintContent:"Abay filiali",balloonContent:"Zulfiyaxonum  ko'chasi, 18-uy"},{latitude:41.306518,longitude:69.306084,hintContent:"Ashxabod filiali",balloonContent:"Yashnobod tumani, Maxtumquli Botkina 1-uy"},{latitude:41.353145,longitude:69.332647,hintContent:"Sampi filiali",balloonContent:"Yunusobod tumani, Boğishamol kòchasi 22-uy"},{latitude:41.282656,longitude:69.181021,hintContent:"Chilonzor filiali",balloonContent:"Uchtepa tumani, Lutfiy ko'chasi  23 kvartal 42-uy"}].forEach((function(e){t.geoObjects.add(new ymaps.Placemark([e.latitude,e.longitude],{hintContent:e.hintContent,balloonContent:e.balloonContent}))})),document.querySelectorAll('.custom-option input[type="radio"]').forEach((function(e){e.addEventListener("click",(function(){var e=this.value.split(",").map(Number);t.setCenter(e,17)}))}))}))}))})();