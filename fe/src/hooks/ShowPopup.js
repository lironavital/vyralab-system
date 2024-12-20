export default function ShowPopup({ isShowingState, closeFunction, width = '100%', children }) {
    if (isShowingState) {
        return <div style={{ width: '100%', position: 'absolute', top: '0', left: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)', height: "100vh", overflow: 'unset', zIndex: '999' }} onClick={closeFunction}>
            <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'red', width }}>
                <button onClick={closeFunction}>X</button>
                {children}
            </div>
        </div>
    }
    else {
        return null
    }
}