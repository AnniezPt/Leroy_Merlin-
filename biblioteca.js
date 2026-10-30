(() => {
 const root=document.getElementById('leroy-library-redesign');
 if(!root)return;
 const buttons=[...root.querySelectorAll('[data-stage]')];
 const request=root.querySelector('#demo-request');
 const documentContent=root.querySelector('#demo-document');
 const caption=root.querySelector('#demo-caption');
 const sheet=root.querySelector('.document-sheet');
 const sticker=root.querySelector('.paper-sticker');
 const documentTab=root.querySelector('.document-tab');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const objective='<p><b>Objetivo</b>Practicar cómo comprobar una respuesta de IA antes de utilizarla.</p>';
 const list='<div class="activity"><b>Actividad</b><ul><li>Leer un texto breve generado con IA.</li><li>Contrastarlo con la información de origen.</li><li>Señalar qué necesita corrección.</li></ul></div>';
 const pending='<p class="pending"><b>Por confirmar</b>Fecha, duración y personas destinatarias.</p>';
 const stages=[
  {request:'Prepara una propuesta breve para una sesión interna sobre cómo revisar resultados de IA. Incluye objetivo, actividad y datos pendientes. No inventes fecha, duración ni destinatarios.',body:objective+'<div class="activity"><b>Actividad</b><p>Leer un texto breve, contrastarlo con la información de origen y señalar qué necesita corrección.</p></div>'+pending,caption:'Ya tienes una estructura. Los datos que faltan siguen pendientes.'},
  {request:'Cambia solo el apartado de actividad. Conviértelo en tres pasos breves y conserva los datos pendientes.',body:objective+list+pending,caption:'El párrafo se convierte en tres pasos. El objetivo y los datos pendientes se conservan.'},
  {request:'Antes de compartirlo, comprueba qué datos faltan y si el texto conserva el sentido de la petición inicial.',body:objective+list+'<p class="pending"><b>Por confirmar</b><mark>Fecha</mark>, <mark>duración</mark> y <mark>personas destinatarias</mark>.</p>',caption:'Necesitas confirmar estos datos. El documento sigue siendo un borrador.'}
 ];
 let active=0;
 let animations=[];
 function render(){const stage=stages[active];request.textContent=stage.request;documentContent.innerHTML=stage.body;caption.textContent=stage.caption;documentTab.textContent=active===2?'Por confirmar':'Borrador';buttons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===active)));}
 const restored=window.openai?.widgetState?.privateContent?.stage;
 if(Number.isInteger(restored)&&restored>=0&&restored<stages.length)active=restored;
 render();
 buttons.forEach((button,index)=>button.addEventListener('click',()=>{
  if(active===index)return;
  animations.forEach(animation=>animation.cancel());animations=[];active=index;render();
  if(!reduced.matches&&sheet.animate){
   animations.push(sheet.animate([{transform:'translateY(9px) rotate(-1deg)'},{transform:'translateY(0) rotate(0deg)'}],{duration:430,easing:'ease-out'}));
   animations.push(documentTab.animate([{transform:'rotate(-8deg)'},{transform:'translateY(-7px) rotate(3deg)',offset:.45},{transform:'rotate(-8deg)'}],{duration:550,easing:'ease-in-out'}));
   documentContent.querySelectorAll('li').forEach((item,i)=>animations.push(item.animate([{transform:'translateX(-9px)'},{transform:'translateX(0)'}],{duration:350,delay:i*85,fill:'backwards',easing:'ease-out'})));
   if(active===2)documentContent.querySelectorAll('mark').forEach((item,i)=>animations.push(item.animate([{backgroundColor:'transparent'},{backgroundColor:'#e2f5c7'}],{duration:450,delay:i*110,fill:'backwards'})));
  }
  window.openai?.setWidgetState?.({modelContent:{propuesta:'Biblioteca editorial con imágenes',paso:active+1},privateContent:{stage:active}})?.catch(()=>{});
 }));
 if(sticker&&sticker.animate)sticker.addEventListener('mouseenter',()=>{if(!reduced.matches)sticker.animate([{transform:'rotate(8deg)'},{transform:'rotate(2deg)'},{transform:'rotate(8deg)'}],{duration:480,easing:'ease-in-out'});});
 window.addEventListener('openai:set_globals',event=>{const step=event.detail?.globals?.widgetState?.privateContent?.stage;if(Number.isInteger(step)&&step>=0&&step<stages.length){active=step;render();}});
})();
