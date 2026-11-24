// Xakaton sahifasi ma'lumotlari db.json dan olinadi

import db from '../../../db.json'

export const HACKATHON = db.hackathon

export const TABS = HACKATHON.tabs
export const STEPS = HACKATHON.steps
export const QUICK_ACTIONS = HACKATHON.quickActions
export const PREPARATION_ITEMS = HACKATHON.preparation
export const RESOURCES = HACKATHON.resources
export const TOPICS = HACKATHON.topics
export const TEAMS = HACKATHON.teams
export const GALLERY = HACKATHON.gallery
export const RESULTS = HACKATHON.results
export const CERTIFICATES = HACKATHON.certificates

export const WORK_STORAGE_KEY = 'mars_hackathon_work'
export const TOPIC_STORAGE_KEY = 'mars_hackathon_topic'
export const PREP_STORAGE_KEY = 'mars_hackathon_prep'
export const TEAM_STORAGE_KEY = 'mars_hackathon_team'
export const MEMBERSHIP_STORAGE_KEY = 'mars_hackathon_memberships'

export const loadJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

export const saveJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // localStorage yopiq bo'lsa sahifa baribir ishlaydi
    }
}
