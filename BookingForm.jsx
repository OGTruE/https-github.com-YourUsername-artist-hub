import React, {useState} from 'react'
export default function BookingForm({onSend}){
  const [name,setName]=useState(''); const [date,setDate]=useState(''); const [notes,setNotes]=useState(''); const [deposit,setDeposit]=useState(0);
  const [loading,setLoading]=useState(false)
  const submit=async ()=>{
    setLoading(true)
    const res=await onSend({name,date,notes,deposit})
    setLoading(false)
    if(res.ok){
      if(deposit>0){
        const r = await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bookingId:res.id, amount: Math.round(deposit*100)})})
        const j = await r.json(); if(j.url) window.location.href=j.url
      } else alert('Booking request sent')
    } else alert('Send failed')
  }
  return (
    <section className="bg-gray-900 p-4 rounded max-w-xl">
      <h2 className="text-2xl font-bold">Booking Request</h2>
      <div className="mt-3 grid gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="p-2 rounded bg-black/40" />
        <input value={date} onChange={e=>setDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" className="p-2 rounded bg-black/40" />
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="p-2 rounded bg-black/40 h-28" />
        <input type="number" value={deposit} onChange={e=>setDeposit(Number(e.target.value))} className="p-2 rounded bg-black/40" placeholder="Deposit (USD)" />
        <button className="px-4 py-2 bg-emerald-500 rounded" onClick={submit} disabled={loading}>{loading?'Sending...':'Send Booking'}</button>
      </div>
    </section>
  )
}
