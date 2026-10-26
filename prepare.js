(() => {
  'use strict';
  const game = window.WeChooseGame;
  const params = new URLSearchParams(location.search);
  const campaign = 'lays';
  let state = game.load(campaign);
  if (['A','B'].includes(params.get('player'))) state.active = params.get('player');
  let step = 'wish';
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mine = () => state.players[state.active];
  const otherId = () => state.active === 'A' ? 'B' : 'A';
  const prep = () => mine().preparation;
  const lock = '<svg viewBox="0 0 20 22" width="16" height="18" fill="none" aria-hidden="true"><rect x="3" y="9" width="14" height="11" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M6 9V6a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.7"/></svg>';
  const check = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="m5 12 5 5L20 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const arrow = '<span aria-hidden="true">→</span>';
  function save(options) {
    const saved=game.save(campaign,state,options||{player:state.active});
    if (!saved) toast('This browser could not save your progress. Keep this tab open.');
    return saved;
  }
  function toast(text) { const t=$('#toast'); t.textContent=text;t.classList.add('visible');clearTimeout(window.preplayToast);window.preplayToast=setTimeout(()=>t.classList.remove('visible'),3500); }
  function commit(options) { const saved=save(options);render();return saved; }
  function updateURL() { const url=new URL(location.href);url.searchParams.set('campaign',campaign);url.searchParams.set('player',state.active);history.replaceState(null,'',url); }
  function edition() { return `<div class="campaign-controls"><span>TODAY’S GAME</span><span class="unified-game-label">WeChoose × Lay’s</span></div><p class="preplay-campaign-note">Five questions · secret wishes & surprises · illustrative partnership</p>`; }
  function visual() { return `<div class="secret-illustration" aria-label="Two friends each keep their own answers private"><div class="orbit-ring"></div><div class="secret-card card-a"><span>PLAYER A</span><div class="card-lock">${lock}</div><b>My secret.</b><i>•••• ••••</i></div><div class="secret-card card-b"><span>PLAYER B</span><div class="card-lock">${lock}</div><b>My secret.</b><i>•••• ••••</i></div><div class="pair-mark"><img src="assets/logo.svg" alt="WeChoose W"></div><span class="privacy-caption">Private wishes. Shared clues.</span></div>`; }
  function story() { return `<div class="story preplay-story">${edition()}<p class="eyebrow">Before you browse</p><h1>Answer for yourself.<br><em>Choose for each other.</em></h1><p class="story-intro">Make a secret wish and leave your friend a clue. They’ll turn that clue into a real product.</p>${visual()}<div class="preplay-principles"><div><b>01</b><span><strong>Make a wish</strong>Say what you’re hoping for, in your own words.</span></div><div><b>02</b><span><strong>Share a clue</strong>Your hint helps them choose. Your wish stays private.</span></div><div><b>03</b><span><strong>Go at your pace</strong>Lock your answers and start choosing. No need to wait.</span></div></div><button class="note-trigger" data-action="notes">How this fits the five-question game</button></div>`; }
  function progress(active) { const total=campaign==='lays'?2:1;return `<div class="preparation-progress"><span>${active==='review'?'PRIVATE REVIEW':`PRIVATE ANSWER ${active==='flavour'?2:1} OF ${total}`}</span><div>${Array.from({length:total},(_,i)=>`<i class="${active==='review'||(active==='flavour'&&i===0)?'done':i===(active==='flavour'?1:0)?'current':''}"></i>`).join('')}</div></div>`; }
  function wishScreen() {
    return `${progress('wish')}<h2 class="question-title">What would you like me to pick out for you today?</h2>
      <p class="question-desc">Make one small wish for this shop. Leave a clue to help your friend choose.</p>
      <div class="wish-field"><label for="secret-wish">${lock} My secret wish <small>PRIVATE</small></label>
        <textarea id="secret-wish" name="wish" maxlength="${game.limits.wish}" rows="2" placeholder="e.g. A chocolate bar" aria-describedby="wish-help">${esc(prep().wish)}</textarea>
        <p id="wish-help">A refreshing drink, a good pen… something you could find here.</p></div>
      <div class="wish-field hint-field"><label for="friend-hint">A hint for player ${otherId()} <small>OPTIONAL · SHARED</small></label>
        <textarea id="friend-hint" name="hint" maxlength="${game.limits.hint}" rows="2" placeholder="e.g. My afternoon could use something sweet." aria-describedby="hint-help">${esc(prep().hint)}</textarea>
        <p id="hint-help">They’ll see this clue in Q1 after you lock. Reveal as much as you like.</p></div>
      <button class="preplay-back hint-preview" data-action="preview-hint" ${!prep().hint.trim()?'disabled':''}>Preview what your friend sees</button>
      <div class="phone-actions"><button class="primary" data-action="next" ${!game.validWish(prep().wish)?'disabled':''}>Next: flavour challenge ${arrow}</button></div>`;
  }
  function flavourScreen() { return `${progress('flavour')}<span class="preplay-feature">Q2 · LAY’S FLAVOUR CHALLENGE</span><h2 class="question-title">Which flavour would you dare to try?</h2><p class="question-desc">Pick one for yourself. Your friend will try to guess your choice in the aisle.</p><fieldset class="flavour-options"><legend class="sr-only">Your challenge flavour</legend>${game.flavours.map(f=>`<label class="flavour-option"><input type="radio" name="flavour" value="${f.id}" ${prep().flavour===f.id?'checked':''}><img src="assets/products/${f.image}" alt=""><span>${esc(f.name)}</span><i aria-hidden="true">${prep().flavour===f.id?'✓':''}</i></label>`).join('')}</fieldset><div class="phone-actions"><button class="primary" data-action="review" ${!prep().flavour?'disabled':''}>Review my answers ${arrow}</button><button class="preplay-back" data-action="wish">Back to my wish</button></div>`; }
  function answerRows(editable) {
    const rows=[
      {label:'Q1 · My secret wish',value:prep().wish,target:'wish',shared:false},
      {label:`Q1 · Hint for player ${otherId()}`,value:prep().hint.trim()||'No hint this time',target:'wish',shared:true},
      {label:'Q2 · My challenge flavour',value:game.flavours.find(f=>f.id===prep().flavour)?.name||'Not selected',target:'flavour',shared:false}
    ];
    return rows.map(row=>`<div class="answer-review-row ${row.shared?'shared-review-row':''}"><div><span>${row.label} · ${row.shared?'SHARED':'PRIVATE'}</span><strong>${esc(row.value)}</strong></div>${editable?`<button data-action="${row.target}">Edit</button>`:row.shared?'<span class="shared-tag">Clue</span>':lock}</div>`).join('');
  }
  function reviewScreen() { return `${progress('review')}<h2 class="question-title">Ready to keep a little mystery?</h2><p class="question-desc">Your friend sees your hint. Your wish and challenge flavour stay private until checkout.</p><div class="answer-review wish-review">${answerRows(true)}</div><div class="quiet-box">${lock}<div><strong>Lock, then start choosing</strong>These answers stay fixed for this game. Only your hint is shared in Q1.</div></div><div class="phone-actions"><button class="primary" data-action="lock">${lock} Lock my answers & share my hint</button><p class="phone-footnote">No hint is shared if you leave it blank. You can start without waiting.</p></div>`; }
  function lockedScreen() { const otherReady=game.ready(state.players[otherId()],campaign);return `<div class="success-mark">${check}</div><span class="preplay-feature">YOUR WISH IS STILL A SECRET</span><h2 class="success-title">A clue for them.<br>A surprise for you.</h2><p class="success-copy">Now choose five real products for player ${otherId()}, using the questions on your phone.</p><div class="status-list"><div class="status-row"><span>My wish & flavour</span><strong>Locked ${lock}</strong></div><div class="status-row"><span>My hint</span><strong>${prep().hint.trim()?'Shared with '+otherId():'No hint this time'}</strong></div><div class="status-row"><span>Player ${otherId()}</span><strong>${otherReady?'Answers locked':'Preparing their answers'}</strong></div></div><p class="stage-note">${otherReady?'Their clue, if they left one, will appear in your Q1. Their wish stays private.':'You can start now. Their clue will be available once they have locked their answers.'}</p><button class="preplay-back view-own" data-action="view-own">View my locked answers</button><div class="phone-actions"><button class="primary lime" data-action="aisle">Start choosing for ${otherId()} ${arrow}</button><p class="phone-footnote">Your hint is shared. Your wish and flavour stay secret.</p></div>`; }
  function phone() { const locked=game.ready(mine(),campaign);return `<div class="phone-column"><div class="presenter-switch"><span>Presenter view · one phone at a time</span><div class="player-switch" aria-label="Choose the phone to present">${['A','B'].map(id=>`<button data-action="player" data-player="${id}" class="${id===state.active?'selected':''}" aria-pressed="${id===state.active}"> ${id} </button>`).join('')}</div></div><div class="phone preplay-phone" aria-label="Player ${state.active} preparation"><div class="phone-head"><span class="small-brand">WeChoose</span><span class="identity"><i></i> Player ${state.active} · my answers</span></div><div class="phone-content" id="phone-content">${locked?lockedScreen():step==='review'?reviewScreen():step==='flavour'?flavourScreen():wishScreen()}</div><div class="phone-bottom"><span>${lock} Private preparation</span><span>For today’s game</span></div></div><p class="preset-note">Presentation prototype · A and B simulate two phones in this browser.</p></div>`; }
  function render() { $('.brand').href=`prepare.html?campaign=${campaign}&player=${state.active}`;$('#prepare-app').innerHTML=`<section class="stage preplay-stage">${story()}${phone()}</section>`; }
  let lastFocus;
  function modal(title,body,buttons='') {lastFocus=document.activeElement;$('#overlay').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-top"><h2 id="modal-title">${title}</h2><button data-action="close" aria-label="Close dialog">×</button></div>${body}<div class="modal-actions">${buttons}</div></section></div>`;$('#overlay button')?.focus();}
  function close() {$('#overlay').innerHTML='';if(lastFocus&&document.contains(lastFocus))lastFocus.focus();}
  const actions={
    player(el) {if(!['A','B'].includes(el.dataset.player))return;if(!save())return;state.active=el.dataset.player;step='wish';updateURL();commit();},

    next() {if(!game.validWish(prep().wish))return;step='flavour';commit();},
    review() {if(!game.validWish(prep().wish)||!game.flavours.some(f=>f.id===prep().flavour))return;step='review';commit();},
    wish() {if(prep().locked)return;step='wish';render();},
    flavour() {if(prep().locked)return;step='flavour';render();},
    lock() {if(!game.validWish(prep().wish)||prep().hint.length>game.limits.hint||!game.flavours.some(f=>f.id===prep().flavour))return;prep().wish=prep().wish.trim();prep().hint=prep().hint.trim();prep().locked=true;commit();},
    aisle() {if(!game.ready(mine(),campaign)){toast('First, save and lock your own opening answers.');return;}if(!save())return;location.href=`index.html?view=aisle&campaign=${campaign}&player=${state.active}`;},
    checkout() {if(!game.canCheckout(state)){toast('Both players must submit five picks and a separate punishment before checkout.');return;}if(!save())return;location.href='checkout.html';},
    'view-own'() {modal('Your locked answers',`<p>Player ${state.active}’s private answers. They stay fixed for this game.</p><div class="answer-review">${answerRows(false)}</div>`);},
    notes() {modal('Before the aisle',`<p><strong>Q1 · Wish + hint:</strong> privately write one small thing you’d like. Optionally leave a separate clue. Once locked, only that clue appears on your friend’s Q1. Your wish stays hidden until checkout.</p><p><strong>Q1 scoring is under review.</strong> A biscuit may fit a clue about something sweet without matching a wish for chocolate. This prototype does not award a point by guessing what the text means.</p><p><strong>Q2:</strong> choose a secret challenge flavour from the same five real product references in the aisle. A product match gives the chooser one point. <strong>Q3:</strong> the chooser privately locks a motive; the recipient guesses at checkout and earns one point for a match. Each player has two defined scoring chances. Q1’s rule and the commercial reward percentages are still to be decided; the checkout labels any example rates clearly.</p><p><strong>Q4–Q5:</strong> open choices. After the five picks, prepare one separate final punishment. It adds no points and can only be revealed by the winner after the result.</p><p class="demo-limits">This build simulates two phones in one browser. Answers are stored locally. Only a locked hint is shown to the other player; this is a presentation flow, not production account security. The shared self-checkout continues this same saved round. Scan, payment and two phones are simulated for the presentation.</p>`);},
    'preview-hint'() {if(!prep().hint.trim())return;modal(`What player ${otherId()} will see`, `<p class="hint-source">A hint from player ${state.active}</p><blockquote class="hint-preview-quote">${esc(prep().hint.trim())}</blockquote><p>Your secret wish is not shown. This hint becomes visible only after you lock.</p>`);},
    restart() {modal('Restart this game?',`<p>This clears both players’ wishes, hints, opening answers and selections in this prototype. Both players return to private preparation.</p>`,'<button class="secondary" data-action="close">Keep my progress</button><button class="primary" data-action="confirm-restart">Restart game</button>');},
    'confirm-restart'() {close();const active=state.active;state=game.fresh();state.active=active;step='wish';commit({replace:true});},
    close
  };
  document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;e.preventDefault();actions[el.dataset.action]?.(el);});
  document.addEventListener('input',e=>{if(prep().locked)return;if(e.target.name==='wish'||e.target.name==='hint'){const field=e.target.name;prep()[field]=e.target.value.slice(0,game.limits[field]);save();const next=$('[data-action="next"]');if(next)next.disabled=!game.validWish(prep().wish);const preview=$('[data-action="preview-hint"]');if(preview)preview.disabled=!prep().hint.trim();}});
  document.addEventListener('change',e=>{if(prep().locked)return;if(e.target.name==='flavour'&&game.flavours.some(f=>f.id===Number(e.target.value))){prep().flavour=Number(e.target.value);save();document.querySelectorAll('.flavour-option i').forEach(el=>el.textContent=el.parentElement.querySelector('input').checked?'✓':'');const button=$('[data-action="review"]');if(button)button.disabled=false;}});
  document.addEventListener('keydown',e=>{const m=$('.modal');if(!m)return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const items=[...m.querySelectorAll('button,a')].filter(x=>!x.disabled);if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0]?.focus();}}});
  function syncFromStorage(){const active=state.active;state=game.load(campaign);state.active=active;updateURL();render();}
  window.addEventListener('storage',e=>{if(e.key===game.key(campaign)||e.key===null)syncFromStorage();});
  window.addEventListener('pageshow',e=>{if(e.persisted)syncFromStorage();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')syncFromStorage();});
  updateURL();render();
})();
