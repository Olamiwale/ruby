import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import { fileURLToPath } from 'url'
import path from 'path'

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createJestConfig = nextJest({
  dir: path.join(__dirname, '../'),
})

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.join(__dirname, './jest.setup.ts')],
  moduleNameMapper: {
    '^@/(.*)$': path.join(__dirname, '../$1'),
  },
}

export default createJestConfig(config)