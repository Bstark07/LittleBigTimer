import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const audioDirectory = path.join(process.cwd(), 'public', 'audio')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(audioDirectory)
      const audioFiles = files.filter(file => file.endsWith('.mp3'))
      res.status(200).json(audioFiles)
    } catch (error) {
      console.error('Error reading audio directory:', error)
      res.status(500).json({ error: 'Error reading audio directory' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

