import { h, render, useState, useEffect, useRef } from 'https://esm.sh/preact@10/compat';

const SUPABASE_URL = "https://doddceilponwoavtkjyc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZGRjZWlscG9ud29hdnRranljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Mzc4MzMsImV4cCI6MjA5NzQxMzgzM30.4dmubOhGPTuZIQHHat9vtQMV2MyuA-pzf2PIt35zSTs";

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

function App() {
  const [tasks, setTasks]       = useState([]);
  const [loaded, setLoaded]     = useState(false);
  const [error, setError]       = useState(null);
  const [syncing, setSyncing]   = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await sbFetch("kanban_tasks?order=position.asc");
        setTasks(data.map(t => ({ ...t, tags: parseTags(t.tags) })));
      } catch (e) {
        setError(e.message);
      }
      setLoaded(true);
    })();

    // Poll for updates every 10s (catches changes made via Claude)
    const interval = setInterval(async () => {
      try {
        const data = await sbFetch("kanban_tasks?order=position.asc");
        setTasks(data.map(t => ({ ...t, tags: parseTags(t.tags) })));
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  async function moveTask(taskId, toCol) {
    setSyncing(true);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column_id: toCol } : t));
    setSelected(null);
    try {
      await sbFetch(`kanban_tasks?id=eq.${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ column_id: toCol }),
      });
    } catch (e) { setError(e.message); }
    setSyncing(false);
  }

  const selectedTask = tasks.find(t => t.id === selected);

  if (!loaded) return h('div', { style: { display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#64748B', fontSize:16 } }, '⏳ Carregando...');
  if (error) return h('div', { style: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', color:'#991B1B', padding:24, textAlign:'center', gap:12 } },
    h('div', { style: { fontSize:32 } }, '❌'),
    h('div', { style: { fontWeight:700 } }, 'Erro de conexão'),
    h('div', { style: { fontSize:13 } }, error)
  );

  return h('div', { style: { minHeight:'100vh', background:'#F1F5F9', padding:'24px 16px' }, onClick: () => selected && setSelected(null) },

    // Modal
    selected && selectedTask && h('div', { onClick: e => e.stopPropagation(), style: { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#fff', borderRadius:14, boxShadow:'0 8px 40px rgba(0,0,0,0.18)', padding:24, zIndex:1000, minWidth:280, maxWidth:340, width:'90%' } },
      h('div', { style: { fontSize:13, color:'#64748B', marginBottom:6 } }, 'Mover card para:'),
      h('div', { style: { fontSize:14, fontWeight:600, color:'#0F172A', marginBottom:16, lineHeight:1.4 } }, selectedTask.title),
      h('div', { style: { display:'flex', flexDirection:'column', gap:8 } },
        ...COLUMNS.filter(c => c.id !== selectedTask.column_id).map(col =>
          h('button', { key: col.id, onClick: () => moveTask(selected, col.id), style: { display:'flex', alignItems:'center', gap:10, background:'#F8FAFC', border:'1.5px solid #E2E8F0', borderRadius:8, padding:'10px 14px', cursor:'pointer', fontSize:13, fontWeight:500, color:'#1E293B', textAlign:'left', width:'100%' } },
            h('span', null, col.emoji),
            h('span', { style: { color: col.color, fontWeight:600 } }, col.label)
          )
        )
      ),
      h('button', { onClick: () => setSelected(null), style: { marginTop:14, width:'100%', background:'none', border:'none', color:'#94A3B8', fontSize:13, cursor:'pointer', padding:6 } }, 'Cancelar')
    ),
    selected && h('div', { style: { position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:999 }, onClick: () => setSelected(null) }),

    // Header
    h('div', { style: { maxWidth:1300, margin:'0 auto 20px' } },
      h('div', { style: { display:'flex', alignItems:'center', gap:10, marginBottom:2 } },
        h('h1', { style: { margin:0, fontSize:20, fontWeight:700, color:'#0F172A' } }, 'Lucas / Jano'),
        h('span', { style: { fontSize:11, color:'#94A3B8', textTransform:'uppercase', letterSpacing:1.5 } }, 'Kanban'),
        syncing && h('span', { style: { fontSize:11, color:'#3B82F6' } }, 'salvando...')
      ),
      h('p', { style: { margin:0, fontSize:13, color:'#64748B' } }, `${tasks.length} tarefas · clique num card para mover · atualiza a cada 10s`)
    ),

    // Board
    h('div', { style: { maxWidth:1300, margin:'0 auto', display:'flex', gap:12, overflowX:'auto', paddingBottom:16 } },
      ...COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.column_id === col.id);
        return h('div', { key: col.id, style: { minWidth:200, flex:1, background:'#FFFFFF', borderRadius:12, border:'1px solid #E2E8F0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' } },
          h('div', { style: { padding:'12px 14px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', gap:8, background:'#FAFAFA' } },
            h('span', null, col.emoji),
            h('div', { style: { flex:1, fontSize:11, fontWeight:700, color:col.color, textTransform:'uppercase', letterSpacing:0.8 } }, col.label),
            h('span', { style: { fontSize:11, background:'#F1F5F9', color:'#94A3B8', borderRadius:10, padding:'1px 8px', fontWeight:600 } }, colTasks.length)
          ),
          h('div', { style: { padding:10, minHeight:80, display:'flex', flexDirection:'column', gap:8 } },
            colTasks.length === 0 && h('div', { style: { fontSize:12, color:'#CBD5E1', textAlign:'center', paddingTop:20, fontStyle:'italic' } }, 'vazio'),
            ...colTasks.map(task => {
              const isSelected = selected === task.id;
              const tags = parseTags(task.tags);
              return h('div', { key: task.id, onClick: e => { e.stopPropagation(); setSelected(isSelected ? null : task.id); }, style: { background: isSelected ? '#EFF6FF' : '#FFFFFF', border: `1.5px solid ${isSelected ? '#2563EB' : task.priority === 'alta' ? '#FECACA' : task.priority === 'media' ? '#FDE68A' : '#E2E8F0'}`, borderRadius:8, padding:'10px 12px', boxShadow: isSelected ? '0 0 0 3px #BFDBFE' : '0 1px 2px rgba(0,0,0,0.04)', cursor:'pointer' } },
                (tags.length > 0 || task.priority === 'alta' || task.priority === 'media') && h('div', { style: { display:'flex', flexWrap:'wrap', gap:4, marginBottom:7 } },
                  ...tags.map(tag => { const ts = TAG_STYLES[tag] || { bg:'#F1F5F9', color:'#475569' }; return h('span', { key:tag, style: { fontSize:10, fontWeight:600, background:ts.bg, color:ts.color, borderRadius:4, padding:'2px 7px' } }, tag); }),
                  task.priority === 'alta' && h('span', { style: { fontSize:10, fontWeight:600, background:'#FEE2E2', color:'#B91C1C', borderRadius:4, padding:'2px 7px' } }, '🔥 Alta'),
                  task.priority === 'media' && h('span', { style: { fontSize:10, fontWeight:600, background:'#FEF3C7', color:'#92400E', borderRadius:4, padding:'2px 7px' } }, '⚡ Média')
                ),
                h('div', { style: { fontSize:13, color:'#1E293B', lineHeight:1.5 } }, task.title)
              );
            })
          )
        );
      })
    )
  );
}

render(h(App, null), document.getElementById('root'));
