import fs from 'fs'

const srcPath = './src'
const distPath = './dist'
const adaptersPath = 'adapters'
const eventsPath = 'events'

export const generateMainEntries = () => {
  return [
    generateEntry(`${srcPath}/index.ts`, distPath)
  ]
}

export const generateAdapterEntries = () => {
  const adapters = fs.readdirSync(`${srcPath}/${adaptersPath}`)

  return adapters.map((filename, ) => {
    return generateEntry(`${srcPath}/${adaptersPath}/${filename}`, `${distPath}/${adaptersPath}`)
  })
}

export const generateEventEntries = () => {
  const eventEntries = []

  const applications = fs.readdirSync(`${srcPath}/${eventsPath}`)

  applications.forEach((applicationId) => {
    const categories = fs.readdirSync(`${srcPath}/${eventsPath}/${applicationId}`)

    categories.forEach((categoryId) => {
      const events = fs.readdirSync(`${srcPath}/${eventsPath}/${applicationId}/${categoryId}`)

      events.forEach((eventFilename) => {
        eventEntries.push(
          generateEntry(
            `${srcPath}/${eventsPath}/${applicationId}/${categoryId}/${eventFilename}`,
            `${distPath}/${eventsPath}/${applicationId}/${categoryId}`)
        )
      })
    })
  })

  return eventEntries
}

const generateEntry = (filename, dir) => (  {
    input: filename,
    output: [
      {
        dir,
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].esm.js',
      },
      {
        dir,
        format: 'commonjs',
        sourcemap: true,
        entryFileNames: '[name].js',
      },
    ],
  }
)
