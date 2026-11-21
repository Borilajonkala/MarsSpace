import { useState } from 'react'
import { GALLERY } from './hackathonData'

const GalleryTab = () => {
    const [preview, setPreview] = useState(null)

    return (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Galereya</h2>
                    <p className="text-xs text-gray-400 mt-1">Xakaton kunidan foto lavhalar.</p>
                </div>
                <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                    {GALLERY.length} foto
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {GALLERY.map((photo) => (
                    <button
                        key={photo.id}
                        type="button"
                        onClick={() => setPreview(photo)}
                        className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 aspect-[4/3] cursor-pointer"
                    >
                        <img
                            src={photo.url}
                            alt={photo.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-left text-[11px] font-semibold text-white">
                            {photo.title}
                        </span>
                    </button>
                ))}
            </div>

            {preview && (
                <div
                    className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-[2px] flex items-center justify-center p-4"
                    onClick={() => setPreview(null)}
                >
                    <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img src={preview.url} alt={preview.title} className="w-full rounded-2xl shadow-2xl" />
                        <div className="flex items-center justify-between mt-3">
                            <p className="text-sm font-semibold text-white">{preview.title}</p>
                            <button
                                type="button"
                                onClick={() => setPreview(null)}
                                className="text-xs font-bold text-white/80 hover:text-white cursor-pointer"
                            >
                                Yopish ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default GalleryTab
