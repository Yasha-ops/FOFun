import { ArrowDownRightSquareIcon, Github, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Popup = () => {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    // Function to initiate the download of a text file
    function downloadTextFile(text, fileName) {
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = fileName

        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    function handleClick() {
        console.log('Popup: Button clicked')
        setIsDownloading(true)
        chrome.runtime.sendMessage({ command: 'service_get_ips' })
    }

    useEffect(() => {
        // Écouter les messages du script de fond (service-worker.ts)
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            const { command, data } = message
            console.log('Popup received message:', message)

            switch (command) {
                case 'popup_download_ips':
                    console.log('Got ips :', data)
                    if (!data) {
                        // Error
                        setIsError(true)
                        setIsDownloading(false)
                        break
                    }

                    downloadTextFile(data.join('\n'), 'ips.txt')
                    setIsDownloading(false)
                    break
                default:
                    break
            }
        })
    }, [])

    console.log(document.URL)

    return (
        <div className="inline-flex flex-col gap-5 justify-between p-8 w-80 rounded-xl border shadow bg-neutral-900">
            <div className="inline-flex flex-col gap-2 justify-start items-start">
                <div className="text-xl font-semibold leading-none text-neutral-50">FOFun</div>

                <div className="text-sm opacity-40 text-neutral-100">
                    Automatically extract IP addresses from a FOFA page.
                </div>
            </div>

            <div className="flex gap-2 w-full">
                <button
                    className={`flex flex-auto justify-center items-center px-8 py-2 w-full text-sm font-bold leading-tight text-center rounded-md min-w-fit bg-zinc-800 text-neutral-50 hover:bg-zinc-700
                    ${isError && '!border-2  !border-red-600 !text-red-500'}`}
                    onClick={() => handleClick()}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : isError ? (
                        'An error occured'
                    ) : (
                        'Download'
                    )}
                </button>

                <a
                    className="flex justify-center items-center px-8 py-2 w-full text-sm font-bold leading-tight text-center rounded-md min-w-fit bg-zinc-800 text-neutral-50 hover:bg-zinc-700"
                    href="#"
                >
                    <Github size={20} />
                </a>
            </div>
        </div>
    )
}

export default Popup
