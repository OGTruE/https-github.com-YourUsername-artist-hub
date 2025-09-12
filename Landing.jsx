import React from 'react'
export default function Landing({tracks,gallery,onPlay,setRoute}){
  return (
    <section>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-extrabold">Latest Tracks</h2>
          <div className="mt-4 space-y-3">
            {tracks.map(t=> (
              <div key={t.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-3"><img src={t.cover||'/placeholder.png'} className="w-16 h-16 rounded object-cover"/><div><div className="font-semibold">{t.title}</div><div className="text-sm text-gray-400">{t.artist||'O.G True'}</div></div></div>
                <div><button className="px-3 py-2 bg-emerald-600 rounded" onClick={()=>onPlay(t)}>Play</button></div>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <h3 className="text-lg font-semibold">Gallery</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {gallery.slice(0,9).map(g=> <img key={g.id} src={g.url} className="w-full h-24 object-cover rounded" alt="g" />) }
          </div>
        </aside>
      </div>
    </section>
  )
}
