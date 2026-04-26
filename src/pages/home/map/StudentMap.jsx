import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '../../../context/AppContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const locations = [
    { id: 1,  name: 'Dhaka',       nameBn: 'ঢাকা',        division: 'Dhaka',      students: 4200, lat: 23.8103, lng: 90.4125 },
    { id: 2,  name: 'Chittagong',  nameBn: 'চট্টগ্রাম',   division: 'Chittagong', students: 2800, lat: 22.3569, lng: 91.7832 },
    { id: 3,  name: 'Sylhet',      nameBn: 'সিলেট',       division: 'Sylhet',     students: 1500, lat: 24.8949, lng: 91.8687 },
    { id: 4,  name: 'Rajshahi',    nameBn: 'রাজশাহী',     division: 'Rajshahi',   students: 1200, lat: 24.3745, lng: 88.6042 },
    { id: 5,  name: 'Khulna',      nameBn: 'খুলনা',       division: 'Khulna',     students: 980,  lat: 22.8456, lng: 89.5403 },
    { id: 6,  name: 'Barisal',     nameBn: 'বরিশাল',      division: 'Barisal',    students: 760,  lat: 22.7010, lng: 90.3535 },
    { id: 7,  name: 'Mymensingh',  nameBn: 'ময়মনসিংহ',   division: 'Mymensingh', students: 640,  lat: 24.7471, lng: 90.4203 },
    { id: 8,  name: 'Rangpur',     nameBn: 'রংপুর',       division: 'Rangpur',    students: 580,  lat: 25.7439, lng: 89.2752 },
    { id: 9,  name: 'Comilla',     nameBn: 'কুমিল্লা',    division: 'Chittagong', students: 520,  lat: 23.4607, lng: 91.1809 },
    { id: 10, name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', division: 'Dhaka',      students: 490,  lat: 23.6238, lng: 90.4996 },
    { id: 11, name: 'Gazipur',     nameBn: 'গাজীপুর',     division: 'Dhaka',      students: 430,  lat: 23.9999, lng: 90.4203 },
    { id: 12, name: 'Bogura',      nameBn: 'বগুড়া',       division: 'Rajshahi',   students: 380,  lat: 24.8465, lng: 89.3773 },
];

const divisionColors = { Dhaka: '#60A5FA', Chittagong: '#FDBA74', Sylhet: '#F472B6', Rajshahi: '#4ADE80', Khulna: '#A78BFA', Barisal: '#FB923C', Mymensingh: '#34D399', Rangpur: '#F87171' };

const createIcon = (color) => L.divIcon({
    className: '',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>`,
    iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -36],
});

const FlyTo = ({ coords }) => { const map = useMap(); if (coords) map.flyTo(coords, 10, { duration: 1.2 }); return null; };

const t = {
    en: { badge: "We're Across Bangladesh", title: 'SmartKids Students', highlight: 'Everywhere', sub: 'From Teknaf to Tetulia — kids are learning with SmartKids all over Bangladesh.', placeholder: 'Search city or division...', students: 'students' },
    bn: { badge: 'সারা বাংলাদেশে আমরা', title: 'SmartKids শিক্ষার্থী', highlight: 'সর্বত্র', sub: 'টেকনাফ থেকে তেঁতুলিয়া — সারা বাংলাদেশে বাচ্চারা SmartKids-এ শিখছে।', placeholder: 'শহর বা বিভাগ খুঁজুন...', students: 'শিক্ষার্থী' },
};

const StudentMap = () => {
    const { lang } = useApp();
    const tx = t[lang];
    const [search, setSearch] = useState('');
    const [flyTo, setFlyTo] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const getLabel = (loc) => lang === 'bn' ? loc.nameBn : loc.name;

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        setSuggestions(val.length > 0 ? locations.filter(l => l.name.toLowerCase().includes(val.toLowerCase()) || l.nameBn.includes(val)) : []);
    };

    const selectLocation = (loc) => { setSearch(getLabel(loc)); setSuggestions([]); setFlyTo([loc.lat, loc.lng]); };
    const clearSearch = () => { setSearch(''); setSuggestions([]); setFlyTo(null); };

    const filtered = locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.nameBn.includes(search));

    return (
        <section className="py-16 px-6 bg-base-200">
            <div className="max-w-7xl mx-auto">
                <motion.div key={`map-header-${lang}`} initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.5 }} className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase"><FaMapMarkerAlt /> {tx.badge}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-neutral">{tx.title} <span className="text-primary">{tx.highlight}</span></h2>
                    <p className="text-neutral/50 text-sm mt-2">{tx.sub}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.1 }} className="relative max-w-md mx-auto mb-6">
                    <div className="flex items-center bg-base-100 border border-base-300 rounded-2xl px-4 py-3 shadow-sm gap-3">
                        <FaSearch className="text-primary shrink-0" />
                        <input type="text" value={search} onChange={handleSearch} placeholder={tx.placeholder} className="flex-1 outline-none text-sm text-neutral bg-transparent" />
                        {search && <button onClick={clearSearch} className="text-neutral/40 hover:text-neutral transition-colors"><FaTimes size={14} /></button>}
                    </div>
                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-2xl shadow-lg mt-1 z-[1000] overflow-hidden">
                            {suggestions.map(loc => (
                                <button key={loc.id} onClick={() => selectLocation(loc)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-left transition-colors">
                                    <FaMapMarkerAlt className="text-primary text-xs shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-neutral">{getLabel(loc)}</p>
                                        <p className="text-xs text-neutral/40">{loc.division} · {loc.students.toLocaleString()} {tx.students}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-3xl overflow-hidden shadow-xl border border-base-300" style={{ height: '480px' }}>
                    <MapContainer center={[23.685, 90.3563]} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {flyTo && <FlyTo coords={flyTo} />}
                        {filtered.map(loc => (
                            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={createIcon(divisionColors[loc.division] || '#60A5FA')}>
                                <Popup>
                                    <div className="text-center p-1">
                                        <p className="font-bold text-sm">{getLabel(loc)}</p>
                                        <p className="text-xs opacity-60">{loc.division}</p>
                                        <p className="text-primary font-bold text-base mt-1">{loc.students.toLocaleString()}+</p>
                                        <p className="text-xs opacity-50">{tx.students}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {Object.entries(divisionColors).map(([div, color]) => (
                        <span key={div} className="flex items-center gap-1.5 text-xs text-neutral/70 bg-base-100 px-3 py-1.5 rounded-full border border-base-300 shadow-sm">
                            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />{div}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudentMap;
