import React, { useEffect, useState, useRef } from 'react'
import { db, auth } from './utils/firebaseClient'
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import Nav from './components/Nav'
import Landing from './components/Landing'
import BookingForm from './components/BookingForm'
import AdminPanel from './components/AdminPanel'
import AdminDashboard from './components/AdminDashboard'

export default function App(){
  const [route, setRoute] = useState('landing')
  const [tracks, setTracks] = useState([])
  const [gallery, setGallery] = useState([])
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  useEffect(()=>{
    const fetch = async ()=>{
      try{
        const tQ = query(collection(db,'tracks'), orderBy('createdAt','desc'))
        const tSnap = await getDocs(tQ)
        const gSnap = await getDocs(collection(db,'gallery'))
        setTracks(tSnap.docs.map(d=>({id:d.id,...d.data()})))
        setGallery(gSnap.docs.map(d=>({id:d.id,...d.data()})))
      }catch(e){console.error(e)}
    }
    fetch()
  },[])

  const playTrack=(t)=>{
    if(!audioRef.current) audioRef.current=new Audio()
    const a=audioRef.current
    if(playing && playing.id===t.id){a.pause(); setPlaying(null)} else {a.src=t.url; a.play(); setPlaying(t); setRoute('player')}
  }

  const sendBooking = async ({name,date,notes,deposit})=>{
    if(!name||!date) return alert('Name and date required')
    try{
      const doc = await addDoc(collection(db,'bookings'),{name,date,notes,deposit,status:'pending',createdAt: serverTimestamp()})
      return { ok: true, id: doc.id }
    }catch(e){console.error(e); return { ok:false }}
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav setRoute={setRoute} />
      <main className="max-w-6xl mx-auto p-6">
        {route==='landing' && <Landing tracks={tracks} gallery={gallery} onPlay={playTrack} setRoute={setRoute}/>}
        {route==='booking' && <BookingForm onSend={sendBooking} />}
        {route==='admin' && <AdminPanel onUpload={()=>{}}/>}
        {route==='dashboard' && <AdminDashboard />}
        {route==='player' && playing && (
          <section className="bg-gray-900 p-4 rounded">
            <div className="flex gap-4 items-center">
              <img src={playing.cover||'/placeholder.png'} className="w-36 h-36 object-cover rounded"/>
              <div>
                <h2 className="text-xl font-bold">{playing.title}</h2>
                <audio controls src={playing.url} ref={el=>audioRef.current=el} className="w-full mt-4"/>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
