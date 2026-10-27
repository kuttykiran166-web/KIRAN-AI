import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const tabs = [['home','Home'],['chat','AI Chat'],['prompts','Prompts'],['image','Image'],['video','Video'],['history','History']];
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function App() {
  const [tab,setTab] = useState('home');
  const [message,setMessage] = useState('');
  const [topic,setTopic] = useState('');
  const [mode,setMode] = useState('Tanglish');
  const [category,setCategory] = useState('Cinema');
  const [imagePrompt,setImagePrompt] = useState('');
  const [videoPrompt,setVideoPrompt] = useState('');
  const [busy,setBusy] = useState(false);
  const [result,setResult] = useState('');
  const [history,setHistory] = useState([]);
  const [provider,setProvider] = useState('gemini');

  function remember(title, content) {
    const item = { title, content, time: new Date().toLocaleString() };
    setHistory(old => [item, ...old].slice(0,30));
  }
  async function callBackend(path, body) {
    if (!apiBase) { setResult('Backend not configured yet. Add VITE_API_BASE_URL in .env and rebuild after deploying your secure AI backend.'); return; }
    setBusy(true); setResult('');
    try {
      const response = await fetch(apiBase + path, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      const output = data.reply || data.imageUrl || data.message || JSON.stringify(data);
      setResult(String(output)); remember(path, String(output));
    } catch (e) { setResult('Request error: ' + e.message); }
    finally { setBusy(false); }
  }
  function makePrompts() {
    if (!topic.trim()) return;
    const ideas = [
      `(${mode} / ${category}) ${topic}: create a vivid, original concept with a strong opening, specific visual details, and a memorable ending.`,
      `Write a creative ${mode} prompt about "${topic}" for ${category}. Include mood, setting, key details, and intended audience.`,
      `Give 3 distinct variations for "${topic}" in ${mode}, category ${category}: cinematic, minimal, and bold.`
    ].join('\n\n');
    setResult(ideas); remember(topic, ideas);
  }

  return <main className="shell">
    <header className="brand"><div className="logo">K</div><div><div className="eyebrow">YOUR CREATIVE AI STUDIO</div><h1>KIRAN AI</h1><div className="muted">Vanakkam! Tamil & English AI assistant.</div></div></header>
    <nav className="tabs">{tabs.map(([id,label])=><button key={id} className={'tab '+(tab===id?'active':'')} onClick={()=>{setTab(id);setResult('')}}>{label}</button>)}</nav>
    {tab==='home' && <section className="panel"><h2>Welcome to KIRAN AI ✨</h2><p className="muted">Chat, create Tamil/Tanglish prompts, and explore AI media tools in one place.</p><button className="btn primary" onClick={()=>setTab('chat')}>Start chatting</button><p className="notice">AI chat and media generation require a separately deployed backend. The prompt generator works locally.</p></section>}
    {tab==='chat' && <section className="panel"><h2>AI Chat</h2><label>Provider</label><select value={provider} onChange={e=>setProvider(e.target.value)}><option value="gemini">Gemini</option><option value="openai">OpenAI</option></select><label>Your message</label><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type in Tamil, Tanglish, or English..."/><button className="btn primary" disabled={busy||!message.trim()} onClick={()=>callBackend('/api/chat',{message,provider})}>{busy?'Please wait...':'Send message'}</button></section>}
    {tab==='prompts' && <section className="panel"><h2>Tamil / Tanglish Prompt Generator</h2><label>Topic</label><input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. mass hero entry scene"/><label>Language</label><select value={mode} onChange={e=>setMode(e.target.value)}><option>Tanglish</option><option>Tamil</option><option>English</option></select><label>Category</label><select value={category} onChange={e=>setCategory(e.target.value)}>{['Cinema','Social media','Business','Education','Art'].map(x=><option key={x}>{x}</option>)}</select><button className="btn primary" disabled={!topic.trim()} onClick={makePrompts}>Generate prompts</button></section>}
    {tab==='image' && <section className="panel"><h2>AI Image Studio</h2><label>Image description</label><textarea value={imagePrompt} onChange={e=>setImagePrompt(e.target.value)} placeholder="Describe the image you want..."/><button className="btn primary" disabled={busy||!imagePrompt.trim()} onClick={()=>callBackend('/api/image',{prompt:imagePrompt,aspectRatio:'1:1'})}>{busy?'Working...':'Generate image'}</button><p className="notice">Requires a configured image-generation backend and provider access.</p></section>}
    {tab==='video' && <section className="panel"><h2>AI Video Studio</h2><label>Video idea</label><textarea value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)} placeholder="Describe the video scene..."/><button className="btn primary" disabled={busy||!videoPrompt.trim()} onClick={()=>callBackend('/api/video',{prompt:videoPrompt})}>{busy?'Working...':'Generate video'}</button><p className="notice">Requires a configured video provider; costs may apply.</p></section>}
    {tab==='history' && <section className="panel"><h2>Recent activity</h2>{history.length?history.map((h,i)=><div className="history-item" key={i}><strong>{h.title}</strong><div className="muted">{h.time}</div><div className="result">{h.content}</div></div>):<p className="muted">Your activity in this session will appear here.</p>}</section>}
    {result && <section className="panel"><h2>Result / Status</h2><div className="result">{result}</div><button className="btn" onClick={()=>navigator.clipboard?.writeText(result)}>Copy result</button></section>}
    <div className="footer">KIRAN AI · Android-ready source project · Keep API keys private</div>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
