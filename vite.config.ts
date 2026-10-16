import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

// API plugin for local dev and preview servers
function responseApiPlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), '.data')
  const responsesFile = path.resolve(dataDir, 'responses.json')
  const surprisesFile = path.resolve(dataDir, 'surprises.json')

  const ensureStorage = () => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(responsesFile)) {
      fs.writeFileSync(responsesFile, JSON.stringify([]), 'utf-8')
    }
    if (!fs.existsSync(surprisesFile)) {
      fs.writeFileSync(surprisesFile, JSON.stringify({}), 'utf-8')
    }
  }

  const readResponses = (): unknown[] => {
    try {
      ensureStorage()
      const content = fs.readFileSync(responsesFile, 'utf-8')
      return JSON.parse(content || '[]')
    } catch {
      return []
    }
  }

  const writeResponses = (data: unknown[]) => {
    try {
      ensureStorage()
      fs.writeFileSync(responsesFile, JSON.stringify(data, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed to write responses:', err)
    }
  }

  const readSurprises = (): Record<string, unknown> => {
    try {
      ensureStorage()
      const content = fs.readFileSync(surprisesFile, 'utf-8')
      return JSON.parse(content || '{}')
    } catch {
      return {}
    }
  }

  const writeSurprises = (data: Record<string, unknown>) => {
    try {
      ensureStorage()
      fs.writeFileSync(surprisesFile, JSON.stringify(data, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed to write surprises:', err)
    }
  }

  const middlewareHandler = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
    const pathname = parsedUrl.pathname

    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify({ status: 'ok', server: 'vite-plugin', time: new Date().toISOString() }))
      return
    }

    // Surprises collection: POST
    if (pathname === '/api/surprises' && req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          if (!parsed || !parsed.id) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing surprise id' }))
            return
          }
          const surprises = readSurprises()
          surprises[parsed.id] = parsed
          writeSurprises(surprises)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 201
          res.end(JSON.stringify({ success: true, id: parsed.id }))
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid JSON body' }))
        }
      })
      return
    }

    // Single surprise lookup: GET /api/surprises/:id
    if (pathname.startsWith('/api/surprises/') && req.method === 'GET') {
      const id = decodeURIComponent(pathname.replace('/api/surprises/', ''))
      const surprises = readSurprises()
      const found = surprises[id]
      res.setHeader('Content-Type', 'application/json')
      if (found) {
        res.statusCode = 200
        res.end(JSON.stringify(found))
      } else {
        res.statusCode = 404
        res.end(JSON.stringify({ error: 'Surprise not found' }))
      }
      return
    }

    // Responses collection: GET and POST
    if (pathname === '/api/responses') {
      if (req.method === 'GET') {
        const list = readResponses()
        const momentId = parsedUrl.searchParams.get('momentId') || parsedUrl.searchParams.get('surpriseId')
        const filtered = momentId ? (list as any[]).filter((r: any) => r.momentId === momentId || r.surpriseId === momentId) : list
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify(filtered))
        return
      }

      if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body)
            if (!parsed || !parsed.id) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing response id' }))
              return
            }
            const list = readResponses()
            const updated = [parsed, ...list.filter((r: any) => r.id !== parsed.id)]
            writeResponses(updated)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 201
            res.end(JSON.stringify({ success: true, item: parsed }))
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid JSON body' }))
          }
        })
        return
      }
    }

    // Audio upload: POST /api/upload-audio
    if (pathname === '/api/upload-audio' && req.method === 'POST') {
      const chunks: Buffer[] = []
      req.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })
      req.on('end', () => {
        try {
          const fullBuffer = Buffer.concat(chunks)
          const mediaDir = path.resolve(dataDir, 'media')
          if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir, { recursive: true })
          }
          const filename = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webm`
          const filePath = path.resolve(mediaDir, filename)
          fs.writeFileSync(filePath, fullBuffer)

          res.statusCode = 201
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, url: `/api/media/${filename}` }))
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Failed to save audio file' }))
        }
      })
      return
    }

    // Serve media: GET /api/media/:filename
    if (pathname.startsWith('/api/media/') && (req.method === 'GET' || req.method === 'HEAD')) {
      const filename = path.basename(pathname.replace('/api/media/', ''))
      const mediaDir = path.resolve(dataDir, 'media')
      const filePath = path.resolve(mediaDir, filename)

      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath)
        res.setHeader('Content-Type', 'audio/webm')
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Accept-Ranges', 'bytes')
        fs.createReadStream(filePath).pipe(res)
        return
      } else {
        res.statusCode = 404
        res.end('Media not found')
        return
      }
    }

    next()
  }

  return {
    name: 'response-api-plugin',
    configureServer(server) {
      server.middlewares.use(middlewareHandler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middlewareHandler)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    responseApiPlugin(),
  ],
})
