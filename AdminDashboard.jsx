import React, {useEffect, useState} from 'react'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../utils/firebaseClient'

export default function AdminDashboard(){
  const [bookings,setBookings]=useState([])
  useEffect(()=>{const fetch=async()=>{const q=query(collection(db,'bookings'), where('status','==','pending')); const s=await getDocs(q); setBookings(s.docs.map(d=>({id:d.id,...d.data()})))}; fetch()},[])
  const approve=async(id)=>{await updateDoc(doc(db,'bookings',id),{status:'approved'}) ; setBookings(bookings.filter(b=>b.id!==id))}
  const deny=async(id)=>{await updateDoc(doc(db,'bookings',id),{status:'denied'}) ; setBookings(bookings.filter(b=>b.id!==id))}
  return (
    <section className="bg-gray-900 p-4 rounded">
      <h2 className="text-xl font-bold">Booking Approvals</h2>
      <div className="mt-3 space-y-3">
        {bookings.length===0? <div className="text-gray-400">No pending bookings</div> : bookings.map(b=> (
          <div key={b.id} className="p-3 bg-black/40 rounded flex justify-between">
            <div><div className="font-semibold">{b.name} — {b.date}</div><div className="text-sm text-gray-400">{b.notes}</div></div>
            <div className="flex gap-2"><button className="px-3 py-1 bg-emerald-600 rounded" onClick={()=>approve(b.id)}>Approve</button><button className="px-3 py-1 bg-rose-600 rounded" onClick={()=>deny(b.id)}>Deny</button></div>
          </div>
        ))}
      </div>
    </section>
  )
}
