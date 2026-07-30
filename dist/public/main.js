'use strict';{
    const { h, t } = HFS

    HFS.onEvent('fileMenu', ({ entry }) => {
        // 如果是文件，顯示"Copy link"
        if (!entry.isFolder) {
            return [{
                id: 'copy-link',
                icon: 'copy',
                label: t("Copy link"),
                async onClick() {
                    try {
                        const res = await HFS.customRestCall('get_download_url', { uri: entry.uri })
                        HFS.copyTextToClipboard(res.url)
                        HFS.toast(t("Link copied"), 'success')
                    } catch (e) {
                        HFS.dialogLib.alertDialog(String(e), 'error')
                    }
                }
            }]
        }
        
        // 如果是文件夹，顯示"Copy all links"
        return [{
            id: 'copy-all-links',
            icon: 'copy',
            label: t("Copy all links"),
            async onClick() {
                try {
                    // 构建获取文件列表的URL
                    const listUrl = entry.uri + '?get=list&folders=*'
                    const response = await fetch(listUrl)
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch file list: ${response.status}`)
                    }
                    
                    const text = await response.text()
                    const links = text.trim().split('\n').filter(link => link.trim())
                    
                    if (links.length === 0) {
                        HFS.toast(t("No files found"), 'warning')
                        return
                    }
                    
                    // 将所有链接用换行符连接并复制
                    const allLinks = links.join('\n')
                    HFS.copyTextToClipboard(allLinks)
                    HFS.toast(t(`${links.length} links copied`), 'success')
                    
                } catch (e) {
                    HFS.dialogLib.alertDialog(String(e), 'error')
                }
            }
        }]
    })
}