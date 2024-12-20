import { useResolvedPath } from 'react-router-dom';
import '../main.css'
import { useEffect } from 'react';

const links = [
    { name: 'Instagram', path: '/instagram', imageSrc: 'https://img.icons8.com/color/48/instagram-new--v1.png' },
    { name: 'YouTube', path: '/youtube', imageSrc: 'https://img.icons8.com/color/48/youtube-play.png' },
    { name: 'TikTok', path: '/tiktok', imageSrc: 'https://img.icons8.com/color/48/tiktok--v1.png' },
]

export default function Sidebar({ }) {
    const { pathname } = useResolvedPath()

    return (<div className='sidebar'>
        {links.map((i, index) => (
            <a key={i.path} href={i.path} className={`sidebarItem ${pathname === i.path ? "currentPath" : ""}`} style={index === 0 ? { marginTop: '15px' } : {}}>
                <img width="32" height="32" src={i.imageSrc} alt={`${i.name}-play`} />
                <div>{i.name}</div>
            </a>
        ))
        }
    </div>
    );
}
