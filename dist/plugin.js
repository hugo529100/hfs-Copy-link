
exports.description = "Add 'Copy link' for files and 'Copy all links' for folders to right-click menu"
exports.version = 1.0
exports.apiRequired = 12.92
exports.repo = "Hug3O/Copy-link"
exports.frontend_js = "main.js"

exports.init = api => {
    const { getBaseUrlOrDefault } = api.require('./listen')
    const { urlToNode } = api.require('./vfs')

    return {
        customRest: {
            // 獲取文件的完整下載 URL
            async get_download_url({ uri }, ctx) {
                if (!uri) throw "missing uri"
                const node = await urlToNode(uri, ctx)
                if (!node) throw "bad uri"
                const baseUrl = await getBaseUrlOrDefault()
                // 去掉 uri 末尾的斜杠（如果是資料夾）或保留文件路徑
                const cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri
                return { url: baseUrl + cleanUri }
            }
        }
    }
}