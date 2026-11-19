import { useState } from 'react'
import HackathonHero from '../Components/Hackathon/HackathonHero'
import HomeTab from '../Components/Hackathon/HomeTab'
import PreparationTab from '../Components/Hackathon/PreparationTab'
import MyTeamTab from '../Components/Hackathon/MyTeamTab'
import TeamsTab from '../Components/Hackathon/TeamsTab'
import TopicsTab from '../Components/Hackathon/TopicsTab'
import SubmitTab from '../Components/Hackathon/SubmitTab'
import GalleryTab from '../Components/Hackathon/GalleryTab'
import ResultsTab from '../Components/Hackathon/ResultsTab'
import CertificatesTab from '../Components/Hackathon/CertificatesTab'

const Hackathon = () => {
    const [activeTab, setActiveTab] = useState('home')

    const changeTab = (tab) => {
        setActiveTab(tab)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
            <HackathonHero activeTab={activeTab} onChangeTab={changeTab} />

            {activeTab === 'home' && <HomeTab onChangeTab={changeTab} />}

            {activeTab === 'preparation' && <PreparationTab />}

            {activeTab === 'my-team' && <MyTeamTab />}

            {activeTab === 'teams' && <TeamsTab />}

            {activeTab === 'topics' && <TopicsTab onChangeTab={changeTab} />}

            {activeTab === 'submit' && <SubmitTab />}

            {activeTab === 'gallery' && <GalleryTab />}

            {activeTab === 'results' && <ResultsTab />}

            {activeTab === 'certificates' && <CertificatesTab />}
        </div>
    )
}

export default Hackathon
