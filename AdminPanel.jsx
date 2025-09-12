import React, {useRef, useState} from 'react'
import { storage, db } from '../utils/firebaseClient'
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default function AdminPanel(){
  const imgRef = useRef(); const trackRef = useRef(); const [loading,setLoading]=useState(false)
  const uploadImage = async (file)=>{
    setLoading(true)
    try{ const name=`${Date.now()}_${file.name}`; const path=`gallery/${name}`; const stRef=sRef(storage,path); await uploadBytes(stRef,file); const url=await getDownloadURL(stRef); await addDoc(collection(db,'gallery'),{url,createdAt:serverTimestamp()}); alert('Uploaded') }catch(e){console.error(e); alert('Fail') }finally{setLoading(false)}
  }
  const uploadTrack = async (file)=>{
    setLoading(true)
    try{ const name=`${Date.now()}_${file.name}`; const path=`tracks/${name}`; const stRef=sRef(storage,path); await uploadBytes(stRef,file); const url=await getDownloadURL(stRef); await addDoc(collection(db,'tracks'),{title:file.name.replace(/\.[^/.]+$/,''),url,createdAt:serverTimestamp()}); alert('Uploaded') }catch(e){console.error(e); alert('Fail')}finally{setLoading(false)}
  }
  return (
    <section className="bg-gray-900 p-4 rounded">
      <h2 className="text-xl font-bold">Admin Upload</h2>
      <div className="mt-3 flex gap-3">
        <label className="px-3 py-2 border rounded cursor-pointer">Upload Image<input type="file" accept="image/*" ref={imgRef} onChange={e=>uploadImage(e.target.files[0])} className="hidden" /></label>
        <label className="px-3 py-2 border rounded cursor-pointer">Upload Track<input type="file" accept="audio/*" ref={trackRef} onChange={e=>uploadTrack(e.target.files[0])} className="hidden" /></label>
      </div>
    </section>
  )
}
