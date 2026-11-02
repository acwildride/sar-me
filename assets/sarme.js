/* SAR Meran – Dashboard-Logik (Sprache, „Ich bin …“, alle Grafiken) */
(function(){
"use strict";
var D=window.D, PG=window.PG||{type:'none'}, Y=D.years, YL=Y[Y.length-1];
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},
        set:function(k,v){try{if(v==null||v==='')localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}};
var lang=document.documentElement.getAttribute('data-lang')||'de';
var me=LS.get('sarme_me')||''; if(me&&D.names.indexOf(me)<0) me='';
var SMALL=window.innerWidth<700;
var C={accent:'#f5b83d',nacht:'#5aa9e6',sar:'#4fd1c5',na:'#ff8a65',az:'#c4a7ff',frei:'#9ccc65',fg:'#e8e8e8',muted:'#9aa0a6',line:'#2a2f3a'};
var MIXC={op:'#7d8590',icu:'#4fd1c5',spaet:'#a3b18a',optag:'#2f9e94',tag:'#f5b83d',nacht:'#5aa9e6',natag:'#ff8a65',nanacht:'#c4a7ff',ber:'#565c66'};

/* ── Texte ─────────────────────────────────────────────────────── */
var T={
 median:{de:'Median',it:'Mediana'}, rank:{de:'Rang',it:'Posizione'}, of:{de:'von',it:'su'},
 vs:{de:'ggü.',it:'risp.'}, prev:{de:'Vorjahr',it:'anno prec.'}, h:{de:'h',it:'h'},
 shifts:{de:'Dienste',it:'Turni'}, hours:{de:'Stunden',it:'Ore'}, none:{de:'– niemand –',it:'– nessuno –'},
 pick_t:{de:'Wer bist du?',it:'Chi sei?'},
 pick_s:{de:'Wähle oben rechts „Ich bin“ oder klicke in einer Grafik auf deinen Balken – dann wirst du überall hervorgehoben. Die Auswahl bleibt nur auf diesem Gerät.',
         it:'Scegli „Io sono“ in alto a destra oppure clicca sulla tua barra in un grafico: verrai evidenziato ovunque. La scelta resta solo su questo dispositivo.'},
 notin:{de:'ist in diesem Jahr nicht im Dienstplan.',it:'non è nel piano turni di quest’anno.'},
 people:{de:'Personen im Plan',it:'persone nel piano'},
 k_hours:{de:'Geplante Dienststunden',it:'Ore di servizio pianificate'},
 k_d12:{de:'12-h-Dienste',it:'Turni da 12 h'}, k_day:{de:'Tag',it:'Giorno'}, k_night:{de:'Nacht',it:'Notte'},
 k_na:{de:'Notarztdienste',it:'Turni Notarzt'}, k_naf:{de:'davon an Feiertagen',it:'di cui festivi'},
 k_ot:{de:'Berechnete Überstunden',it:'Straordinari calcolati'}, k_ot_s:{de:'Summe über alle mit AZV',it:'Somma di tutti con contratto noto'},
 k_cal:{de:'Feiertage',it:'festivi'}, k_calt:{de:'Kalender',it:'Calendario'}, k_cal_s:{de:'inkl. Wochenenden',it:'weekend inclusi'}, k_wt:{de:'Werktage',it:'feriali'},
 k_last:{de:'letzter Eintrag',it:'ultima voce'},
 m_hours:{de:'Gesamtstunden',it:'Ore totali'}, m_ot:{de:'Überstunden',it:'Straordinari'}, m_night:{de:'Nachtdienste',it:'Turni notturni'},
 m_day:{de:'Tagdienste',it:'Turni diurni'}, m_hol:{de:'Dienste an Feiertagen',it:'Turni festivi'}, m_na:{de:'Notarztdienste',it:'Turni Notarzt'},
 m_d12:{de:'12-h-Dienste',it:'Turni da 12 h'}, m_ff:{de:'Freie Feiertage',it:'Festivi liberi'}, m_fw:{de:'Freie Werktage',it:'Feriali liberi'},
 m_bl:{de:'2er-Nachtblöcke',it:'Blocchi di 2 notti'}, m_abz:{de:'Stundenabzug',it:'Ore in meno'}, m_az:{de:'Stunden : Soll',it:'Ore : contratto'},
 m_azf:{de:'Feiertage : AZV',it:'Festivi : contratto'}, m_we:{de:'Wochenend-Dienste',it:'Turni nel weekend'},
 m_top:{de:'Top-Feiertage',it:'Grandi festività'}, m_som:{de:'Sommer-Dienste (Jul–Aug)',it:'Turni estivi (lug–ago)'},
 m_gap:{de:'Längste dienstfreie Zeit',it:'Periodo più lungo senza turni'}, m_ser:{de:'Längste Serie an Diensttagen',it:'Serie più lunga di giorni in servizio'},
 m_frn:{de:'Freitagsnächte',it:'Notti del venerdì'},
 days:{de:'Tage',it:'giorni'}, azv:{de:'Arbeitszeitverhältnis',it:'Rapporto di lavoro'}, azv_none:{de:'nicht hinterlegt',it:'non indicato'},
 team:{de:'Team',it:'Team'}, year:{de:'Jahr',it:'Anno'},
 c_tag:{de:'Anä/ICU Tag',it:'Anest./Rianim. giorno'}, c_nacht:{de:'Anä/ICU Nacht',it:'Anest./Rianim. notte'},
 c_natag:{de:'Notarzt Tag',it:'Notarzt giorno'}, c_nanacht:{de:'Notarzt Nacht',it:'Notarzt notte'},
 mix_op:{de:'OP',it:'Sala op.'}, mix_icu:{de:'Intensiv',it:'Rianimazione'}, mix_spaet:{de:'Spät/Schmerz',it:'Tardo/dolore'},
 mix_optag:{de:'OP Tag 12 h',it:'Sala 12 h'}, mix_tag:{de:'Tagdienst',it:'Turno diurno'}, mix_nacht:{de:'Nachtdienst',it:'Turno notturno'},
 mix_natag:{de:'Notarzt Tag',it:'Notarzt giorno'}, mix_nanacht:{de:'Notarzt Nacht',it:'Notarzt notte'}, mix_ber:{de:'Bereitschaft',it:'Reperibilità'},
 wd:{de:['Mo','Di','Mi','Do','Fr','Sa','So'],it:['Lu','Ma','Me','Gi','Ve','Sa','Do']},
 mon:{de:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],it:['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']},
 hol_ny:{de:'Neujahr',it:'Capodanno'}, hol_eas:{de:'Ostersonntag',it:'Pasqua'}, hol_easm:{de:'Ostermontag',it:'Pasquetta'},
 hol_fer:{de:'Ferragosto',it:'Ferragosto'}, hol_xe:{de:'Heiligabend',it:'Vigilia di Natale'}, hol_xmas:{de:'Weihnachten',it:'Natale'},
 hol_st:{de:'Stephanstag',it:'Santo Stefano'}, hol_sil:{de:'Silvester',it:'San Silvestro'},
 sh_T:{de:'Tag',it:'giorno'}, sh_N:{de:'Nacht',it:'notte'},
 f_nacht_gesamt:{de:'Nachtdienste',it:'Turni notturni'}, f_dienste_an_feiertagen:{de:'Feiertagsdienste',it:'Turni festivi'},
 f_top_feiertage:{de:'Top-Feiertage',it:'Grandi festività'}, f_d12:{de:'12-h-Dienste',it:'Turni da 12 h'}, f_wochenende:{de:'Wochenenden',it:'Weekend'},
 act:{de:'geleistet',it:'svolti'}, exp:{de:'fairer Anteil',it:'quota equa'}, diff:{de:'Bilanz',it:'Saldo'},
 more:{de:'mehr als fairer Anteil',it:'più della quota equa'}, less:{de:'weniger als fairer Anteil',it:'meno della quota equa'},
 gini:{de:'Ungleichheit (Gini)',it:'Disuguaglianza (Gini)'},
 share_we:{de:'Anteil Fr–So',it:'Quota ve–do'},
 partner:{de:'Häufigste Dienstpartner',it:'Colleghi di turno più frequenti'}, together:{de:'gemeinsame Dienste',it:'turni insieme'},
 mainarea:{de:'Haupteinsatz',it:'Impiego principale'}, nodata:{de:'Keine Daten',it:'Nessun dato'},
 team_avg:{de:'Team-Durchschnitt',it:'Media del team'}, person:{de:'Person',it:'Persona'},
 p2575:{de:'25.–75. Perzentil',it:'25°–75° percentile'}, metric:{de:'Kennzahl',it:'Indicatore'},
 tbl_year:{de:'Jahr',it:'Anno'}, tbl_hours:{de:'Dienststunden',it:'Ore di servizio'}, tbl_ot:{de:'Überstunden',it:'Straordinari'},
 tbl_ppl:{de:'Personen',it:'Persone'}, tbl_hol:{de:'Feiertage',it:'Festivi'},
 sum:{de:'Summe',it:'Totale'}, mine:{de:'Mein Jahr',it:'Il mio anno'}, inteam:{de:'im Team',it:'nel team'},
 times:{de:'×',it:'×'}, none_hol:{de:'keine',it:'nessuna'}
};
function L(o){return (o&&typeof o==='object'&&!Array.isArray(o)&&('de' in o))?(o[lang]!=null?o[lang]:o.de):o}
function t(k){return T[k]?L(T[k]):k}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ── Zahlen ───────────────────────────────────────────────────── */
function fmt(v,f){ if(v==null||isNaN(v)) return '–';
  if(f==='r') return v.toFixed(2).replace('.',',');
  if(f==='p') return Math.round(v*100)+' %';
  if(f==='d') return v.toFixed(1).replace('.',',');
  var s=Math.round(v).toString(), neg=s[0]==='-'; if(neg) s=s.slice(1);
  return (neg?'−':'')+s.replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
function hf(f){return f==='r'?':.2f':f==='p'?':.0%':f==='d'?':.1f':':,.0f'}
function med(a){return q(a,.5)}
function q(a,p){a=a.filter(function(x){return x!=null&&!isNaN(x)}).sort(function(x,z){return x-z});if(!a.length)return null;
  var i=(a.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return a[l]+(a[h]-a[l])*(i-l)}
function yd(y){return D.y[String(y)]}
function mv(y,k,azvOnly){var Y_=yd(y),o=(Y_.m[k]||{}),r={};for(var a in o){if(azvOnly&&Y_.azv[a]==null)continue;r[a]=o[a]}return r}
function rows(o,keepZero){var r=[];for(var a in o){var v=o[a];if(v==null||isNaN(v))continue;if(!keepZero&&Math.abs(v)<1e-9)continue;r.push([a,v])}
  return r.sort(function(p,z){return z[1]-p[1]})}
function rankIn(o,n){var r=rows(o,true);for(var i=0;i<r.length;i++) if(r[i][0]===n) return [i+1,r.length];return null}
function sumO(o){var s=0;for(var a in o) if(o[a]!=null) s+=o[a];return s}
function vals(o){var r=[];for(var a in o) if(o[a]!=null) r.push(o[a]);return r}
function delta(c,p,inv){ if(p==null||c==null||p===0) return '<span class="flat">–</span>';
  var d=(c-p)/Math.abs(p)*100; if(Math.abs(d)<0.5) return '<span class="flat">● ±0 %</span>';
  var cls=inv?(d>0?'down':'up'):(d>0?'up':'down');
  return '<span class="'+cls+'">'+(d>0?'▲ ':'▼ ')+Math.abs(d).toFixed(1).replace('.',',')+' %</span>'; }

/* ── Plotly ───────────────────────────────────────────────────── */
var CFG={responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d','autoScale2d']};
function deep(a,b){for(var k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object') deep(a[k],b[k]); else a[k]=b[k];}return a}
function lay(x){var l={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
  font:{family:'system-ui,-apple-system,"Segoe UI",sans-serif',color:C.fg,size:12},
  margin:{l:SMALL?44:56,r:SMALL?8:16,t:10,b:70},
  xaxis:{gridcolor:C.line,linecolor:C.line,zeroline:false,tickfont:{color:C.muted},automargin:true},
  yaxis:{gridcolor:C.line,linecolor:C.line,zeroline:false,tickfont:{color:C.muted},automargin:true},
  hoverlabel:{bgcolor:'#202020',bordercolor:C.line,font:{color:C.fg}},showlegend:false,bargap:0.25};
  deep(l,x||{}); if(l.showlegend&&SMALL){l.legend=deep(l.legend||{},{orientation:'h',x:0,y:-0.25,xanchor:'left',yanchor:'top'});l.margin.b=Math.max(l.margin.b,90)}
  return l}
function plot(id,fig,clickAxis){var el=document.getElementById(id); if(!el||!window.Plotly) return;
  Plotly.react(el,fig.data,fig.layout,CFG);
  if(clickAxis&&!el._click){el._click=1;el.on('plotly_click',function(ev){var p=ev.points&&ev.points[0];if(!p)return;
    var n=clickAxis==='x'?p.x:(clickAxis==='y'?p.y:(p.customdata!=null?p.customdata:null)); if(typeof n==='string'){n=n.replace(/<[^>]+>/g,'');if(D.names.indexOf(n)>=0) setMe(n===me?'':n);}})}}
function ylab(n){return n===me?'<b>▶ '+n+'</b>':n}
function hlColors(names,color){return names.map(function(n){return n===me?'#ffffff':color})}
function hlOp(names){return names.map(function(n){return !me?0.85:(n===me?1:0.5)})}

function barFig(o,color,f,yt,opt){opt=opt||{};var r=rows(o,opt.keepZero);var names=r.map(function(x){return x[0]}),v=r.map(function(x){return x[1]});
  var md=med(v)||0;
  var data=[{type:'bar',x:names,y:v,marker:{color:opt.colors?opt.colors(r):hlColors(names,color),opacity:hlOp(names),line:{width:0}},
    hovertemplate:'<b>%{x}</b><br>%{y'+hf(f)+'}<extra></extra>'}];
  var shapes=[{type:'line',xref:'paper',x0:0,x1:1,y0:md,y1:md,line:{color:C.muted,width:1,dash:'dot'}}];
  var ann=[{xref:'paper',x:1,y:md,yanchor:'bottom',xanchor:'right',showarrow:false,text:t('median')+' '+fmt(md,f),font:{size:11,color:C.muted}}];
  if(opt.soll) shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:1,y1:1,line:{color:C.accent,width:1,dash:'dash'}});
  if(opt.noMedian){shapes=[];ann=[]}
  var i=names.indexOf(me);
  if(i>=0) ann.push({x:me,y:v[i],yanchor:v[i]<0?'top':'bottom',showarrow:false,text:'▼',font:{color:'#fff',size:12},yshift:v[i]<0?-2:2});
  return {data:data,layout:lay({xaxis:{tickangle:-60,tickfont:{size:11},gridcolor:'rgba(0,0,0,0)',tickvals:names,ticktext:names.map(function(n){return n===me?'<b>'+n+'</b>':n})},
    yaxis:{title:{text:L(yt)||'',font:{color:C.muted,size:11}},tickformat:f==='p'?'.0%':undefined,zeroline:!!opt.zero,zerolinecolor:C.muted},shapes:shapes,annotations:ann})}}

function heat(id,names,cols,z,txt,scale,hoverUnit,opt){opt=opt||{};
  var el=document.getElementById(id); if(el) el.style.height=Math.max(opt.min||320,17*names.length+70)+'px';
  plot(id,{data:[{type:'heatmap',z:z,x:cols,y:names.map(ylab),text:txt,texttemplate:opt.showText?'%{text}':undefined,textfont:{size:10},
     xgap:2,ygap:1,colorscale:scale,zmin:opt.zmin,zmax:opt.zmax,zmid:opt.zmid,colorbar:{thickness:10,outlinewidth:0,tickfont:{color:C.muted}},
     hovertemplate:'<b>%{y}</b> · %{x}<br>%{text} '+(hoverUnit||'')+'<extra></extra>'}],
    layout:lay({margin:{l:80,r:10,t:10,b:30},xaxis:{type:'category',side:'top',gridcolor:'rgba(0,0,0,0)'},yaxis:{gridcolor:'rgba(0,0,0,0)',tickfont:{size:10}}})},'y')}
var SC_AMBER=[[0,'#1a1a1a'],[0.25,'#3b2f17'],[0.6,'#b7832a'],[1,'#ffd27a']];
function sc(c){return [[0,'#1a1a1a'],[1,c]]}

function kpi(label,value,unit,sub,color){return '<div class="kpi" style="--c:var(--'+(color||'accent')+')"><div class="t">'+label+'</div><div class="v">'+value+
  '<small>'+(unit||'')+'</small></div><div class="s">'+(sub||'')+'</div></div>'}
function prompt(){return '<div class="kpi pick" style="--c:var(--accent);grid-column:1/-1"><div class="t">'+t('pick_t')+'</div><div class="s" style="font-size:13px;margin-top:6px">'+t('pick_s')+'</div>'+
  '<div style="margin-top:10px"><select class="sel me-dup" aria-label="me"></select></div></div>'}
function fillSel(sel,list,cur,blank){sel.innerHTML=(blank?'<option value="">'+t('none')+'</option>':'')+list.map(function(n){return '<option'+(n===cur?' selected':'')+'>'+esc(n)+'</option>'}).join('');}
function wireDup(){[].forEach.call(document.querySelectorAll('.me-dup'),function(s){fillSel(s,D.names,me,true);s.onchange=function(){setMe(s.value)}})}

/* ── Sprache & „Ich bin“ ──────────────────────────────────────── */
function setLang(l){lang=l;document.documentElement.setAttribute('data-lang',l);document.documentElement.lang=l;LS.set('sarme_lang',l);
  var tt=document.documentElement.getAttribute('data-title-'+l); if(tt) document.title=tt; header(); render();}
function setMe(n){me=n||'';LS.set('sarme_me',me);header();render();}
function header(){[].forEach.call(document.querySelectorAll('.langsw button'),function(b){b.classList.toggle('on',b.getAttribute('data-l')===lang)});
  var s=document.getElementById('me-sel'); if(s) fillSel(s,D.names,me,true);
  var lab=document.getElementById('me-lab'); if(lab) lab.textContent=lang==='it'?'Io sono':'Ich bin';}
function initHeader(){[].forEach.call(document.querySelectorAll('.langsw button'),function(b){b.onclick=function(){setLang(b.getAttribute('data-l'))}});
  var s=document.getElementById('me-sel'); if(s) s.onchange=function(){setMe(s.value)};
  var tt=document.documentElement.getAttribute('data-title-'+lang); if(tt) document.title=tt;
  document.querySelectorAll('.nav .dd>button').forEach(function(b){b.addEventListener('click',function(e){var li=b.parentElement,o=li.classList.contains('open');
    document.querySelectorAll('.nav .dd.open').forEach(function(x){x.classList.remove('open')});if(!o)li.classList.add('open');e.stopPropagation();});});
  document.addEventListener('click',function(){document.querySelectorAll('.nav .dd.open').forEach(function(x){x.classList.remove('open')})});
  header();}

/* ── Gemeinsame Bausteine ─────────────────────────────────────── */
function catStack(y){var tm=yd(y).meta.team_monat,mon=L(T.mon),cc={tag:C.sar,nacht:C.nacht,natag:C.na,nanacht:C.az};
  return {data:['tag','nacht','natag','nanacht'].map(function(k){return {type:'bar',name:t('c_'+k),x:mon,y:tm[k],marker:{color:cc[k]},hovertemplate:t('c_'+k)+': %{y}<extra></extra>'}}),
    layout:lay({barmode:'stack',showlegend:true,margin:{l:48,r:10,t:10,b:40},legend:{orientation:'h',x:0,y:1.14,font:{color:C.muted}},hovermode:'x unified',
      yaxis:{title:{text:t('m_d12'),font:{color:C.muted,size:11}}}})}}
function yearsStack(){var cc={tag:C.sar,nacht:C.nacht,natag:C.na,nanacht:C.az},xs=Y.map(String);
  return {data:['tag','nacht','natag','nanacht'].map(function(k){return {type:'bar',name:t('c_'+k),x:xs,y:Y.map(function(y){return yd(y).meta.cats[k]}),marker:{color:cc[k]},hovertemplate:t('c_'+k)+': %{y}<extra></extra>'}}),
    layout:lay({barmode:'stack',showlegend:true,margin:{l:48,r:10,t:10,b:40},legend:{orientation:'h',x:0,y:1.14,font:{color:C.muted}},xaxis:{type:'category'},hovermode:'x unified',
      yaxis:{title:{text:t('m_d12'),font:{color:C.muted,size:11}}}})}}
function monthHeat(id,y){var o=yd(y).monat,ns=Object.keys(o).sort(function(a,b){return sumO(o[a])-sumO(o[b])});
  heat(id,ns,L(T.mon),ns.map(function(n){return o[n]}),ns.map(function(n){return o[n]}),SC_AMBER,t('shifts'))}
function meKpis(el,y,list){ var Y_=yd(y);
  if(!me){el.innerHTML=prompt();wireDup();return}
  if(!Y_.m.gesamtdienste[me]){el.innerHTML='<div class="kpi" style="grid-column:1/-1"><div class="s" style="font-size:13px"><b>'+esc(me)+'</b> '+t('notin')+'</div></div>';return}
  var pi=Y.indexOf(+y), py=pi>0?Y[pi-1]:null;
  el.innerHTML=list.map(function(c){var o=mv(y,c.k,c.azv),v=o[me],r=rankIn(o,me),pv=py?mv(py,c.k,c.azv)[me]:null;
    return kpi(L(c.l),fmt(v,c.f),c.f==='h'?'h':'',(py?delta(v,pv,c.inv)+' '+t('vs')+' '+py+'<br>':'')+(r?t('rank')+' '+r[0]+' '+t('of')+' '+r[1]+' · ':'')+t('median')+' '+fmt(med(vals(o)),c.f),c.c)}).join('');}

/* ── Seiten ───────────────────────────────────────────────────── */
var PAGES={};

PAGES.main=function(){var y=YL,py=Y.length>1?Y[Y.length-2]:null,M=yd(y).m,P=py?yd(py).m:null,meta=yd(y).meta;
  function s(k,m){return m?sumO(m[k]):null}
  document.getElementById('team-h').innerHTML=t('team')+' '+y+(py?' <span class="note">· '+(lang==='it'?'variazione rispetto al ':'Veränderung gegenüber ')+py+'</span>':'');
  document.getElementById('team-kpis').innerHTML=
    kpi(t('k_hours'),fmt(s('gesamtstunden',M)),'h',delta(s('gesamtstunden',M),s('gesamtstunden',P))+' '+t('vs')+' '+t('prev')+'<br>'+Object.keys(M.gesamtdienste).length+' '+t('people'),'accent')+
    kpi(t('k_d12'),fmt(s('d12',M)),'',delta(s('d12',M),s('d12',P))+' '+t('vs')+' '+t('prev')+'<br>'+t('k_day')+' '+fmt(s('tag_gesamt',M))+' · '+t('k_night')+' '+fmt(s('nacht_gesamt',M)),'sar')+
    kpi(t('k_na'),fmt(s('na_dienste',M)),'',delta(s('na_dienste',M),s('na_dienste',P))+' '+t('vs')+' '+t('prev')+'<br>'+t('k_naf')+' '+fmt(s('na_feiertag',M)),'na')+
    kpi(t('k_ot'),fmt(s('ueberstunden',M)),'h',delta(s('ueberstunden',M),s('ueberstunden',P),true)+' '+t('vs')+' '+t('prev')+'<br>'+t('k_ot_s'),'az')+
    kpi(t('k_calt'),meta.feiertage,t('k_cal'),t('k_cal_s')+' · '+meta.werktage+' '+t('k_wt')+'<br>'+t('k_last')+' '+meta.last,'frei');
  document.getElementById('me-h').innerHTML=t('mine')+' '+y+(me?' · '+esc(me):'');
  meKpis(document.getElementById('me-kpis'),y,[
    {k:'gesamtstunden',l:T.m_hours,f:'h',c:'accent'},{k:'ueberstunden',l:T.m_ot,f:'h',c:'az',azv:true},
    {k:'nacht_gesamt',l:T.m_night,f:'n',c:'nacht'},{k:'dienste_an_feiertagen',l:T.m_hol,f:'n',c:'frei'},{k:'na_dienste',l:T.m_na,f:'d',c:'na'}]);
  plot('p-ov-stunden',barFig(M.gesamtstunden,C.accent,'h',T.hours),'x');
  plot('p-ov-team',catStack(y));
  plot('p-ov-nacht',barFig(M.nacht_gesamt,C.nacht,'n',T.shifts),'x');
  plot('p-ov-jahre',yearsStack());
  var fs=yd(y).fair.dienste_an_feiertagen,o={};for(var a in fs)o[a]=fs[a][0]-fs[a][1];
  plot('p-ov-fair',barFig(o,C.az,'d',{de:'Bilanz Feiertagsdienste',it:'Saldo turni festivi'},{keepZero:true,noMedian:true,zero:true,colors:fairColors}),'x');
  var img=document.getElementById('hero-img'); if(img&&!img.style.backgroundImage&&PG.images&&PG.images.length) img.style.backgroundImage="url('"+PG.images[Math.floor(Math.random()*PG.images.length)]+"')";
};
function fairColors(r){return r.map(function(x){return x[0]===me?'#ffffff':(x[1]>=0?C.accent:C.nacht)})}

PAGES.year=function(){var y=PG.year,cs=PG.charts;
  document.getElementById('me-h').innerHTML=(me?esc(me)+' '+t('inteam'):t('pick_t'));
  meKpis(document.getElementById('me-kpis'),y,cs.slice(0,4).map(function(c){return {k:c.k,l:c.t,f:c.f,azv:c.azv,c:PG.color,inv:c.k==='ueberstunden'}}));
  cs.forEach(function(c){plot('p-'+c.k,barFig(mv(y,c.k,c.azv),C[PG.color],c.f,c.yt,{soll:c.soll}),'x')});
  if(document.getElementById('p-monate')) monthHeat('p-monate',y);
};

PAGES.vergleich=function(){
  var th='<tr><th>'+t('tbl_year')+'</th><th>'+t('tbl_hours')+'</th><th>'+t('m_d12')+'</th><th>'+t('m_night')+'</th><th>'+t('m_na')+'</th><th>'+t('tbl_ot')+'</th><th>'+t('tbl_ppl')+'</th><th>'+t('tbl_hol')+'</th></tr>';
  document.getElementById('v-tbl').innerHTML=th+Y.map(function(y){var M=yd(y).m;return '<tr><td>'+y+'</td><td>'+fmt(sumO(M.gesamtstunden))+'</td><td>'+fmt(sumO(M.d12))+'</td><td>'+fmt(sumO(M.nacht_gesamt))+
    '</td><td>'+fmt(sumO(M.na_dienste))+'</td><td>'+fmt(sumO(M.ueberstunden))+'</td><td>'+Object.keys(M.gesamtdienste).length+'</td><td>'+yd(y).meta.feiertage+'</td></tr>'}).join('');
  plot('p-v-stack',yearsStack());
  var data=Y.map(function(y){var o=mv(y,'gesamtstunden',true),ns=Object.keys(o);return {type:'box',name:String(y),y:ns.map(function(n){return o[n]}),text:ns,customdata:ns,boxpoints:'all',jitter:0.4,pointpos:0,
     marker:{color:C.accent,size:5,opacity:0.55},line:{color:C.accent,width:1},fillcolor:'rgba(245,184,61,.12)',hovertemplate:'<b>%{text}</b><br>%{y:,.0f} h<extra></extra>'}});
  if(me) data.push({type:'scatter',mode:'lines+markers',name:me,x:Y.map(String),y:Y.map(function(y){var v=yd(y).m.gesamtstunden[me];return v==null?null:v}),
     line:{color:'#fff',width:2},marker:{size:9,color:'#fff'},hovertemplate:'<b>'+me+'</b> %{x}<br>%{y:,.0f} h<extra></extra>'});
  plot('p-v-box',{data:data,layout:lay({margin:{l:56,r:10,t:10,b:40},xaxis:{type:'category'},yaxis:{title:{text:t('m_hours'),font:{color:C.muted,size:11}}}})},'cd');
  [['gesamtstunden','h',C.accent,false],['az_feiertag','r',C.az,true],['nacht_gesamt','n',C.nacht,false],['top_feiertage','n',C.frei,false]].forEach(function(s){
    var k=s[0],ns={};Y.forEach(function(y){var o=mv(y,k,s[3]);for(var a in o) if(o[a]) ns[a]=(ns[a]||0)+1});
    var list=Object.keys(ns).filter(function(a){return ns[a]>=2});
    function avg(a){var x=Y.map(function(y){return mv(y,k,s[3])[a]}).filter(function(v){return v!=null});return x.reduce(function(p,c){return p+c},0)/x.length}
    list.sort(function(a,b){return avg(a)-avg(b)});
    var z=list.map(function(a){return Y.map(function(y){var v=mv(y,k,s[3])[a];return v==null?null:v})});
    heat('p-v-'+k,list,Y.map(String),z,z.map(function(r){return r.map(function(v){return fmt(v,s[1])})}),sc(s[2]),'',{showText:true});
  });
};

PAGES.analysen=function(){
  var yr=PG._y||YL, cat=PG._c||'dienste_an_feiertagen';
  segs('an-year',Y,yr,function(v){PG._y=v;render()});
  segs('an-cat',['dienste_an_feiertagen','nacht_gesamt','wochenende','top_feiertage','d12'],cat,function(v){PG._c=v;render()},function(k){return t('f_'+k)});
  // A: kumulierte Fair-Share-Bilanz
  var bal={},actS={},expS={};Y.forEach(function(y){var f=yd(y).fair[cat];for(var a in f){bal[a]=(bal[a]||0)+f[a][0]-f[a][1];actS[a]=(actS[a]||0)+f[a][0];expS[a]=(expS[a]||0)+f[a][1]}});
  var fb=barFig(bal,C.accent,'d',{de:'Bilanz (Dienste)',it:'Saldo (turni)'},{keepZero:true,noMedian:true,zero:true,colors:fairColors});
  fb.data[0].customdata=rows(bal,true).map(function(x){return [fmt(actS[x[0]]),fmt(expS[x[0]],'d')]});
  fb.data[0].hovertemplate='<b>%{x}</b><br>'+t('diff')+' %{y:+.1f}<br>'+t('act')+' %{customdata[0]} · '+t('exp')+' %{customdata[1]}<extra></extra>';
  plot('p-an-fair',fb,'x');
  // B: Gini
  var gk=['nacht_gesamt','dienste_an_feiertagen','wochenende','top_feiertage','d12'],gc=[C.nacht,C.az,C.sar,C.frei,C.accent];
  plot('p-an-gini',{data:gk.map(function(k,i){return {type:'scatter',mode:'lines+markers',name:t('f_'+k),x:Y.map(String),y:Y.map(function(y){return yd(y).gini[k]}),line:{color:gc[i],width:k===cat?3:1.5},marker:{size:k===cat?9:6},
     hovertemplate:t('f_'+k)+' %{y:.2f}<extra></extra>'}}),layout:lay({showlegend:true,margin:{l:48,r:10,t:10,b:40},legend:{orientation:'h',x:0,y:1.16,font:{color:C.muted}},
     xaxis:{type:'category'},hovermode:'x unified',yaxis:{title:{text:t('gini'),font:{color:C.muted,size:11}},rangemode:'tozero'}})});
  // C: Top-Feiertage Person × Jahr
  var ns={};Y.forEach(function(y){var o=yd(y).m.top_feiertage||{};for(var a in o) if(o[a]) ns[a]=1});
  var list=Object.keys(ns).sort(function(a,b){return tot(b)-tot(a)}).reverse();
  function tot(a){return Y.reduce(function(s,y){return s+((yd(y).m.top_feiertage||{})[a]||0)},0)}
  var z=list.map(function(a){return Y.map(function(y){return (yd(y).m.top_feiertage||{})[a]||0})});
  var txt=list.map(function(a){return Y.map(function(y){var l=(yd(y).top[a]||[]);return l.length?l.map(function(x){return t('hol_'+x[0])+' ('+t('sh_'+x[1])+')'}).join(', '):t('none_hol')})});
  var cols=Y.map(String).concat([t('sum')]); z=z.map(function(r){return r.concat([r.reduce(function(p,c){return p+c},0)])});
  txt=txt.map(function(r,i){return r.concat([String(z[i][Y.length])])});
  heat('p-an-top',list,cols,z,txt,sc(C.frei),'',{});
  // D: Wochentage (Anteil an 12-h-Diensten) im gewählten Jahr
  var w=yd(yr).wd,wn=Object.keys(w).filter(function(a){return sumO(w[a])>=20});
  function we(a){var s=sumO(w[a]);return (w[a][4]+w[a][5]+w[a][6])/s}
  wn.sort(function(a,b){return we(a)-we(b)});
  heat('p-an-wd',wn,L(T.wd).concat([t('share_we')]),wn.map(function(a){var s=sumO(w[a]);return w[a].map(function(v){return v/s}).concat([we(a)])}),
     wn.map(function(a){var s=sumO(w[a]);return w[a].map(function(v){return v+' ('+Math.round(v/s*100)+' %)'}).concat([Math.round(we(a)*100)+' %'])}),SC_AMBER,'',{});
  // E: Einsatz-Mix (100 %)
  var mx=yd(yr).mix,mn=Object.keys(mx).filter(function(a){return yd(yr).m.gesamtdienste[a]>=30});
  var order=['op','icu','spaet','optag','tag','nacht','natag','nanacht','ber'];
  function share(a,k){var s=0;order.forEach(function(x){s+=mx[a][x]||0});return (mx[a][k]||0)/s}
  mn.sort(function(a,b){return (share(a,'nacht')+share(a,'nanacht'))-(share(b,'nacht')+share(b,'nanacht'))});
  var el=document.getElementById('p-an-mix'); if(el) el.style.height=Math.max(360,18*mn.length+90)+'px';
  plot('p-an-mix',{data:order.map(function(k){return {type:'bar',orientation:'h',name:t('mix_'+k),y:mn.map(ylab),x:mn.map(function(a){return share(a,k)}),marker:{color:MIXC[k]},
     customdata:mn.map(function(a){return mx[a][k]||0}),hovertemplate:'<b>%{y}</b> · '+t('mix_'+k)+'<br>%{customdata} ('+'%{x:.0%})<extra></extra>'}}),
    layout:lay({barmode:'stack',showlegend:true,margin:{l:80,r:10,t:70,b:40},legend:{orientation:'h',x:0,y:1,yanchor:'bottom',font:{color:C.muted},traceorder:'normal'},
      xaxis:{tickformat:'.0%',range:[0,1],gridcolor:C.line},yaxis:{gridcolor:'rgba(0,0,0,0)',tickfont:{size:10}},bargap:0.2})},'y');
  // F: Sommer, G: dienstfreie Zeit, H: Freitagsnächte
  plot('p-an-sommer',barFig(mv(yr,'sommer'),C.frei,'n',T.shifts),'x');
  plot('p-an-gap',barFig(mv(yr,'dienstfrei_max'),C.sar,'n',{de:'Tage',it:'Giorni'}),'x');
  plot('p-an-frn',barFig(mv(yr,'fr_nacht'),C.nacht,'n',T.shifts),'x');
  plot('p-an-weih',barFig(mv(yr,'weihnacht'),C.na,'n',T.shifts),'x');
};
function segs(id,list,cur,cb,lab){var el=document.getElementById(id);if(!el)return;
  el.innerHTML=list.map(function(v){return '<button type="button" class="'+(String(v)===String(cur)?'on':'')+'" data-v="'+v+'">'+(lab?lab(v):v)+'</button>'}).join('');
  [].forEach.call(el.children,function(b){b.onclick=function(){var v=b.getAttribute('data-v');cb(isNaN(+v)?v:+v)}})}

PAGES.profil=function(){
  var who=PG._who||me||D.names[0]; if(D.names.indexOf(who)<0) who=D.names[0];
  var sel=document.getElementById('arzt'); fillSel(sel,D.names,who,false); sel.onchange=function(){PG._who=sel.value;render()};
  var mb=document.getElementById('arzt-me'); mb.style.display=(who===me?'none':''); mb.textContent=lang==='it'?'Sono io – evidenziami':'Das bin ich – hervorheben';
  mb.onclick=function(){setMe(who)};
  var yrs=Y.filter(function(y){return yd(y).m.gesamtdienste[who]}); var yr=PG._y&&yrs.indexOf(PG._y)>=0?PG._y:yrs[yrs.length-1];
  segs('jahr',yrs,yr,function(v){PG._y=v;render()});
  var Y_=yd(yr),azv=Y_.azv[who];
  document.getElementById('kpi-h').innerHTML=esc(who)+' · '+yr+' <span class="note">· '+t('azv')+' '+(azv==null?t('azv_none'):Math.round(azv*100)+' %')+'</span>';
  var save=me; me=who; // eigene KPI-Logik nutzt "me"
  meKpis(document.getElementById('kpis'),yr,[{k:'gesamtstunden',l:T.m_hours,f:'h',c:'accent'},{k:'ueberstunden',l:T.m_ot,f:'h',c:'az',azv:true},
    {k:'d12',l:T.m_d12,f:'n',c:'sar'},{k:'nacht_gesamt',l:T.m_night,f:'n',c:'nacht'},{k:'dienste_an_feiertagen',l:T.m_hol,f:'n',c:'frei'},{k:'na_dienste',l:T.m_na,f:'d',c:'na'}]);
  // Steckbrief
  var mx=Y_.mix[who]||{},top=null;for(var k in mx) if(!top||mx[k]>mx[top]) top=k;
  var pa=(Y_.partners[who]||[]);
  var fair=Y_.fair, fb=function(c){var f=fair[c][who];return f?(f[0]-f[1]):null};
  function chip(v){return v==null?'':'<span class="'+(v>0.5?'up':(v<-0.5?'down':'flat'))+'">'+(v>0?'+':'')+fmt(v,'d')+'</span> '+t('vs')+' '+t('exp')}
  var mg=mv(yr,'dienstfrei_max'),ms=mv(yr,'serie_max'),mw=mv(yr,'wochenende'),mt=mv(yr,'top_feiertage');
  document.getElementById('steck').innerHTML=
    kpi(t('mainarea'),top?t('mix_'+top):'–','',top?Math.round(mx[top]/sumO(mx)*100)+' % · '+mx[top]+' '+t('shifts'):'','sar')+
    kpi(t('m_we'),fmt(mw[who]),'',chip(fb('wochenende'))+'<br>'+t('median')+' '+fmt(med(vals(mw))),'accent')+
    kpi(t('m_top'),fmt(mt[who]||0),'',chip(fb('top_feiertage'))+'<br>'+((Y_.top[who]||[]).map(function(x){return t('hol_'+x[0])}).join(', ')||t('none_hol')),'frei')+
    kpi(t('m_gap'),fmt(mg[who]),' '+t('days'),t('median')+' '+fmt(med(vals(mg)))+' '+t('days'),'nacht')+
    kpi(t('m_ser'),fmt(ms[who]),' '+t('days'),t('median')+' '+fmt(med(vals(ms)))+' '+t('days'),'na')+
    kpi(t('partner'),pa.length?esc(pa[0][0]):'–','',pa.slice(0,3).map(function(p){return esc(p[0])+' '+p[1]+'×'}).join(' · '),'az')+
    kpi(t('na_ex'),azv>=1?fmt(Y_.m.na_ex_w[who],'d'):'–',' '+t('eq12'),azv>=1?(lang==='it'?'Stima, regola settimanale':'Schätzung, Wochenregel')+'<br>'+t('avg_ft')+' '+fmt(avgOf(yr,'na_ex_w',function(a){return isFT(yr,a)&&act6(yr,a)}),'d'):t('tz')+': '+(lang==='it'?'Notarzt solo timbrato':'Notarzt nur gestempelt'),'na')+
    kpi(t('paid'),azv!=null?fmt(Y_.m.paid_w[who],'d'):'–',' '+t('eq12'),(lang==='it'?'Stima, regola settimanale':'Schätzung, Wochenregel')+'<br>'+t('avg_h')+' '+fmt(avgOf(yr,'paid_w',function(a){return yd(yr).azv[a]!=null&&act6(yr,a)}),'d'),'sar')+
    kpi(t('sal'),Y_.m.nachtsaldo&&Y_.m.nachtsaldo[who]!=null?((Y_.m.nachtsaldo[who]>0?'+':'')+fmt(Y_.m.nachtsaldo[who])):'–',' h',Y_.m.saldo_pro_nacht&&Y_.m.saldo_pro_nacht[who]!=null?((Y_.m.saldo_pro_nacht[who]>0?'+':'')+fmt(Y_.m.saldo_pro_nacht[who],'d')+' '+t('salpn')+' · '+t('median')+' '+fmt(med(vals(Y_.m.saldo_pro_nacht)),'d')):'','nacht');
  // Verlauf
  var msel=document.getElementById('metric'), MET=PG.metrics, mk=msel.value||MET[0].k;
  msel.innerHTML=MET.map(function(m){return '<option value="'+m.k+'"'+(m.k===mk?' selected':'')+'>'+L(m.l)+'</option>'}).join(''); msel.onchange=render;
  var m=MET.filter(function(x){return x.k===mk})[0], xs=Y.map(String);
  var va=function(y){return vals(mv(y,m.k,m.azv)).filter(function(v){return v!==0||m.k==='ueberstunden'})};
  document.getElementById('vl-t').textContent=L(m.l)+' · '+who;
  plot('p-verlauf',{data:[
    {type:'scatter',x:xs,y:Y.map(function(y){return q(va(y),.75)}),mode:'lines',line:{width:0},hoverinfo:'skip',showlegend:false},
    {type:'scatter',x:xs,y:Y.map(function(y){return q(va(y),.25)}),mode:'lines',line:{width:0},fill:'tonexty',fillcolor:'rgba(245,184,61,.12)',name:t('p2575'),hoverinfo:'skip'},
    {type:'scatter',x:xs,y:Y.map(function(y){return med(va(y))}),mode:'lines+markers',name:t('median')+' '+t('team'),line:{color:C.muted,dash:'dot',width:1.5},marker:{size:6},hovertemplate:t('median')+' %{y'+hf(m.f)+'}<extra></extra>'},
    {type:'scatter',x:xs,y:Y.map(function(y){var v=mv(y,m.k,m.azv)[who];return v==null?null:v}),mode:'lines+markers',name:who,line:{color:'#fff',width:2.5},marker:{size:10,color:'#fff'},hovertemplate:who+' %{y'+hf(m.f)+'}<extra></extra>'}],
    layout:lay({margin:{l:56,r:16,t:10,b:40},hovermode:'x unified',showlegend:true,legend:{orientation:'h',x:0,y:1.14,font:{color:C.muted}},xaxis:{type:'category',gridcolor:'rgba(0,0,0,0)'},
      yaxis:{title:{text:L(m.l),font:{color:C.muted,size:11}},tickformat:m.f==='r'?'.2f':undefined}})});
  // Einsatz-Mix (Donut)
  var order=['op','icu','spaet','optag','tag','nacht','natag','nanacht','ber'].filter(function(k){return mx[k]});
  plot('p-mix',{data:[{type:'pie',hole:0.55,labels:order.map(function(k){return t('mix_'+k)}),values:order.map(function(k){return mx[k]}),sort:false,direction:'clockwise',
    marker:{colors:order.map(function(k){return MIXC[k]}),line:{color:'#1a1a1a',width:2}},textinfo:'percent',textfont:{color:'#111'},hovertemplate:'%{label}: %{value} (%{percent})<extra></extra>'}],
    layout:lay({showlegend:true,margin:{l:10,r:10,t:10,b:10},legend:{font:{color:C.muted}}})});
  // Wochentage: Person vs Team (Anteil)
  var w=Y_.wd, pw=w[who]||[0,0,0,0,0,0,0], ps=sumO(pw)||1, tw=[0,0,0,0,0,0,0];
  for(var a in w) w[a].forEach(function(v,i){tw[i]+=v}); var ts=tw.reduce(function(p,c){return p+c},0)||1;
  plot('p-wd',{data:[{type:'bar',name:who,x:L(T.wd),y:pw.map(function(v){return v/ps}),customdata:pw,marker:{color:'#fff'},hovertemplate:who+': %{customdata} (%{y:.0%})<extra></extra>'},
    {type:'bar',name:t('team_avg'),x:L(T.wd),y:tw.map(function(v){return v/ts}),marker:{color:C.accent,opacity:0.6},hovertemplate:t('team_avg')+': %{y:.0%}<extra></extra>'}],
    layout:lay({barmode:'group',showlegend:true,margin:{l:48,r:10,t:10,b:40},legend:{orientation:'h',x:0,y:1.14,font:{color:C.muted}},yaxis:{tickformat:'.0%'},hovermode:'x unified'})});
  // Monate
  var mo=(Y_.monat[who]||[]);
  plot('p-mon',{data:[{type:'bar',x:L(T.mon),y:mo,marker:{color:C.sar},hovertemplate:'%{x}: %{y}<extra></extra>'}],
    layout:lay({margin:{l:40,r:10,t:10,b:40},yaxis:{title:{text:t('m_d12'),font:{color:C.muted,size:11}}}})});
  // Fair-Share-Tabelle über alle Jahre
  var cats=['nacht_gesamt','dienste_an_feiertagen','wochenende','top_feiertage','d12','na_in_w','na_ex_w','paid_w'];
  var h='<tr><th></th>'+Y.map(function(y){return '<th>'+y+'</th>'}).join('')+'<th>'+t('sum')+'</th></tr>';
  cats.forEach(function(c){var s=0,any=false;h+='<tr><td>'+t('f_'+c)+'</td>'+Y.map(function(y){var f=(yd(y).fair[c]||{})[who];if(!f)return '<td>–</td>';any=true;var d=f[0]-f[1];s+=d;
     return '<td>'+fmt(f[0],c.indexOf('na_')===0||c.indexOf('paid')===0?'d':'n')+' <span class="rk">/ '+fmt(f[1],'d')+'</span> <span class="'+(d>0.5?'up':(d<-0.5?'down':'flat'))+'">'+(d>0?'+':'')+fmt(d,'d')+'</span></td>'}).join('')+
     '<td><b class="'+(s>0.5?'up':(s<-0.5?'down':'flat'))+'">'+(any?(s>0?'+':'')+fmt(s,'d'):'–')+'</b></td></tr>'});
  document.getElementById('fair-tbl').innerHTML=h;
  // Top-Feiertage Liste
  document.getElementById('top-list').innerHTML=Y.map(function(y){var l=yd(y).top[who]||[];return '<div class="hrow"><b>'+y+'</b>'+(l.length?l.map(function(x){
     return '<span class="chip '+x[1]+'">'+t('hol_'+x[0])+' · '+t('sh_'+x[1])+'</span>'}).join(''):'<span class="flat">'+t('none_hol')+'</span>')+'</div>'}).join('');
  // Partner
  document.getElementById('partner').innerHTML=pa.length?pa.map(function(p,i){var mxp=pa[0][1];return '<div class="prow"><span>'+(i+1)+'. '+esc(p[0])+'</span><span class="pbar"><i style="width:'+(p[1]/mxp*100)+'%"></i></span><span>'+p[1]+'</span></div>'}).join(''):'<p>'+t('nodata')+'</p>';
  // Tabelle aller Kennzahlen
  var tb='<tr><th>'+t('metric')+'</th>'+Y.map(function(y){return '<th>'+y+'</th>'}).join('')+'</tr>';
  MET.forEach(function(m){tb+='<tr><td>'+L(m.l)+'</td>'+Y.map(function(y){var o=mv(y,m.k,m.azv),v=o[who],r=rankIn(o,who);
     return '<td>'+fmt(v,m.f)+(r?'<span class="rk">#'+r[0]+'</span>':'')+'</td>'}).join('')+'</tr>'});
  document.getElementById('tbl').innerHTML=tb;
  me=save;
};

/* ── Notarzt & Mehrarbeit ─────────────────────────────────────── */
var TM={
 v_w:{de:'Wochenregel',it:'Regola settimanale'}, v_j:{de:'Jahresbilanz',it:'Bilancio annuale'},
 na_in:{de:'NA gestempelt',it:'NA timbrato'}, na_ex:{de:'NA freiberuflich (intramoenia)',it:'NA intramoenia'},
 na_in_tag:{de:'NA Tag gestempelt',it:'NA giorno timbrato'}, na_in_nacht:{de:'NA Nacht gestempelt',it:'NA notte timbrato'},
 na_ex_tag:{de:'NA Tag freiberuflich',it:'NA giorno intramoenia'}, na_ex_nacht:{de:'NA Nacht freiberuflich',it:'NA notte intramoenia'},
 paid:{de:'Ausbezahlte Dienste (guardie pagate)',it:'Guardie pagate'}, k_naex:{de:'Ø NA intramoenia je Vollzeit',it:'Ø NA intramoenia per tempo pieno'},
 k_paid:{de:'Ø ausbezahlte Dienste je Kopf',it:'Ø guardie pagate per persona'}, k_sal:{de:'Ø Nachtsaldo je Nacht',it:'Ø saldo per notte'},
 k_nain:{de:'Ø NA gestempelt je 100 % AZV',it:'Ø NA timbrato per 100 % contratto'},
 tot:{de:'Team gesamt',it:'Totale team'}, ft:{de:'Vollzeitkräfte',it:'persone a tempo pieno'}, heads:{de:'Personen mit AZV',it:'persone con contratto'},
 eq12:{de:'12-h-Dienste',it:'turni da 12 h'}, my:{de:'Ich',it:'Io'}, tz:{de:'Teilzeit',it:'tempo parziale'},
 sal:{de:'Nachtsaldo (Stunden)',it:'Saldo notti (ore)'}, salpn:{de:'Stunden je Nacht',it:'ore per notte'},
 plusn:{de:'Nächte auf Wochenende/Feiertag',it:'Notti su weekend/festivo'}, minusn:{de:'Nächte Mo–Do',it:'Notti lun–gio'},
 f_na_in_w:{de:'NA gestempelt',it:'NA timbrato'}, f_na_in_j:{de:'NA gestempelt',it:'NA timbrato'},
 f_na_ex_w:{de:'NA freiberuflich',it:'NA intramoenia'}, f_na_ex_j:{de:'NA freiberuflich',it:'NA intramoenia'},
 f_paid_w:{de:'Ausbezahlte Dienste',it:'Guardie pagate'}, f_paid_j:{de:'Ausbezahlte Dienste',it:'Guardie pagate'},
 f_na_nacht:{de:'NA-Nächte',it:'Notti NA'}, avg_ft:{de:'Ø je Vollzeit',it:'Ø per tempo pieno'}, avg_h:{de:'Ø je Kopf',it:'Ø per persona'},
 weeks:{de:'Wochen über Soll',it:'Settimane sopra il dovuto'}
};
for(var _k in TM) T[_k]=TM[_k];
function act6(y,a){return (yd(y).m.aktive_monate||{})[a]>=6}
function avgOf(y,key,filt){var o=mv(y,key),s=0,n=0;for(var a in o){if(o[a]==null||!filt(a))continue;s+=o[a];n++}return n?s/n:null}
function isFT(y,a){return yd(y).azv[a]>=1}

PAGES.mehr=function(){
  var v=PG._v||'w', yr=PG._y||YL, fc=PG._f||'na_ex';
  segs('m-var',['w','j'],v,function(x){PG._v=x;render()},function(x){return t('v_'+x)});
  segs('m-year',Y,yr,function(x){PG._y=x;render()});
  [].forEach.call(document.querySelectorAll('.var-note'),function(el){el.style.display=el.getAttribute('data-v')===v?'':'none'});
  var Yd=yd(yr), M=Yd.m;
  // KPIs
  var ftN=Object.keys(M.gesamtdienste).filter(function(a){return isFT(yr,a)&&act6(yr,a)}).length;
  var hN=Object.keys(M.gesamtdienste).filter(function(a){return Yd.azv[a]!=null&&act6(yr,a)}).length;
  var naex=avgOf(yr,'na_ex_'+v,function(a){return isFT(yr,a)&&act6(yr,a)}), paid=avgOf(yr,'paid_'+v,function(a){return Yd.azv[a]!=null&&act6(yr,a)});
  var nain=avgOf(yr,'na_in_azv_'+v,function(a){return Yd.azv[a]!=null&&act6(yr,a)});
  var sal=sumO(M.nachtsaldo||{}), nn=sumO(M.nacht_plus||{})+sumO(M.nacht_minus||{});
  var pi=Y.indexOf(+yr),py=pi>0?Y[pi-1]:null;
  var pv=function(k,f){return py?avgOf(py,k,f):null};
  var h=kpi(t('k_naex'),fmt(naex,'d'),' '+t('eq12'),(py?delta(naex,pv('na_ex_'+v,function(a){return isFT(py,a)&&act6(py,a)}))+' '+t('vs')+' '+py+'<br>':'')+ftN+' '+t('ft')+' · '+t('tot')+' '+fmt(sumO(mv(yr,'na_ex_'+v)),'n'),'na')+
    kpi(t('k_paid'),fmt(paid,'d'),' '+t('eq12'),(py?delta(paid,pv('paid_'+v,function(a){return yd(py).azv[a]!=null&&act6(py,a)}))+' '+t('vs')+' '+py+'<br>':'')+hN+' '+t('heads')+' · '+t('tot')+' '+fmt(sumO(mv(yr,'paid_'+v)),'n'),'sar')+
    kpi(t('k_nain'),fmt(nain,'d'),' '+t('eq12'),t('median')+' '+fmt(med(vals(mv(yr,'na_in_azv_'+v))),'d'),'az')+
    kpi(t('k_sal'),(sal/nn>0?'+':'')+fmt(sal/nn,'d'),' h',fmt(sumO(M.nacht_minus))+' '+t('minusn')+' · '+fmt(sumO(M.nacht_plus))+' '+t('plusn'),'nacht');
  document.getElementById('m-kpis').innerHTML=h;
  var mk=document.getElementById('m-me');
  if(!me){mk.innerHTML=prompt();wireDup()}
  else if(!M.gesamtdienste[me]){mk.innerHTML='<div class="kpi" style="grid-column:1/-1"><div class="s"><b>'+esc(me)+'</b> '+t('notin')+'</div></div>'}
  else{var rk=function(k){var r=rankIn(mv(yr,k),me);return r?t('rank')+' '+r[0]+' '+t('of')+' '+r[1]:''};
    var sp=M.saldo_pro_nacht?M.saldo_pro_nacht[me]:null;
    mk.innerHTML=kpi(t('na_ex'),isFT(yr,me)?fmt(M['na_ex_'+v][me],'d'):'–',' '+t('eq12'),isFT(yr,me)?rk('na_ex_'+v)+' · '+t('avg_ft')+' '+fmt(naex,'d'):t('tz')+': '+(lang==='it'?'Notarzt solo timbrato':'Notarzt nur gestempelt'),'na')+
      kpi(t('na_in'),fmt(M['na_in_'+v][me],'d'),' '+t('eq12'),(Yd.azv[me]!=null?fmt(M['na_in_azv_'+v][me],'d')+' '+(lang==='it'?'per 100 %':'je 100 %')+' · ':'')+t('median')+' '+fmt(med(vals(mv(yr,'na_in_azv_'+v))),'d'),'az')+
      kpi(t('paid'),fmt(M['paid_'+v][me],'d'),' '+t('eq12'),rk('paid_'+v)+' · '+t('avg_h')+' '+fmt(paid,'d'),'sar')+
      kpi(t('sal'),M.nachtsaldo[me]==null?'–':((M.nachtsaldo[me]>0?'+':'')+fmt(M.nachtsaldo[me])),' h',sp==null?'':((sp>0?'+':'')+fmt(sp,'d')+' '+t('salpn')+' · '+(M.nacht_minus[me]||0)+' '+t('minusn')),'nacht');}
  // A: NA je Person gestapelt
  var nat=M.na_dienste||{}, ns=rows(nat).map(function(x){return x[0]});
  function g(k,a){var o=M[k+'_'+v]||{};return Math.max(0,o[a]||0)}
  var parts=[['na_in_tag','#ff8a65','','#ff8a65'],['na_in_nacht','#c4a7ff','','#c4a7ff'],['na_ex_tag','#6b3a2c','/','#ff8a65'],['na_ex_nacht','#4a4466','/','#c4a7ff']];
  var lab=ns.map(function(a){var z=Yd.azv[a];return (a===me?'<b>'+a+'</b>':a)+(z!=null&&z<1?'*':'')});
  var data=parts.map(function(p){return {type:'bar',name:t(p[0]),x:ns,y:ns.map(function(a){return g(p[0],a)}),
    marker:{color:p[1],opacity:ns.map(function(a){return !me||a===me?1:0.45}),pattern:{shape:p[2],fgcolor:p[3],size:6,solidity:0.45},line:{color:ns.map(function(a){return a===me?'#fff':'rgba(0,0,0,0)'}),width:1.5}},
    hovertemplate:'<b>%{x}</b> · '+t(p[0])+'<br>%{y:.1f}<extra></extra>'}});
  var i=ns.indexOf(me), ann=i>=0?[{x:me,y:nat[me],yanchor:'bottom',showarrow:false,text:'▼',font:{color:'#fff',size:12}}]:[];
  plot('p-m-na',{data:data,layout:lay({barmode:'stack',showlegend:true,legend:{orientation:'h',x:0,y:1,yanchor:'bottom',font:{color:C.muted}},margin:{t:40},
    xaxis:{tickangle:-60,tickvals:ns,ticktext:lab,tickfont:{size:11},gridcolor:'rgba(0,0,0,0)'},yaxis:{title:{text:t('eq12'),font:{color:C.muted,size:11}}},annotations:ann})},'x');
  // B–E
  plot('p-m-nain',barFig(mv(yr,'na_in_azv_'+v,true),C.az,'d',{de:'NA gestempelt ÷ AZV',it:'NA timbrato ÷ contratto'}),'x');
  var ex={},o=mv(yr,'na_ex_'+v);for(var a in o) if(isFT(yr,a)) ex[a]=o[a];
  plot('p-m-naex',barFig(ex,C.na,'d',{de:'12-h-Dienste',it:'Turni da 12 h'}),'x');
  plot('p-m-paid',barFig(mv(yr,'paid_'+v,true),C.sar,'d',{de:'12-h-Dienste',it:'Turni da 12 h'}),'x');
  function minF(o,k,n){var r={},c=mv(yr,k);for(var a in o) if((c[a]||0)>=n) r[a]=o[a];return r}
  plot('p-m-nanacht',barFig(minF(mv(yr,'na_nacht_anteil'),'na_dienste',10),C.az,'p',{de:'Anteil Nächte an NA-Stunden',it:'Quota notti sulle ore NA'}),'x');
  // F: kumulierte Bilanz
  var fopts=['na_in','na_ex','paid','na_nacht'];
  segs('m-fair',fopts,fc,function(x){PG._f=x;render()},function(x){return t('f_'+(x==='na_nacht'?x:x+'_w'))});
  var fk=fc==='na_nacht'?fc:fc+'_'+v,bal={},aS={},eS={};
  Y.forEach(function(y){var f=yd(y).fair[fk]||{};for(var a in f){bal[a]=(bal[a]||0)+f[a][0]-f[a][1];aS[a]=(aS[a]||0)+f[a][0];eS[a]=(eS[a]||0)+f[a][1]}});
  var fb=barFig(bal,C.accent,'d',{de:'Bilanz (12-h-Dienste)',it:'Saldo (turni da 12 h)'},{keepZero:true,noMedian:true,zero:true,colors:fairColors});
  fb.data[0].customdata=rows(bal,true).map(function(x){return [fmt(aS[x[0]],'d'),fmt(eS[x[0]],'d')]});
  fb.data[0].hovertemplate='<b>%{x}</b><br>'+t('diff')+' %{y:+.1f}<br>'+t('act')+' %{customdata[0]} · '+t('exp')+' %{customdata[1]}<extra></extra>';
  plot('p-m-fair',fb,'x');
  // G: Nachtsaldo
  plot('p-m-sal',barFig(M.nachtsaldo||{},C.nacht,'n',{de:'Stunden',it:'Ore'},{keepZero:true,zero:true,colors:fairColors}),'x');
  var nTot={};for(var a in (M.nacht_plus||{})) nTot[a]=(M.nacht_plus[a]||0)+(M.nacht_minus[a]||0);
  var spn={};for(var a in (M.saldo_pro_nacht||{})) if(nTot[a]>=10) spn[a]=M.saldo_pro_nacht[a];
  plot('p-m-salpn',barFig(spn,C.nacht,'d',{de:'Stunden je Nacht',it:'Ore per notte'},{keepZero:true,zero:true,colors:fairColors}),'x');
  // H: Verlauf über die Jahre
  var xs=Y.map(String),ln=[];
  [['na_ex','w',C.na,'solid'],['na_ex','j',C.na,'dot'],['paid','w',C.sar,'solid'],['paid','j',C.sar,'dot']].forEach(function(s){
    ln.push({type:'scatter',mode:'lines+markers',name:(s[0]==='na_ex'?t('k_naex'):t('k_paid'))+' · '+t('v_'+s[1]),x:xs,
      y:Y.map(function(y){return s[0]==='na_ex'?avgOf(y,'na_ex_'+s[1],function(a){return isFT(y,a)&&act6(y,a)}):avgOf(y,'paid_'+s[1],function(a){return yd(y).azv[a]!=null&&act6(y,a)})}),
      line:{color:s[2],dash:s[3],width:s[1]===v?3:1.5},marker:{size:s[1]===v?8:5},hovertemplate:'%{y:.1f}<extra></extra>'})});
  if(me&&Y.some(function(y){return isFT(y,me)})) ln.push({type:'scatter',mode:'lines+markers',name:me+' · '+t('na_ex'),x:xs,y:Y.map(function(y){var o=yd(y).m['na_ex_'+v]||{};return o[me]==null?null:o[me]}),line:{color:'#fff',width:2},marker:{size:8,color:'#fff'}});
  plot('p-m-trend',{data:ln,layout:lay({showlegend:true,margin:{l:48,r:10,t:10,b:40},legend:{orientation:'h',x:0,y:1.2,font:{color:C.muted}},xaxis:{type:'category'},hovermode:'x unified',
    yaxis:{title:{text:t('eq12'),font:{color:C.muted,size:11}},rangemode:'tozero'}})});
  // I: Gini
  var gk=[['na_in_'+v,C.az],['na_ex_'+v,C.na],['paid_'+v,C.sar],['na_nacht',C.nacht]];
  plot('p-m-gini',{data:gk.map(function(s){return {type:'scatter',mode:'lines+markers',name:t('f_'+s[0]),x:xs,y:Y.map(function(y){return yd(y).gini[s[0]]}),line:{color:s[1]},hovertemplate:'%{y:.2f}<extra></extra>'}}),
    layout:lay({showlegend:true,margin:{l:48,r:10,t:10,b:40},legend:{orientation:'h',x:0,y:1.16,font:{color:C.muted}},xaxis:{type:'category'},hovermode:'x unified',
      yaxis:{title:{text:t('gini'),font:{color:C.muted,size:11}},rangemode:'tozero'}})});
};

function render(){ (PAGES[PG.type]||function(){})(); }
initHeader(); render();
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){var s=window.innerWidth<700;if(s!==SMALL){SMALL=s;render()}},250)});
})();
