/* 선생님 모드 잠금: 주소 끝에 ?teacher 를 붙여도, 이 기기에서 비밀번호를 한 번 맞혀야 선생님 화면이 열려요.
   맞힌 기기는 계속 기억해요(차시 목록의 '이 기기 선생님 모드 잠그기'로 지울 수 있어요).
   비밀번호는 그대로 적지 않고, 바꾼 값(SHA-256)만 적어 둬요. 비밀번호를 바꾸려면 H 값만 바꾸면 돼요.
   github.io가 아닌 주소(내 컴퓨터, claude.ai 사본)에서는 잠그지 않아요. */
(function(){
  var KEY="lp-teacher", H="be180d34dddf670bded23c372ef94f41d135935bf9ddeaca77d11c1ac53a6bf3";
  var local=!/github\.io$/.test(location.hostname);
  var asked=/teacher/.test(location.search);
  var ok=false; try{ok=localStorage.getItem(KEY)===H;}catch(e){}
  window.LP_TEACHER=local||(asked&&ok);
  window.LP_TEACHER_LOCK=function(){try{localStorage.removeItem(KEY);}catch(e){} location.replace(location.pathname);};
  if(!asked||ok||local)return;
  function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(b){return ("0"+b.toString(16)).slice(-2);}).join("");}
  function show(){
    var d=document.createElement("div");
    d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-label","선생님 모드 비밀번호");
    d.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px";
    d.innerHTML='<form style="background:#fbf7ee;color:#2f3a2c;border-radius:14px;padding:20px;max-width:320px;width:100%;display:flex;flex-direction:column;gap:10px;font-family:inherit">'
      +'<b style="font-size:1.1rem">선생님 모드</b><span style="font-size:.92rem">비밀번호를 적어 주세요.</span>'
      +'<input type="password" inputmode="numeric" autocomplete="off" style="font:inherit;font-size:1.2rem;padding:8px 10px;border-radius:8px;border:1.5px solid #d8ceb6">'
      +'<span class="m" style="font-size:.88rem;color:#b23a48;min-height:1.2em"></span>'
      +'<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="c" style="font:inherit;padding:8px 14px;border-radius:8px;border:1px solid #d8ceb6;background:#fff;color:#2f3a2c">학생 화면으로</button>'
      +'<button type="submit" style="font:inherit;padding:8px 14px;border-radius:8px;border:none;background:#2d5d7b;color:#fff">확인</button></div></form>';
    document.body.appendChild(d);
    var f=d.querySelector("form"),i=d.querySelector("input"),m=d.querySelector(".m");
    i.focus();
    d.querySelector(".c").onclick=function(){location.replace(location.pathname);};
    f.onsubmit=function(e){e.preventDefault();
      if(!(window.crypto&&crypto.subtle)){m.textContent="이 기기에서는 확인할 수 없어요.";return;}
      crypto.subtle.digest("SHA-256",new TextEncoder().encode(i.value.trim())).then(function(b){
        if(hex(b)===H){try{localStorage.setItem(KEY,H);}catch(e){} location.reload();}
        else{m.textContent="비밀번호가 맞지 않아요.";i.value="";i.focus();}
      });};
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",show);else show();
})();
