// PostToolUse (Write|Edit): corre Prettier del frontend sobre el archivo editado.
// Ignora archivos fuera de frontend/ y tipos que Prettier no soporta.
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

let raw = ''
for await (const chunk of process.stdin) raw += chunk

const input = JSON.parse(raw || '{}')
const file = input.tool_response?.filePath ?? input.tool_input?.file_path
if (!file) process.exit(0)

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const frontendDir = path.join(repoRoot, 'frontend')
const rel = path.relative(frontendDir, path.resolve(file))
if (rel.startsWith('..') || path.isAbsolute(rel)) process.exit(0)

const prettierBin = path.join(frontendDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs')
try {
  execFileSync(process.execPath, [prettierBin, '--write', '--ignore-unknown', rel], {
    cwd: frontendDir,
    stdio: ['ignore', 'ignore', 'inherit'],
  })
} catch {
  // Un error de formato (p. ej. sintaxis inválida) no debe bloquear la edición.
}
