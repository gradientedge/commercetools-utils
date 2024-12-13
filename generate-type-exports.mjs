import fs from 'node:fs'
import { execSync } from 'node:child_process'

const CHECKOUT_DIR = './.commercetools-repo'
const IGNORED_FILES = ['api-client.ts']
const MODELS_DEST = './src/lib/types/models'

if (!fs.existsSync(CHECKOUT_DIR)) {
  fs.mkdirSync(CHECKOUT_DIR)
  execSync(`git clone git@github.com:commercetools/commercetools-sdk-typescript.git ${CHECKOUT_DIR}`, {
    stdio: 'inherit',
  })
}

const typesDir = `${CHECKOUT_DIR}/packages/platform-sdk/src/generated/models`
let files = fs.readdirSync(typesDir)

files = files.filter((file) => file.endsWith('.ts') && !IGNORED_FILES.includes(file))

execSync(`mkdir -p ${MODELS_DEST}`, { stdio: 'inherit' })

for (let fileName of files) {
  // Read the file in to a string
  execSync(`cp ${typesDir}/${fileName} ${MODELS_DEST}`)
  const fileContents = fs.readFileSync(`${MODELS_DEST}/${fileName}`, 'utf8')
  let updatedFileContents = fileContents.replaceAll(/ from '(.*?)'/g, `from '$1.js'`)
  updatedFileContents = updatedFileContents.replaceAll(' ', ' ')
  fs.writeFileSync(`${MODELS_DEST}/${fileName}`, updatedFileContents)
}

fs.writeFileSync(
  `${MODELS_DEST}/index.ts`,
  files.map((file) => `export * from './${file.replace('.ts', '.js')}'`).join('\n'),
  'utf8',
)

execSync('pnpm prettify', { stdio: 'inherit' })
