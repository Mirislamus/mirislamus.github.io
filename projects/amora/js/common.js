(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".header__menu"),t=document.querySelector(".header__nav"),c=document.querySelector(".page__body");e.addEventListener("click",(()=>{e.classList.toggle("active"),c.classList.toggle("active"),t.classList.toggle("active")}));const o=document.querySelectorAll(".feedback__video"),s=document.querySelectorAll(".feedback__video video"),l=document.querySelectorAll(".feedback__video .play-pause");o.forEach((e=>{const t=e.querySelector(".video"),c=e.querySelector(".play-pause");e.addEventListener("click",(()=>{if(t.paused||t.ended){for(let e of s)e.pause();for(let e of l)e.classList.remove("is-active");t.play(),c.classList.add("is-active")}else t.pause(),c.classList.remove("is-active")}))})),document.querySelectorAll(".open-description").forEach((e=>{e.addEventListener("click",(()=>{const t=e.closest(".ritual__element-info").querySelector(".element__description");e.classList.toggle("active"),t.classList.toggle("active")}))}))}))})();