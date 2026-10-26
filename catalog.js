(() => { 'use strict';
  function ean(i){const base=`2099000${String(i).padStart(5,'0')}`;let sum=0;[...base].forEach((n,j)=>sum+=Number(n)*(j%2?3:1));return base+((10-sum%10)%10)}
  const products = [
    ['Pickle-flavour crisps','Food','🥒'],['Coriander-flavour crisps','Food','🌿'],['Hotpot-flavour crisps','Food','🌶️'],['Durian-flavour crisps','Food','🍈'],
    ['Lime sparkling water','Drinks','🍋'],['Cold-brew oolong tea','Drinks','🧋'],['Lychee sparkling drink','Drinks','🥤'],['Sour gummy sweets','Food','🍬'],
    ['Seaweed crisps','Food','🍙'],['Mini spending journal','Stationery','📒'],['Colourful sticky notes','Stationery','📝'],['Pocket notebook','Stationery','📓'],
    ['Unusual eraser','Stationery','🧽'],['Mini tape measure','Everyday items','📏'],['Cable organiser','Everyday items','🔌'],['Playful fridge magnet','Everyday items','🧲'],
    ['Mini building kit','Everyday items','🧩'],['Folding travel cup','Everyday items','🥛'],['Mini fragrance sticker','Everyday items','🌸'],['Graphic bookmark','Stationery','🔖'],['Extra-hot crisps','Food','🌶️']
  ].map((p,i)=>({id:i+1,name:p[0],category:p[1],emoji:p[2],barcode:ean(i+1)}));
  const laysProducts = [
    {id:31,name:'Lay’s Bacon Grilled Cheese',flavour:'Bacon Grilled Cheese',photo:'assets/products/lays-bacon-grilled-cheese.png',category:'Food',barcode:ean(31)},
    {id:32,name:'Lay’s Valentina & Lime',flavour:'Valentina & Lime',photo:'assets/products/lays-valentina-lime.png',category:'Food',barcode:ean(32)},
    {id:33,name:'Lay’s Wavy Korean-Style Fried Chicken',flavour:'Korean-Style Fried Chicken',photo:'assets/products/lays-korean-fried-chicken.png',category:'Food',barcode:ean(33)},
    {id:34,name:'Lay’s Classic',flavour:'Classic',photo:'assets/products/lays-classic.png',category:'Food',barcode:ean(34)},
    {id:35,name:'Lay’s Sour Cream & Onion',flavour:'Sour Cream & Onion',photo:'assets/products/lays-sour-cream-onion.png',category:'Food',barcode:ean(35)}
  ];
  products.push(...laysProducts);
  const questions = [
    {title:'What are they hoping for?',description:'Choose one small thing you think your friend would like. Their secret wish will be revealed at checkout.',hint:'Read their clue, if they left one, and make your own choice.'},
    {title:'Have you tried this?',description:'Find something your friend would not usually buy, but you want them to try.',hint:'An unexpected find can be part of the fun. The choice is yours.'},
    {title:'Can you guess why I picked this?',description:'Choose a product, then privately lock your reason for choosing it.',hint:'Your friend will guess your reason when the item is revealed at checkout.'},
    {title:'This reminded me of you.',description:'Find a small item that brings one of your friend’s everyday habits to mind.',hint:'A familiar habit, a shared joke, or an unexpected connection.'},
    {title:'Wait, let me explain!',description:'Pick one final item for your friend. Save your explanation for the reveal.',hint:'There is no required “correct” product. Let your choice do the talking.'}
  ];
  const motives=['I thought you’d find it useful','I wanted you to try it','I did it on purpose'];
 products.forEach((p,i)=>{p.price=p.id>=31?({31:19.9,32:19.9,33:21.9,34:12.9,35:14.9}[p.id]):[8.9,8.9,9.9,12.9,6.5,7.5,6.9,8,9.5,16,9,12,6,15,12,10,22,18,7,6,9.9][i];Object.freeze(p)}); const product=id=>products.find(p=>p.id===Number(id)); const visual=p=>p?.photo?`<img class="pack-photo" src="${p.photo}" alt="Product packaging">`:`<span class="emoji" aria-hidden="true">${p?.emoji||"◻"}</span>`; window.WeChooseCatalog=Object.freeze({products:Object.freeze(products),questions:Object.freeze(questions),motives:Object.freeze(motives),product,visual});
})();