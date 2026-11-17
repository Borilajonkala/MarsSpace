import { Link } from "react-router-dom";

const Alogo = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className='text-2xl font-normal text-slate-900 tracking-tight'>
                TOP Kompaniyalar
            </h1>
            <img className="mt-[20px]" src="https://space.marsit.uz/img/editor-ads.08b4da43.webp" alt="" />
            <section className="flex items-center justify-between mt-[30px] gap-10 bg-[white] p-[20px] rounded-lg">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Olimpiada masalalari — mars.algo</h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-3">Bu yerda mashhur kompaniyalar mahsulotlari asosidagi masalalarni yechasan. mars.algoʼda esa olimpiada masalalari: divizionlar, haftalik reyting, oylik musobaqalar.</p>
                    <p className="text-sm text-slate-500">9–16 avgust kunlari Toshkentda IOI 2026 — informatika boʻyicha xalqaro olimpiada — Oʻzbekiston tarixida birinchi marta oʻtadi.</p>
                </div>
                <div className="flex items-center gap-[10px]">
                    <Link to="" className=" w-[350px]  text-center bg-[#F26522] hover:bg-[#d95618] text-white font-semibold text-base px-7 py-3.5 rounded-lg transition-colors duration-200">
                        <span>Masalalarni yechishni boshlash</span>
                        <span> → </span>
                    </Link>

                </div>
            </section>
            <section className="w-full bg-slate-50 py-8">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">

                    {/* 1-qator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src="https://lab.marsit.uz/media/quiz_theme_images/Amazon/Amazon-512.webp" alt="Amazon" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Amazon</h2>
                                <p className="text-sm text-slate-500 mt-1">10 ta masala | 45% bajarildi</p>
                                <a href="#" className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors"  >   Kirish &gt;
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src="https://lab.marsit.uz/media/quiz_theme_images/Netflix/Netflix_icon.jpeg" alt="Netflix" className="w-20 h-20 rounded-full object-cover border border-slate-100" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Netflix</h2>
                                <p className="text-sm text-slate-500 mt-1">8 ta masala | 30% bajarildi</p>
                                <a href="#" className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors" >   Kirish &gt;
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 2-qator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src="https://lab.marsit.uz/media/quiz_theme_images/Google/Google_icon.png" alt="Google" className="w-20 h-20 rounded-full object-contain p-2 bg-slate-50" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Google</h2>
                                <p className="text-sm text-slate-500 mt-1">11 ta masala | 20% bajarildi</p>
                                <a href="#" className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors" >   Kirish &gt;
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src="https://lab.marsit.uz/media/quiz_theme_images/Facebook/Facebook_f_logo_2021.svg.png" alt="Facebook" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900 capitalize">facebook</h2>
                                <p className="text-sm text-slate-500 mt-1">12 ta masala | 67% bajarildi</p>
                                <a href="#" className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors" >   Kirish &gt;
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    )
}

export default Alogo