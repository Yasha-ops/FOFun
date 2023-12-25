import React from 'react'
import { createRoot } from 'react-dom/client'
import styles from '@/styles/index.css?inline'
import App from './App'

const isProduction: boolean = process.env.NODE_ENV === 'production'
const ROOT_ID = 'RENAME_ME_IF_YOU_WANT'

const injectReact = (rootId: string): void => {
    try {
        const container = document.createElement('div')
        document.body.appendChild(container)

        if (container) {
            container.id = rootId
            container.style.position = 'inherit'
            container.style.zIndex = '2147483666'
        }

        if (isProduction) {
            console.log('Production mode 🚀. Adding Shadow DOM')
            container.attachShadow({ mode: 'open' })
        } else {
            console.log('Development mode 🛠')
        }

        const target: ShadowRoot | HTMLElement = isProduction ? container.shadowRoot! : container

        const root = createRoot(target!)

        root.render(
            <React.StrictMode>
                <>
                    {isProduction && <style>{styles.toString()}</style>}
                    <App />
                </>
            </React.StrictMode>
        )
    } catch (error) {
        console.error('Error Injecting React', error)
    }
}

function get_ips() {
    let ips: string[] = Array.from(document.getElementsByClassName('hsxa-host')).map(
        (div: HTMLElement) => div.innerText
    )

    return ips
}

// content/index.tsx
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { command } = message
    console.log('Content script received message:', message)

    switch (command) {
        case 'content_get_ips':
            console.log('Getting ips from the current page')
            const ips = get_ips()
            // injectReact(ROOT_ID)
            chrome.runtime.sendMessage({
                command: 'service_ips_list_response',
                data: ips.length ? ips : null
            })
        default:
            break
    }
})
