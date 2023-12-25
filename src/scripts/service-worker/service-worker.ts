console.log('Background Service Worker Loaded')

chrome.action.setBadgeText({ text: 'ON' })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { command, data } = message
    console.log(message)
    switch (command) {
        case 'service_get_ips':
            console.log('Service worker received get_ips command')
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                const activeTab = tabs[0]
                chrome.tabs.sendMessage(activeTab.id!, { command: 'content_get_ips' })
            })
            break
        case 'service_ips_list_response':
            console.log('Service worker received service_ips_list_response')
            chrome.runtime.sendMessage({ command: 'popup_download_ips', data })
            break
        default:
            break
    }
})

chrome.commands.onCommand.addListener(command => {
    console.log(`Command: ${command}`)

    if (command === 'refresh_extension') {
        chrome.runtime.reload()
    }
})

export {}
