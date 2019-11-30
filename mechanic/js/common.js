document.addEventListener("DOMContentLoaded", () => {
	// Tabs
	{
		const myTabs = document.querySelectorAll("ul.nav-tabs > li");
		const myTabClicks = tabClickEvent => {
 
		 myTabs.forEach(elem => {
			 elem.classList.remove("active");
		 })
 
		 let clickedTab = tabClickEvent.currentTarget;
		 clickedTab.classList.add("active");
		 tabClickEvent.preventDefault();
		 let myContentPanes = document.querySelectorAll(".tab-pane");
			 for (let item of myContentPanes) {
				 item.classList.remove("active");
			 }
		 let anchorReference = tabClickEvent.target;
		 let activePaneId = anchorReference.getAttribute("href");
		 let activePane = document.querySelector(activePaneId);
		 activePane.classList.add("active");
	 }
	 myTabs.forEach(elem => {
		 elem.addEventListener("click", myTabClicks)
	 });
	}
	// Remove Items
	{
		const orderItemCloseBtn = document.querySelectorAll('.order__item-close');
		orderItemCloseBtn.forEach(elem => {
			elem.addEventListener('click', closeOrderItem);
		});
	
		function closeOrderItem() {
			this.parentElement.remove();
		}
	
	}
	// Scroll
	{
		if(!document.querySelector('.custom-scroll') == 0) {
			let simpleBar = new SimpleBar(document.querySelector('.custom-scroll'), {
				forceVisible: 'y',
				scrollbarMinSize: 80,
				autoHide: false 
			});
			let simpleBarContent = document.querySelector('.simplebar-content');
			let simpleBarTrack = document.querySelector('.simplebar-vertical');
			if(simpleBarContent.children.length < 2) {
				simpleBarTrack.style.display = 'none';
			}
		}


	}
	// Select
	{
		var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {

    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {

  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

document.addEventListener("click", closeAllSelect);
	}

  {
    const car = document.querySelector('.car');
    if(car) {
      car.classList.add('carRace')
    }
    const settings = document.querySelector('.settings');
    if(settings) {
      setTimeout(()=>{
        settings.classList.add('scaled')
      }, 200)
    }
  }
});


