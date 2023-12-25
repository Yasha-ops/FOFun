import { XSquare } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const App = () => {
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        setTimeout(() => setIsOpen(false), 2000)
    }, [])

    return (
        <>
            {isOpen && (
                <div
                    className="fixed top-0 right-0 p-4 h-10 bg-green-400"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="text-xl font-bold text-white">
                        IPs Downloaded Successfully 🚀
                    </div>
                </div>
            )}
        </>
    )
}

export default App
