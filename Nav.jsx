import React from 'react'
export default function Nav({setRoute}){
  return (
    <header className="bg-gradient-to-r from-zinc-900 to-black p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Artist Hub</h1>
          <div className="text-sm text-gray-400">O.G True</div>
        </div>
        <nav className="flex gap-3">
          <button className="btn" onClick={()=>setRoute('landing')}>Home</button>
          <button className="btn" onClick={()=>setRoute('booking')}>Booking</button>
          <button className="btn" onClick={()=>setRoute('admin')}>Admin</button>
          <button className="btn" onClick={()=>setRoute('dashboard')}>Dashboard</button>
        </nav>
      </div>
    </header>
  )
}
