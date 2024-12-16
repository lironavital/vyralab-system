export default function ShowPopup({ isShowingState, closeFunction, children }) {
    if (isShowingState) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', position: 'absolute', width: '100%', height: "100vh", overflow: 'unset', zIndex: '999' }} onClick={closeFunction}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', margin: '20px' }}>
                <button onClick={closeFunction}>X</button>
                {children}
            </div>
        </div>
    }
    else {
        return null
    }
}