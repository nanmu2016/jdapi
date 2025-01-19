import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const request = event.request
  
  // 处理 CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  // 如果是上传请求,转发到京东图床 API
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/upload') {
    const response = await fetch(env.API_URL, {
      method: 'POST',
      body: request.body,
      headers: request.headers
    })

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    })
  }

  // 处理静态资源请求
  try {
    const response = await getAssetFromKV(event)
    
    // 添加 CORS 头
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    
    return new Response(response.body, {
      status: response.status,
      headers
    })
  } catch (e) {
    // 处理 404 等错误
    return new Response(`Not Found: ${request.url}`, { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// 根据文件扩展名获取 Content-Type
function getContentType(path) {
  const ext = path.split('.').pop().toLowerCase()
  const types = {
    'html': 'text/html; charset=UTF-8',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml'
  }
  return types[ext] || 'text/plain'
} 