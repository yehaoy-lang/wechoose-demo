(() => {
  'use strict';
  const catalog=window.WeChooseCatalog;
  const ids=['A','B'], key=()=> 'wechoose-complete-v2';
  const limits=Object.freeze({wish:80,hint:120});
  const flavours=Object.freeze(catalog.products.filter(p=>p.id>=31).map(p=>({id:p.id,name:p.flavour,image:p.photo.split('/').pop()})));
  const copy=value=>JSON.parse(JSON.stringify(value));
  const token=()=>window.crypto?.randomUUID?.()||`WC-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
  const other=id=>id==='A'?'B':'A';
  const validId=id=>!!catalog.product(id);
  const validMotive=m=>Number.isInteger(m)&&m>=0&&m<catalog.motives.length;
  const validWish=text=>typeof text==='string'&&text.trim().length>0&&text.length<=limits.wish;
  const freshPlayer=()=>({picks:[],motive:null,punishment:null,submitted:false,view:'question',pending:null,pendingMotive:null,editing:null,preparation:{wish:'',hint:'',flavour:null,locked:false}});
  const freshCheckout=()=>({stage:'connect',cursor:0,turns:Array.from({length:10},()=>({productRevealed:false,answerRevealed:false,guess:null})),resultAnnounced:false,punishment:{status:'pending',revealed:false,purchase:false},keep:{},groceries:[],rewards:{base:5,perPoint:2},paid:null});
  function fresh(){return {version:4,sessionId:token(),revision:0,page:'map',active:'A',preset:false,players:{A:freshPlayer(),B:freshPlayer()},checkout:freshCheckout()};}
  function ready(player){const p=player?.preparation;return !!(p?.locked&&validWish(p.wish)&&typeof p.hint==='string'&&p.hint.length<=limits.hint&&flavours.some(f=>f.id===p.flavour));}
  function validSubmitted(p){return ready(p)&&p.submitted===true&&p.picks.length===5&&p.picks.every(validId)&&p.picks[1]>=31&&validMotive(p.motive)&&validId(p.punishment);}
  function canCheckout(state){return ids.every(id=>validSubmitted(state?.players?.[id]||{}));}
  function validReward(r){return r&&Number.isFinite(r.base)&&Number.isFinite(r.perPoint)&&r.base>=0&&r.perPoint>=0&&r.base+2*r.perPoint<=50;}
  function normalize(raw){
    if(!raw||![3,4].includes(raw.version)||!raw.players)return null;
    const out=fresh();
    if(raw.version===4&&typeof raw.sessionId==='string')out.sessionId=raw.sessionId;
    out.revision=Number.isSafeInteger(raw.revision)&&raw.revision>=0?raw.revision:0;
    out.active=ids.includes(raw.active)?raw.active:'A';out.page=['map','aisle','handoff'].includes(raw.page)?raw.page:'map';out.preset=raw.preset||false;
    for(const id of ids){
      const p=raw.players[id];if(!p)return null;
      const n=freshPlayer(),prep=p.preparation||{};
      n.preparation={wish:typeof prep.wish==='string'?prep.wish.slice(0,80):'',hint:typeof prep.hint==='string'?prep.hint.slice(0,120):'',flavour:flavours.some(f=>f.id===prep.flavour)?prep.flavour:null,locked:prep.locked===true};
      if(!ready(n))n.preparation.locked=false;
      if(Array.isArray(p.picks)){for(let q=0;q<Math.min(p.picks.length,5);q++){if(!validId(p.picks[q])||(q===1&&p.picks[q]<31))break;n.picks.push(p.picks[q]);}}
      n.motive=validMotive(p.motive)?p.motive:null;n.punishment=validId(p.punishment)?p.punishment:null;
      n.view=['question','scanner','confirm','success','review','submitted'].includes(p.view)?p.view:'question';
      n.editing=Number.isInteger(p.editing)&&p.editing>=0&&p.editing<=5?p.editing:null;
      n.pending=validId(p.pending)?p.pending:null;n.pendingMotive=validMotive(p.pendingMotive)?p.pendingMotive:null;n.lastSaved=p.lastSaved;
      n.submitted=p.submitted===true&&ready(n)&&n.picks.length===5&&validMotive(n.motive)&&validId(n.punishment);
      if(n.view==='confirm'&&!n.pending)n.view='question';if(n.view==='review'&&n.picks.length<5)n.view='question';
      if(n.submitted){n.editing=null;n.pending=null;n.pendingMotive=null;n.view='submitted';}
      out.players[id]=n;
    }
    if(raw.version===4&&validReward(raw.checkout?.rewards))out.checkout.rewards={...raw.checkout.rewards};
    if(raw.version===4&&raw.checkout&&canCheckout(out)){
      const c=raw.checkout,n=out.checkout;
      n.stage=['connect','reveal','result','punishment','bill','receipt'].includes(c.stage)?c.stage:'connect';
      n.cursor=Number.isInteger(c.cursor)&&c.cursor>=0&&c.cursor<10?c.cursor:0;
      n.turns=n.turns.map((t,i)=>{const r=c.turns?.[i];if(!r)return t;const q=Math.floor(i/2),revealed=r.productRevealed===true;return {productRevealed:revealed,answerRevealed:revealed&&r.answerRevealed===true,guess:q===2&&validMotive(r.guess)?r.guess:null};});
      n.resultAnnounced=c.resultAnnounced===true&&n.turns.every(t=>t.answerRevealed);
      const punish=c.punishment||{};
      n.punishment={status:['pending','revealed','skipped','declined','accepted'].includes(punish.status)?punish.status:'pending',revealed:punish.revealed===true&&n.resultAnnounced,purchase:punish.purchase===true&&punish.revealed===true&&n.resultAnnounced};
      n.keep=c.keep&&typeof c.keep==='object'?c.keep:{};
      n.groceries=Array.isArray(c.groceries)?c.groceries.filter(g=>ids.includes(g.recipient)&&validId(g.productId)&&Number.isInteger(g.quantity)&&g.quantity>0&&g.quantity<=99).map(g=>({id:String(g.id),recipient:g.recipient,productId:g.productId,quantity:g.quantity})):[];
      n.rewards=validReward(c.rewards)?{base:c.rewards.base,perPoint:c.rewards.perPoint}:n.rewards;
      n.paid=n.stage==='receipt'&&c.paid?c.paid:null;
      if(n.stage==='receipt'&&!n.paid)n.stage='bill';
      if(['result','punishment','bill','receipt'].includes(n.stage)&&!n.turns.every(t=>t.answerRevealed))out.checkout=freshCheckout();
    }
    return out;
  }
  function load(){
    try{const raw=JSON.parse(localStorage.getItem(key()));const n=normalize(raw);if(n)return n;
      if(!raw){const legacy=normalize(JSON.parse(localStorage.getItem('wechoose-wish-hint-v1')));if(legacy){localStorage.setItem(key(),JSON.stringify(legacy));return legacy;}}}
    catch{}
    const n=fresh();try{localStorage.setItem(key(),JSON.stringify(n));}catch{}return n;
  }
  function save(campaign,state,options={}){
    try{
      const raw=JSON.parse(localStorage.getItem(key())),latest=normalize(raw);let next=state;
      if(latest&&!options.replace){
        if(latest.sessionId!==state.sessionId)return false;
        if(ids.includes(options.player)){
          const id=options.player;
          if(latest.checkout.stage!=='connect'&&JSON.stringify(state.players[id])!==JSON.stringify(latest.players[id]))return false;
          next={...latest,active:state.active,page:state.page,preset:state.preset,players:{...latest.players,[id]:copy(state.players[id])}};
        }else if(latest.revision!==state.revision)return false;
      }
      next.version=4;next.revision=(latest?.revision||0)+1;localStorage.setItem(key(),JSON.stringify(next));
      Object.assign(state,copy(next));return true;
    }catch{return false;}
  }
  function beginCheckout(state){if(!canCheckout(state)||state.checkout.stage!=='connect')return false;state.checkout.stage='reveal';return true;}
  function getCurrent(state){
    const c=state.checkout;if(c.stage!=='reveal')return null;
    const index=c.cursor,q=Math.floor(index/2),chooser=ids[index%2],recipient=other(chooser),t=c.turns[index];
    return {index,q,chooser,recipient,product:t.productRevealed?catalog.product(state.players[chooser].picks[q]):null,...t};
  }
  function revealProduct(state){const x=getCurrent(state);if(!x||x.productRevealed)return false;const t=state.checkout.turns[x.index];t.productRevealed=true;if(x.q>=3)t.answerRevealed=true;return true;}
  function guessMotive(state,index){const x=getCurrent(state);if(!x||x.q!==2||!x.productRevealed||x.answerRevealed||x.guess!==null||!validMotive(index))return false;state.checkout.turns[x.index].guess=index;return true;}
  function revealAnswer(state){const x=getCurrent(state);if(!x||!x.productRevealed||x.answerRevealed||(x.q===2&&x.guess===null))return false;state.checkout.turns[x.index].answerRevealed=true;return true;}
  function advanceReveal(state){const x=getCurrent(state);if(!x||!x.answerRevealed)return false;if(x.index===9)state.checkout.stage='result';else state.checkout.cursor++;return true;}
  function getScores(state){
    const scores={A:0,B:0};if(!canCheckout(state))return scores;
    state.checkout.turns.forEach((t,i)=>{if(!t.answerRevealed)return;const q=Math.floor(i/2),chooser=ids[i%2],recipient=other(chooser);
      if(q===1&&state.players[chooser].picks[1]===state.players[recipient].preparation.flavour)scores[chooser]++;
      if(q===2&&t.guess===state.players[chooser].motive)scores[recipient]++;
    });return scores;
  }
  function getWinner(state){if(!state.checkout.resultAnnounced)return null;const s=getScores(state);return s.A===s.B?null:s.A>s.B?'A':'B';}
  function announceResult(state){const c=state.checkout;if(c.stage!=='result'||c.resultAnnounced||!c.turns.every(t=>t.answerRevealed))return false;c.resultAnnounced=true;return true;}
  function continueAfterResult(state){const c=state.checkout;if(c.stage!=='result'||!c.resultAnnounced)return false;if(getWinner(state))c.stage='punishment';else{c.punishment.status='skipped';c.stage='bill';}return true;}
  function resolvePunishment(state,action){
    const c=state.checkout,p=c.punishment;if(c.stage!=='punishment'||!c.resultAnnounced||!getWinner(state))return false;
    if(action==='reveal'&&p.status==='pending'){p.status='revealed';p.revealed=true;return true;}
    if(action==='skip'&&p.status==='pending'){p.status='skipped';return true;}
    if(['decline','accept'].includes(action)&&p.status==='revealed'){p.status=action==='accept'?'accepted':'declined';return true;}return false;
  }
  function getPunishment(state){if(!state.checkout.resultAnnounced||!state.checkout.punishment.revealed)return null;const winner=getWinner(state);return winner?catalog.product(state.players[winner].punishment):null;}
  function goToBill(state){const c=state.checkout;if(c.stage==='bill')return true;if(c.stage!=='punishment'||!['skipped','declined','accepted'].includes(c.punishment.status))return false;c.stage='bill';return true;}
  function getRewardConfig(state){return {...state.checkout.rewards};}
  function setRewardConfig(state,r){if(state.checkout.stage!=='connect'||!validReward(r))return false;state.checkout.rewards={base:r.base,perPoint:r.perPoint};return true;}
  const cents=n=>Math.round(n*100),yuan=n=>n/100;
  function getBill(state){
    if(state.checkout.stage==='receipt'&&state.checkout.paid)return copy(state.checkout.paid.bill);
    if(state.checkout.stage!=='bill')return null;
    const scores=getScores(state),r=getRewardConfig(state),out={subtotal:0,discount:0,total:0};
    for(const recipient of ids){
      const chooser=other(recipient),lines=state.players[chooser].picks.map((id,q)=>{const p=catalog.product(id);return {id:`game-${chooser}-${q}`,productId:id,name:p.name,price:p.price,quantity:1,kind:'game',recipient,chooser,q,keep:state.checkout.keep[`${chooser}-${q}`]!==false,eligible:true};});
      for(const g of state.checkout.groceries.filter(g=>g.recipient===recipient)){const p=catalog.product(g.productId);lines.push({...g,name:p.name,price:p.price,kind:'grocery',keep:true,eligible:true});}
      const winner=getWinner(state),pun=getPunishment(state);
      if(pun&&other(winner)===recipient)lines.push({id:'punishment',productId:pun.id,name:pun.name,price:pun.price,quantity:1,kind:'punishment',recipient,chooser:winner,q:null,keep:state.checkout.punishment.purchase,eligible:true});
      const sub=lines.filter(l=>l.keep).reduce((sum,l)=>sum+cents(l.price)*l.quantity,0),rate=r.base+scores[recipient]*r.perPoint,discount=Math.round(sub*rate/100);
      out[recipient]={lines,subtotal:yuan(sub),discountRate:rate,discount:yuan(discount),total:yuan(sub-discount),score:scores[recipient]};out.subtotal+=sub;out.discount+=discount;out.total+=sub-discount;
    }
    out.subtotal=yuan(out.subtotal);out.discount=yuan(out.discount);out.total=yuan(out.total);return out;
  }
  function setKeep(state,chooser,q,value){if(state.checkout.stage!=='bill'||!ids.includes(chooser)||!Number.isInteger(q)||q<0||q>=5||typeof value!=='boolean')return false;state.checkout.keep[`${chooser}-${q}`]=value;return true;}
  function addGrocery(state,recipient,id){if(state.checkout.stage!=='bill'||!ids.includes(recipient)||!validId(id))return false;const g=state.checkout.groceries.find(g=>g.recipient===recipient&&g.productId===Number(id));if(g){if(g.quantity>=99)return false;g.quantity++;}else state.checkout.groceries.push({id:token(),recipient,productId:Number(id),quantity:1});return true;}
  function removeGrocery(state,recipient,lineId){if(state.checkout.stage!=='bill')return false;const n=state.checkout.groceries.findIndex(g=>g.recipient===recipient&&g.id===lineId);if(n<0)return false;const g=state.checkout.groceries[n];if(g.quantity>1)g.quantity--;else state.checkout.groceries.splice(n,1);return true;}
  function setPunishmentPurchase(state,value){if(state.checkout.stage!=='bill'||!getPunishment(state)||typeof value!=='boolean')return false;state.checkout.punishment.purchase=value;return true;}
  function pay(state){if(state.checkout.stage!=='bill')return false;const bill=getBill(state);state.checkout.paid={id:`WC-${Date.now().toString(36).toUpperCase()}`,at:new Date().toISOString(),bill:copy(bill)};state.checkout.stage='receipt';return true;}
  function freshExample(winner='A'){
    const state=fresh();state.preset=true;state.page='aisle';
    state.players.A={...freshPlayer(),picks:[5,winner==='B'?31:33,10,14,13],motive:2,punishment:8,submitted:true,view:'submitted',preparation:{wish:'A refreshing drink',hint:'Something cool for a long afternoon.',flavour:32,locked:true}};
    state.players.B={...freshPlayer(),picks:[12,winner==='A'?31:32,15,16,18],motive:0,punishment:21,submitted:true,view:'submitted',preparation:{wish:'A pocket notebook',hint:'For the thoughts I keep forgetting.',flavour:33,locked:true}};
    return state;
  }
  window.WeChooseGame=Object.freeze({flavours,limits,key,freshPlayer,fresh,load,save,ready,validWish,canCheckout,beginCheckout,getCurrent,revealProduct,revealAnswer,guessMotive,advanceReveal,getScores,getWinner,announceResult,continueAfterResult,resolvePunishment,getPunishment,goToBill,getRewardConfig,setRewardConfig,getBill,setKeep,addGrocery,removeGrocery,setPunishmentPurchase,pay,freshExample,normalize});
})();
