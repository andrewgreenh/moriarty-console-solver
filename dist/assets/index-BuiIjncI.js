(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();function h(e,t){const n=document.createElement("div");for(const o of d(e)){const s=r(o);n.classList.add("grid"+s)}n.style.display="grid",n.style.gridTemplateColumns="repeat(3, 1fr)",n.style.gridTemplateRows="repeat(3, 1fr)",n.style.width="60px",n.style.height="60px",n.style.border="1px solid black",n.style.transition="scale 0.5s";for(let o=0;o<9;o++){if(e[o]===0)continue;const s=document.createElement("div");s.style.gridRow=`${Math.floor(o/3)+1}`,s.style.gridColumn=`${o%3+1}`,s.style.background="lightgreen",s.style.border="1px solid black",n.appendChild(s)}const i=t[0];if(i!==void 0){const o=document.createElement("div");o.style.gridRow=`${Math.floor(i/3)+1}`,o.style.gridColumn=`${i%3+1}`,e[i]===1&&(o.style.color="black"),n.appendChild(o),o.appendChild(document.createTextNode(t.length+""));const s=p(e,i),l=r(s);n.addEventListener("click",()=>{const a=document.querySelector(".grid"+l);a.style.scale="2",a==null||a.scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(()=>{a.style.scale="1"},1500)})}return n}function c(e){return[6,3,0,7,4,1,8,5,2].map(n=>e[n])}function m(e){return[2,1,0,5,4,3,8,7,6].map(n=>e[n])}function r(e){return e.join("")}function*y(e=9){if(e===0){yield[];return}for(const t of y(e-1))yield[0,...t],yield[1,...t]}function*d(e){const t=new Set;t.add(r(e)),yield e,e=c(e),t.has(r(e))||(t.add(r(e)),yield e),e=c(e),t.has(r(e))||(t.add(r(e)),yield e),e=c(e),t.has(r(e))||(t.add(r(e)),yield e),e=m(c(e)),t.has(r(e))||(t.add(r(e)),yield e),e=c(e),t.has(r(e))||(t.add(r(e)),yield e),e=c(e),t.has(r(e))||(t.add(r(e)),yield e),e=c(e),t.has(r(e))||(t.add(r(e)),yield e)}function*w(){const e=new Set;for(const t of y()){const n=r(t);if(!e.has(n)){for(const i of d(t))e.add(r(i));yield t}}}const v=[[1,1,0,1,0,0,0,0,0],[1,1,1,0,1,0,0,0,0],[0,1,1,0,0,1,0,0,0],[1,0,0,1,1,0,1,0,0],[0,1,0,1,1,1,0,1,0],[0,0,1,0,1,1,0,0,1],[0,0,0,1,0,0,1,1,0],[0,0,0,0,1,0,1,1,1],[0,0,0,0,0,1,0,1,1]];function p(e,t){const n=v[t];if(!n)throw new Error("Invalid move index: "+t);return e.map((i,o)=>n[o]===1?C(i):i)}const x=Array.from(w()),f=document.querySelector("#app");f.style.display="flex";f.style.flexWrap="wrap";f.style.gap="20px";const u=[1,1,1,1,1,1,1,1,1].join("");function b(e){if(r(e)===u)return[];const t=[{grid:e,history:[]}],n=new Set;for(const o of d(e))n.add(r(o));let i;for(;i=t.shift();)for(let o=0;o<9;o++){const s={grid:p(i.grid,o),history:[...i.history,o]};if(r(s.grid)===u)return s.history;if(!n.has(r(s.grid))){t.push(s);for(const l of d(s.grid))n.add(r(l));if(t.length>100)throw new Error("too much to explore")}}throw new Error("Could not solve :(")}for(const e of x){const t=b(e);f.appendChild(h(e,t))}function C(e){return 1-e}
