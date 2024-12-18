const links = [
    { name: 'TikTok', path: '/tiktok', imageSrc: 'https://img.icons8.com/color/48/instagram-new--v1.png' },
    { name: 'YouTube', path: '/youtube', imageSrc: 'https://img.icons8.com/color/48/youtube-play.png' },
    { name: 'TikTok', path: '/tiktok', imageSrc: 'https://img.icons8.com/color/48/tiktok--v1.png' },
]

export default function Sidebar({ sidebarWidth, setSidebarWidth }) {
    return (
        <>
            <div style={{ width: sidebarWidth }} className='sidebar'>
                {links.map(i => (
                    <a key={i.path} href={i.path} style={{ fontSize: '30px', textAlign: 'left', textDecoration: 'none', color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', width: '100%', }}>
                        <img width="32" height="32" src={i.imageSrc} alt={`${i.name}-play`} />
                        <span>{i.name}</span>
                    </a>
                ))}
            </div>
        </>
    );
}
