import { useState } from "react";
import { Link } from "react-router-dom";

const companies = [
    {
        id: "amazon",
        name: "Amazon",
        logo: "https://lab.marsit.uz/media/quiz_theme_images/Amazon/Amazon-512.webp",
        logoClass: "rounded-full object-cover",
        summary: "10 ta masala | 45% bajarildi",
        tasks: [
            "Buyurtmalar Summasini Hisoblash",
            "Mahsulot Narxlarini Chegirma Bilan Qayta Hisoblash",
            "Ombor Qoldiqlarini Filtrlash",
            "Eng Ko'p Sotilgan Mahsulotni Topish",
            "Yetkazib Berish Kunlarini Hisoblash",
            "Mijoz Sharhlarini Baholash",
            "Takroriy Mahsulot IDlarini Olib Tashlash",
            "Savatdagi Mahsulotlar Sonini Aniqlash",
            "Valyuta Kursi Bo'yicha Narxlarni Aylantirish",
            "Qaytarilgan Buyurtmalarni Ajratish",
        ],
    },
    {
        id: "netflix",
        name: "Netflix",
        logo: "https://lab.marsit.uz/media/quiz_theme_images/Netflix/Netflix_icon.jpeg",
        logoClass: "rounded-full object-cover border border-slate-100",
        summary: "8 ta masala | 30% bajarildi",
        tasks: [
            "Film Janrlarini Ajratib Olish",
            "Tomosha Vaqtini Hisoblash",
            "Eng Uzoq Filmni Topish",
            "Serial Fasllarini Saralash",
            "Foydalanuvchi Reytinglarini Baholash",
            "Takroriy Tomoshalarni Olib Tashlash",
            "Tavsiya Ro'yxatini Tuzish",
            "Subtitr Tillarini Filtrlash",
        ],
    },
    {
        id: "google",
        name: "Google",
        logo: "https://lab.marsit.uz/media/quiz_theme_images/Google/Google_icon.png",
        logoClass: "rounded-full object-contain p-2 bg-slate-50",
        summary: "11 ta masala | 20% bajarildi",
        tasks: [
            "Gmail Domenli Manzillarni Ajratish",
            "Qidiruv So'zlari Uzunligini Hisoblash",
            "Tadbirlardagi Noyob Ishtirokchilar Soni",
            "Shahar Nomlarini Alifbo Tartibida Saralash",
            "Videolar Tomosha Qilingan Vaqtni Daqiqaga Aylantirish",
            "O'zbek Tilidagi Matnlarni Ajratib Olish",
            "Matn Belgilar Sonini Hisoblash",
            "Email Domenlarini Ajratib Olish",
            "So'zlar Qanchalik Ko'p Qidirilganini Aniqlash",
            "YouTube Kanal Nomlarini Normallashtirish",
            "Qidiruv Natijalaridan URL Manzillarni Ajratish",
        ],
    },
    {
        id: "facebook",
        name: "facebook",
        logo: "https://lab.marsit.uz/media/quiz_theme_images/Facebook/Facebook_f_logo_2021.svg.png",
        logoClass: "rounded-full object-cover",
        summary: "12 ta masala | 67% bajarildi",
        tasks: [
            "Do'stlar Ro'yxatidagi Noyob Ismlar",
            "Postdagi Layk va Komentariylarni Hisoblash",
            "Xabar Matnidagi So'zlarni Ajratish",
            "Guruh A'zolarini Saralash",
            "Rasm Yuklash Vaqtini Aniqlash",
            "Hashtaglarni Ajratib Olish",
            "Foydalanuvchi Ismlarini Formatlash",
            "Eng Faol Foydalanuvchini Topish",
            "Postlar Sanasini Saralash",
            "Emoji Sonini Hisoblash",
            "Takroriy Xabarlarni Olib Tashlash",
            "Guruh Postlarini Filtrlash",
        ],
    },
];

const Alogo = () => {
    const [selectedId, setSelectedId] = useState(null);
    const selected = companies.find((company) => company.id === selectedId);

    const handleOpen = (id) => {
        setSelectedId(id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (selected) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors cursor-pointer"
                >
                    &larr; Kompaniyalar ro'yxatiga qaytish
                </button>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-6 px-8 py-6 border-b border-slate-100">
                        <img
                            src={selected.logo}
                            alt={selected.name}
                            className={`w-20 h-20 shrink-0 ${selected.logoClass}`}
                        />
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-normal text-slate-900">{selected.name}</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {selected.tasks.length} ta masala | 0% bajarildi
                            </p>
                        </div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {selected.tasks.map((task, index) => (
                            <li
                                key={task}
                                className="flex items-center justify-between gap-4 px-8 py-5 hover:bg-slate-50/70 transition-colors"
                            >
                                <span className="text-base text-slate-800">
                                    {index + 1}. {task}
                                </span>
                                <button
                                    type="button"
                                    className="shrink-0 w-[120px] text-center bg-[#e6f4fd] hover:bg-[#d0eafb] text-[#4b9fd3] text-sm font-medium px-6 py-2.5 rounded-md transition-colors cursor-pointer"
                                >
                                    Start
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className='text-2xl font-normal text-slate-900 tracking-tight'>
                TOP Kompaniyalar
            </h1>
            <img className="mt-[20px]" src="https://space.marsit.uz/img/editor-ads.08b4da43.webp" alt="" />
            <section className="flex items-center jutify-between mt-[30px] gap-10 bg-[white] p-[20px] rounded-lg">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Olimpiada masalalari — mars.algo</h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-3">Bu yerda mashhur kompaniyalar mahsulotlari asosidagi masalalarni yechasan. mars.algoʼda esa olimpiada masalalari: divizionlar, haftalik reyting, oylik musobaqalar.</p>
                    <p className="text-sm text-slate-500">9–16 avgust kunlari Toshkentda IOI 2026 — informatika boʻyicha xalqaro olimpiada — Oʻzbekiston tarixida birinchi marta oʻtadi.</p>
                </div>
                <div className="flex items-center gap-[10px]">
                    <Link to="" className=" w-[350px]  text-center bg-[#F26522] hover:bg-[#d95618] text-white font-semibold text-base px-7 py-3.5 rounded-lg transition-colors duration-200">
                        <span>Masalalarni yechishni boshlash</span>
                        <span> &rarr; </span>
                    </Link>

                </div>
            </section>
            <section className="w-full bg-slate-50 py-8">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">

                    {/* 1-qator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[0].logo} alt="Amazon" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Amazon</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[0].summary}</p>
                                <button type="button" onClick={() => handleOpen(companies[0].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[1].logo} alt="Netflix" className="w-20 h-20 rounded-full object-cover border border-slate-100" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Netflix</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[1].summary}</p>
                                <button type="button" onClick={() => handleOpen(companies[1].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2-qator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[2].logo} alt="Google" className="w-20 h-20 rounded-full object-contain p-2 bg-slate-50" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Google</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[2].summary}</p>
                                <button type="button" onClick={() => handleOpen(companies[2].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[3].logo} alt="Facebook" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900 capitalize">{companies[3].name}</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[3].summary}</p>
                                <button type="button" onClick={() => handleOpen(companies[3].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    )
}

export default Alogo
