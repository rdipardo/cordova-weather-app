"use strict";var accordionLocalStorageKey="accordion-id";function copy(a){var b=document.createElement("textarea");b.value=a,document.body.appendChild(b),b.select(),document.execCommand("copy"),document.body.removeChild(b)}function showTooltip(a){var b=document.getElementById(a);b.classList.add("show-tooltip"),setTimeout(function(){b.classList.remove("show-tooltip")},3e3)}function copyFunction(a){var b=document.getElementById(a),c=b.querySelector(".linenums");c||(c=b.querySelector("code")),copy(c.innerText),showTooltip("tooltip-".concat(a))}(function(){for(var a=document.getElementsByTagName("pre"),b=0;b<a.length;b++){var c=a[b].classList,d="pre-id-".concat(b),e="<div class=\"tooltip\" id=\"tooltip-".concat(d,"\">Copied!</div>"),f="<div class=\"code-copy-icon-container\" onclick=\"copyFunction('".concat(d,"')\">")+"<div><svg class=\"sm-icon\" alt=\"Click to copy\"><use xlink:href=\"#copy-icon\"></use></svg>"+"".concat(e,"<div></div>"),g=c&&c.length?c[c.length-1].split("-")[1]||"javascript":"",h="<div class=\"code-lang-name-container\"><div class=\"code-lang-name\">"+"".concat(g.toLocaleUpperCase(),"</div></div>");a[b].innerHTML+="<div class=\"pre-top-bar-container\">"+"".concat(h).concat(g.length?f:"","</div>"),a[b].setAttribute("id",d)}})();function setAccordionIdToLocalStorage(a){var b=JSON.parse(localStorage.getItem(accordionLocalStorageKey));b[a]=a,localStorage.setItem(accordionLocalStorageKey,JSON.stringify(b))}function removeAccordionIdFromLocalStorage(a){var b=JSON.parse(localStorage.getItem(accordionLocalStorageKey));delete b[a],localStorage.setItem(accordionLocalStorageKey,JSON.stringify(b))}function getAccordionIdsFromLocalStorage(){var a=JSON.parse(localStorage.getItem(accordionLocalStorageKey));return a||{}}function toggleAccordion(a){var b=a,c=b.classList.contains("collapsed"),d=b.querySelector("ul");if(c){var e=d.scrollHeight;d.style.height="".concat(e+20,"px"),b.classList.remove("collapsed"),setAccordionIdToLocalStorage(b.id)}else d.style.height="0px",b.classList.add("collapsed"),removeAccordionIdFromLocalStorage(b.id)}(function(){(localStorage.getItem(accordionLocalStorageKey)===undefined||null===localStorage.getItem(accordionLocalStorageKey))&&localStorage.setItem(accordionLocalStorageKey,"{}");var a=Array.prototype.slice.call(document.querySelectorAll(".accordion")),b=getAccordionIdsFromLocalStorage();a.forEach(function(a){var c=a.querySelector(".accordion-title");c.addEventListener("click",function(){return toggleAccordion(a)}),a.id in b&&toggleAccordion(a)})})();