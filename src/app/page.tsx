"use client";
import { useState, useEffect, useCallback } from "react";
export default function PlayerPage() {
  const [status, setStatus] = useState("pairing");
  const [code, setCode] = useState("");
  const [savedCode, setSavedCode] = useState(null as string|null);
  const [screenName, setScreenName] = useState("");
  const [media, setMedia] = useState([] as any[]);
  const [idx, setIdx] = useState(0);
  const fetch_ = useCallback(async (c: string, silent=false) => {
    if(!silent) setStatus("loading");
    try {
      const res = await fetch(`/api/player?code=${encodeURIComponent(c)}`);
      const d = await res.json();
      if(!res.ok){ setStatus(res.status===403?"waiting":"error"); setScreenName(d.screen?.name||""); return; }
      setScreenName(d.screen.name);
      if(!d.media?.length){ setStatus("waiting"); } else { setMedia(d.media); setIdx(0); setStatus("playing"); }
    } catch { if(!silent) setStatus("error"); }
  }, []);
  useEffect(()=>{ if(!savedCode) return; const t=setInterval(()=>fetch_(savedCode,true),30000); return()=>clearInterval(t); },[savedCode,fetch_]);
  useEffect(()=>{
    if(status!=="playing"||!media[idx]||media[idx].type==="video") return;
    const t=setTimeout(()=>setIdx(i=>(i+1)%media.length), media[idx].duration*1000);
    return()=>clearTimeout(t);
  },[status,idx,media]);
  if(status==="pairing") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0f"}}>
      <div style={{width:360,textAlign:"center",padding:32}}>
        <div style={{width:64,height:64,borderRadius:16,background:"#7c6af5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 24px",color:"white"}}>▶</div>
        <h1 style={{color:"#f0f0f5",fontSize:28,marginBottom:8,fontFamily:"serif"}}>Translook Press</h1>
        <p style={{color:"#9090a8",fontSize:14,marginBottom:32}}>Enter your pairing code</p>
        <form onSubmit={e=>{e.preventDefault();const u=code.trim().toUpperCase();setSavedCode(u);fetch_(u);}}>
          <input value={code} onChange={e=>setCode(e.target.value.trim().toUpperCase())} placeholder="ABC123" maxLength={8}
            style={{width:"100%",background:"#1a1a24",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#f0f0f5",fontSize:32,letterSpacing:8,padding:"16px 24px",textAlign:"center",outline:"none",marginBottom:16,boxSizing:"border-box"}}/>
          <button type="submit" style={{width:"100%",background:"#7c6af5",border:"none",borderRadius:12,color:"white",fontSize:16,fontWeight:600,padding:16,cursor:"pointer"}}>Connect</button>
        </form>
      </div>
    </div>
  );
  if(status==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0f"}}><p style={{color:"#9090a8"}}>Connecting...</p></div>;
  if(status==="error") return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0a0f",gap:16}}><p style={{color:"#f55a5a",fontSize:18}}>Connection failed</p><button onClick={()=>{setStatus("pairing");setSavedCode(null);}} style={{background:"#1a1a24",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#f0f0f5",padding:"10px 24px",cursor:"pointer"}}>Try Again</button></div>;
  if(status==="waiting") return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0a0f",gap:12}}><div style={{width:48,height:48,borderRadius:12,background:"#7c6af5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"white"}}>▶</div><h2 style={{color:"#f0f0f5",fontFamily:"serif"}}>{screenName}</h2><p style={{color:"#9090a8",fontSize:14}}>Waiting for content... (checks every 30s)</p></div>;
  const item=media[idx];
  return (
    <div style={{width:"100vw",height:"100vh",background:"#000",overflow:"hidden",position:"relative"}}>
      {item?.type==="image"&&<img key={item.id} src={item.url} alt={item.name} style={{width:"100%",height:"100%",objectFit:"contain"}}/>}
      {item?.type==="video"&&<video key={item.id} src={item.url} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"contain"}} onEnded={()=>setIdx(i=>(i+1)%media.length)}/>}
      {media.length>1&&<div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>{media.map((_,i)=><div key={i} style={{width:i===idx?18:6,height:6,borderRadius:3,background:i===idx?"#7c6af5":"rgba(255,255,255,0.3)"}}/>)}</div>}
      <div style={{position:"absolute",top:12,left:16,color:"rgba(255,255,255,0.2)",fontSize:11}}>{screenName}</div>
    </div>
  );
}
