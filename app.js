import { createElement as h, render, useState, useEffect, useRef } from 'https://esm.sh/preact@10.19.3/compat';

const SUPABASE_URL = "https://doddceilponwoavtkjyc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZGRjZWlscG9ud29hdnRranljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Mzc4MzMsImV4cCI6MjA5NzQxMzgzM30.4dmubOhGPTuZIQHHat9vtQMV2MyuA-pzf2PIt35zSTs";
const ANTHROPIC_KEY = "placeholder_replace_me";

const COLUMNS = [
  { id: "backlog", label: "Backlog",           color: "#9CA3AF", emoji: "📦" },
  { id: "semana",  label: "Fazer essa semana", color: "#2563EB", emoji: "📅" },
  { id: "fazendo", label: "Fazendo",           color: "#D97706", emoji: "⚡" },
  { id: "gargalo", label: "Gargalo",           color: "#DC2626", emoji: "🔴" },
  { id: "feito",   label: "Feito",             color: "#16A34A", emoji: "✅" },
];

const TAG_STYLES = {
  "B2B Farming":        { bg: "#FEE2E2", color: "#991B1B" },
  "B2B Hunting":        { bg: "#EDE9FE", color: "#5B21B6" },
  "Fundadores":         { bg: "#DBEAFE", color: "#1E40AF" },
  "Pessoal":            { bg: "#D1FAE5", color: "#065F46" },
  "Relacionamento B2B": { bg: "#FEF3C7", color: "#92400E" },
  "Conselho":           { bg: "#F0FDF4", color: "#166534" },
};

const SEED_TASKS = [
  { id: "t3",  title: "GRUPO MLOG",                                                                                    column_id: "gargalo", priority: "alta",   tags: ["B2B Hunting"],        position: 0 },
  { id: "t15", title: "Rede Globo - aguardando Bianca voltar das férias",                                             column_id: "gargalo", priority: "normal", tags: ["B2B Hunting"],        position: 1 },
  { id: "t1",  title: "Real Grandeza - implantação",                                                                  column_id: "fazendo", priority: "alta",   tags: ["B2B Farming"],        position: 0 },
  { id: "t4b", title: "Seguros Unimed - receber contrato e assinar",                                                  column_id: "fazendo", priority: "alta",   tags: ["B2B Farming"],        position: 1 },
  { id: "t2c", title: "SulAmérica - receber contrato assinado pelo Nutea para iniciar implantação de parceiro premium + migração de clientes", column_id: "fazendo", priority: "normal", tags: ["B2B Hunting"], position: 2 },
  { id: "t23", title: "Fechar documentos do processo de implantação com Abby",                                        column_id: "fazendo", priority: "normal", tags: ["B2B Farming"],        position: 3 },
  { id: "t5b", title: "Cassi - estruturar implantação e direcionamento de cliente",                                   column_id: "fazendo", priority: "normal", tags: ["B2B Hunting"],        position: 4 },
  { id: "t25", title: "Atualizar conselho sobre captação",                                                            column_id: "semana",  priority: "normal", tags: ["Conselho"],           position: 0 },
  { id: "t24", title: "Criar grupo de WhatsApp de implantações",                                                      column_id: "semana",  priority: "normal", tags: ["B2B Farming"],        position: 1 },
  { id: "t22", title: "Incluir pilar de divulgação na diretriz de implantação",                                       column_id: "semana",  priority: "normal", tags: ["B2B Farming"],        position: 2 },
  { id: "t21", title: "Estruturar modelo de desenvolvimento em camadas",                                              column_id: "semana",  priority: "alta",   tags: [],                     position: 3 },
  { id: "t20", title: "Montar processo pós-assinatura de implantação dos planos",                                     column_id: "semana",  priority: "normal", tags: ["B2B Farming"],        position: 4 },
  { id: "t17", title: "Definir com Eduardo Abby o modelo de relatório para diretoria e gerência de plano de saúde",   column_id: "semana",  priority: "normal", tags: ["B2B Farming"],        position: 5 },
  { id: "t18", title: "Contratar musicoterapeuta e avisar Fabi",                                                      column_id: "semana",  priority: "normal", tags: ["Pessoal"],            position: 6 },
  { id: "t11", title: "Resolver viagem SP julho - data, passagem e estadia",                                          column_id: "semana",  priority: "normal", tags: ["Pessoal"],            position: 7 },
  { id: "t8",  title: "Report mensal para Planos Parceiros",                                                          column_id: "backlog", priority: "normal", tags: ["B2B Farming"],        position: 0 },
  { id: "t9",  title: "Report mensal conselho",                                                                       column_id: "backlog", priority: "normal", tags: ["Conselho"],           position: 1 },
  { id: "t10", title: "[CARE PLUS] Produto de neuropediatra",                                                         column_id: "backlog", priority: "normal", tags: ["B2B Farming"],        position: 2 },
  { id: "t19", title: "Amil - estruturar modelo simples de neuropediatria",                                           column_id: "backlog", priority: "normal", tags: ["B2B Farming"],        position: 3 },
  { id: "t4",  title: "Seguros Unimed - fechar negociação",                                                           column_id: "feito",   priority: "alta",   tags: ["B2B Farming"],        position: 0 },
  { id: "t2",  title: "SulAmérica - retorno final",                                                                   column_id: "feito",   priority: "normal", tags: ["B2B Hunting"],        position: 1 },
  { id: "t2b", title: "SulAmérica - enviar documentação e evoluir p/ contrato",                                       column_id: "feito",   priority: "normal", tags: ["B2B Hunting"],        position: 2 },
  { id: "t5",  title: "Cassi - Contrato",                                                                             column_id: "feito",   priority: "normal", tags: ["B2B Hunting"],        position: 3 },
  { id: "t12", title: "Enviar proposta para a Rede Globo",                                                            column_id: "feito",   priority: "normal", tags: ["B2B Hunting"],        position: 4 },
  { id: "t7",  title: "Organograma Jano",                                                                             column_id: "feito",   priority: "normal", tags: ["Fundadores"],         position: 5 },
  { id: "t6",  title: "Apresentação conselho 02 Junho",                                                               column_id: "feito",   priority: "normal", tags: ["Conselho"],           position: 6 },
  { id: "t16", title: "Conversar com Julia Sarge - mudança de RT da clínica de Botafogo",                             column_id: "feito",   priority: "normal", tags: [],                     position: 7 },
  { id: "t13", title: "Definir contratação de analista para B2B",                                                     column_id: "feito",   priority: "normal", tags: ["Relacionamento B2B"], position: 8 },
  { id: "t14", title: "Analisar performance da Carol",                                                                column_id: "feito",   priority: "normal", tags: ["B2B Farming"],        position: 9 },
];

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") { try { return JSON.parse(tags); } catch { return []; } }
  return [];
}

async function processWithAI(command, tasks, apiKey) {
  const systemPrompt = `Você é um assistente de kanban. Interprete comandos em linguagem natural para gerenciar tarefas.

Estado atual (JSON):
${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, column_id: t.column_id, priority: t.priority, tags: t.tags })), null, 2)}

Colunas: backlog, semana, fazendo, gargalo, feito
Prioridades: alta, media, normal
Tags: "B2B Farming", "B2B Hunting", "Fundadores", "Pessoal", "Relacionamento B2B", "Conselho"

Responda SOMENTE com JSON válido (sem markdown):
{
  "actions": [
    { "type": "CREATE", "task": { "id": "task-XXX", "title": "...", "column_id": "...", "priority": "normal", "tags": [], "position": 0 } },
    { "type": "MOVE", "taskId": "...", "to": "..." },
    { "type": "DELETE", "taskId": "..." },
    { "type": "UPDATE_PRIORITY", "taskId": "...", "priority": "..." },
    { "type": "UPDATE_TAGS", "taskId": "...", "tags": ["..."] }
  ],
  "message": "Confirmação curta e amigável"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages: [{ role: "user", content: command }] }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function App() {
  const [tasks, setTasks]         = useState([]);
  const [loaded, setLoaded]       = useState(false);
  const [error, setError]         = useState(null);
  const [syncing, setSyncing]     = useState(false);
  const [selected, setSelected]   = useState(null);
  const [command, setCommand]     = useState("");
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastMsg, setLastMsg]     = useState("");
  const [apiKey, setApiKey]       = useState(() => localStorage.getItem("anthropic_key") || "");
  const [showKey, setShowKey]     = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let data = await sbFetch("kanban_tasks?order=position.asc");
        if (!data || data.length === 0) {
          for (const t of SEED_TASKS) {
            await sbFetch("kanban_tasks", {
              method: "POST",
              headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
              body: JSON.stringify({ ...t, tags: JSON.stringify(t.tags) }),
            });
          }
          data = await sbFetch("kanban_tasks?order=position.asc");
        }
        setTasks(data.map(t => ({ ...t, tags: parseTags(t.tags) })));
      } catch (e) { setError(e.message); }
      setLoaded(true);
    })();
    const interval = setInterval(async () => {
      try {
        const data = await sbFetch("kanban_tasks?order=position.asc");
        setTasks(data.map(t => ({ ...t, tags: parseTags(t.tags) })));
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Seu navegador não suporta reconhecimento de voz. Use Chrome."); return; }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = e => {
      const transcript = e.results[0][0].transcript;
      setCommand(transcript);
      handleCommand(transcript);
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  }

  async function handleCommand(cmd) {
    if (!cmd.trim()) return;
    if (!apiKey) { setShowKey(true); return; }
    setProcessing(true);
    setCommand("");
    try {
      const result = await processWithAI(cmd, tasks, apiKey);
      let newTasks = [...tasks];
      for (const action of result.actions || []) {
        if (action.type === "CREATE") {
          const t = { ...action.task, id: "task-" + Date.now(), tags: action.task.tags || [], position: newTasks.filter(x => x.column_id === action.task.column_id).length };
          await sbFetch("kanban_tasks", { method: "POST", headers: { "Prefer": "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ ...t, tags: JSON.stringify(t.tags) }) });
          newTasks.push(t);
        } else if (action.type === "MOVE") {
          await sbFetch(`kanban_tasks?id=eq.${action.taskId}`, { method: "PATCH", body: JSON.stringify({ column_id: action.to }) });
          newTasks = newTasks.map(t => t.id === action.taskId ? { ...t, column_id: action.to } : t);
        } else if (action.type === "DELETE") {
          await sbFetch(`kanban_tasks?id=eq.${action.taskId}`, { method: "DELETE" });
          newTasks = newTasks.filter(t => t.id !== action.taskId);
        } else if (action.type === "UPDATE_PRIORITY") {
          await sbFetch(`kanban_tasks?id=eq.${action.taskId}`, { method: "PATCH", body: JSON.stringify({ priority: action.priority }) });
          newTasks = newTasks.map(t => t.id === action.taskId ? { ...t, priority: action.priority } : t);
        } else if (action.type === "UPDATE_TAGS") {
          await sbFetch(`kanban_tasks?id=eq.${action.taskId}`, { method: "PATCH", body: JSON.stringify({ tags: JSON.stringify(action.tags) }) });
          newTasks = newTasks.map(t => t.id === action.taskId ? { ...t, tags: action.tags } : t);
        }
      }
      setTasks(newTasks);
      setLastMsg(result.message || "Feito!");
    } catch (e) {
      setLastMsg("Erro: " + e.message);
    }
    setProcessing(false);
  }

  async function moveTask(taskId, toCol) {
    setSyncing(true);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column_id: toCol } : t));
    setSelected(null);
    try {
      await sbFetch(`kanban_tasks?id=eq.${taskId}`, { method: "PATCH", body: JSON.stringify({ column_id: toCol }) });
    } catch (e) { setLastMsg("Erro ao salvar: " + e.message); }
    setSyncing(false);
  }

  const selectedTask = tasks.find(t => t.id === selected);

  if (!loaded) return h('div', { style:{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#64748B',fontSize:16,fontFamily:'system-ui'} }, '⏳ Carregando...');
  if (error) return h('div', { style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',color:'#991B1B',padding:24,textAlign:'center',gap:12,fontFamily:'system-ui'} },
    h('div',{style:{fontSize:32}},'❌'), h('b',null,'Erro de conexão'), h('div',{style:{fontSize:13}},error));

  return h('div', { style:{minHeight:'100vh',background:'#F1F5F9',padding:'20px 16px',fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}, onClick:()=>selected&&setSelected(null) },

    // API Key modal
    showKey && h('div', { style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'} },
      h('div', { style:{background:'#fff',borderRadius:14,padding:24,width:'90%',maxWidth:360,boxShadow:'0 8px 40px rgba(0,0,0,0.2)'} },
        h('div', {style:{fontWeight:700,fontSize:15,marginBottom:8,color:'#0F172A'}}, '🔑 Chave da API Anthropic'),
        h('div', {style:{fontSize:12,color:'#64748B',marginBottom:14,lineHeight:1.5}}, 'Para usar comandos de voz e texto, insira sua chave da API Anthropic. Ela fica salva só no seu navegador.'),
        h('input', { type:'password', placeholder:'sk-ant-...', value:apiKey, onInput: e => setApiKey(e.target.value),
          style:{width:'100%',border:'1.5px solid #CBD5E1',borderRadius:8,padding:'10px 12px',fontSize:13,marginBottom:12,outline:'none'} }),
        h('button', { onClick:()=>{ localStorage.setItem("anthropic_key", apiKey); setShowKey(false); },
          style:{width:'100%',background:'#2563EB',color:'#fff',border:'none',borderRadius:8,padding:'10px',fontSize:14,fontWeight:600,cursor:'pointer'} }, 'Salvar'),
        h('button', { onClick:()=>setShowKey(false), style:{width:'100%',background:'none',border:'none',color:'#94A3B8',fontSize:13,cursor:'pointer',marginTop:8,padding:6} }, 'Cancelar')
      )
    ),

    // Move modal
    selected && h('div', {style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',zIndex:999},onClick:()=>setSelected(null)}),
    selected && selectedTask && h('div', { onClick:e=>e.stopPropagation(), style:{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'#fff',borderRadius:14,boxShadow:'0 8px 40px rgba(0,0,0,0.18)',padding:24,zIndex:1000,minWidth:280,maxWidth:340,width:'90%'} },
      h('div',{style:{fontSize:13,color:'#64748B',marginBottom:6}},'Mover para:'),
      h('div',{style:{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:16,lineHeight:1.4}},selectedTask.title),
      h('div',{style:{display:'flex',flexDirection:'column',gap:8}},
        ...COLUMNS.filter(c=>c.id!==selectedTask.column_id).map(col=>
          h('button',{key:col.id,onClick:()=>moveTask(selected,col.id),style:{display:'flex',alignItems:'center',gap:10,background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:8,padding:'10px 14px',cursor:'pointer',fontSize:13,fontWeight:500,color:'#1E293B',textAlign:'left',width:'100%'}},
            h('span',null,col.emoji), h('span',{style:{color:col.color,fontWeight:600}},col.label)))),
      h('button',{onClick:()=>setSelected(null),style:{marginTop:14,width:'100%',background:'none',border:'none',color:'#94A3B8',fontSize:13,cursor:'pointer',padding:6}},'Cancelar')
    ),

    // Header
    h('div',{style:{maxWidth:1300,margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}},
      h('div',null,
        h('div',{style:{display:'flex',alignItems:'center',gap:10}},
          h('h1',{style:{margin:0,fontSize:20,fontWeight:700,color:'#0F172A'}},'Lucas / Jano'),
          h('span',{style:{fontSize:11,color:'#94A3B8',textTransform:'uppercase',letterSpacing:1.5}},'Kanban'),
          syncing && h('span',{style:{fontSize:11,color:'#3B82F6'}},'salvando...')
        ),
        h('p',{style:{margin:0,fontSize:12,color:'#94A3B8'}},`${tasks.length} tarefas`)
      ),
      h('button',{onClick:()=>setShowKey(true),style:{background:'none',border:'1px solid #E2E8F0',borderRadius:8,padding:'6px 10px',cursor:'pointer',fontSize:12,color:'#64748B'}},'🔑 API Key')
    ),

    // Command bar
    h('div',{style:{maxWidth:1300,margin:'0 auto 20px'}},
      h('div',{style:{display:'flex',gap:8,alignItems:'center',background:'#fff',border:'1.5px solid #CBD5E1',borderRadius:12,padding:'10px 14px',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}},
        // Mic button
        h('button',{
          onClick: listening ? ()=>{ recognitionRef.current?.stop(); setListening(false); } : startListening,
          style:{
            width:40, height:40, borderRadius:'50%', border:'none', cursor:'pointer', flexShrink:0,
            background: listening ? '#EF4444' : processing ? '#F1F5F9' : '#2563EB',
            color:'#fff', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none',
            transition:'all 0.2s',
          }
        }, listening ? '⏹' : processing ? '⏳' : '🎤'),
        h('input',{
          ref: inputRef,
          value: command,
          onInput: e => setCommand(e.target.value),
          onKeyDown: e => e.key === 'Enter' && handleCommand(command),
          placeholder: listening ? 'Ouvindo...' : 'Fale ou digite um comando...',
          disabled: listening || processing,
          style:{flex:1,background:'transparent',border:'none',outline:'none',color:'#1E293B',fontSize:14,fontFamily:'inherit'},
        }),
        h('button',{
          onClick:()=>handleCommand(command),
          disabled: processing || !command.trim(),
          style:{background: processing?'#93C5FD':'#2563EB',color:'#fff',border:'none',borderRadius:7,padding:'7px 16px',fontSize:13,cursor: processing?'wait':'pointer',fontFamily:'inherit',fontWeight:600,flexShrink:0}
        }, processing ? '...' : 'Enviar')
      ),
      lastMsg && h('div',{style:{marginTop:6,fontSize:12,color:'#64748B',paddingLeft:4}}, lastMsg)
    ),

    // Board
    h('div',{style:{maxWidth:1300,margin:'0 auto',display:'flex',gap:12,overflowX:'auto',paddingBottom:16}},
      ...COLUMNS.map(col=>{
        const colTasks = tasks.filter(t=>t.column_id===col.id);
        return h('div',{key:col.id,style:{minWidth:200,flex:1,background:'#fff',borderRadius:12,border:'1px solid #E2E8F0',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}},
          h('div',{style:{padding:'12px 14px',borderBottom:'1px solid #F1F5F9',display:'flex',alignItems:'center',gap:8,background:'#FAFAFA'}},
            h('span',null,col.emoji),
            h('div',{style:{flex:1,fontSize:11,fontWeight:700,color:col.color,textTransform:'uppercase',letterSpacing:0.8}},col.label),
            h('span',{style:{fontSize:11,background:'#F1F5F9',color:'#94A3B8',borderRadius:10,padding:'1px 8px',fontWeight:600}},colTasks.length)
          ),
          h('div',{style:{padding:10,minHeight:80,display:'flex',flexDirection:'column',gap:8}},
            colTasks.length===0 && h('div',{style:{fontSize:12,color:'#CBD5E1',textAlign:'center',paddingTop:20,fontStyle:'italic'}},'vazio'),
            ...colTasks.map(task=>{
              const isSelected = selected===task.id;
              const tags = parseTags(task.tags);
              return h('div',{
                key:task.id,
                onClick:e=>{e.stopPropagation();setSelected(isSelected?null:task.id);},
                style:{background:isSelected?'#EFF6FF':'#fff',border:`1.5px solid ${isSelected?'#2563EB':task.priority==='alta'?'#FECACA':task.priority==='media'?'#FDE68A':'#E2E8F0'}`,borderRadius:8,padding:'10px 12px',boxShadow:isSelected?'0 0 0 3px #BFDBFE':'0 1px 2px rgba(0,0,0,0.04)',cursor:'pointer'}
              },
                (tags.length>0||task.priority==='alta'||task.priority==='media')&&h('div',{style:{display:'flex',flexWrap:'wrap',gap:4,marginBottom:7}},
                  ...tags.map(tag=>{const ts=TAG_STYLES[tag]||{bg:'#F1F5F9',color:'#475569'};return h('span',{key:tag,style:{fontSize:10,fontWeight:600,background:ts.bg,color:ts.color,borderRadius:4,padding:'2px 7px'}},tag);}),
                  task.priority==='alta'&&h('span',{style:{fontSize:10,fontWeight:600,background:'#FEE2E2',color:'#B91C1C',borderRadius:4,padding:'2px 7px'}},'🔥 Alta'),
                  task.priority==='media'&&h('span',{style:{fontSize:10,fontWeight:600,background:'#FEF3C7',color:'#92400E',borderRadius:4,padding:'2px 7px'}},'⚡ Média')
                ),
                h('div',{style:{fontSize:13,color:'#1E293B',lineHeight:1.5}},task.title)
              );
            })
          )
        );
      })
    )
  );
}

render(h(App, null), document.getElementById('root'));
