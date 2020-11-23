import path from 'path'
import { saveVideo } from 'playwright-video'
import { globals } from '../jest.config'
import logger from './logger'

let videoCapture
const video = process.env.VIDEO === 'true'

beforeEach(async () => {
  let userAgent = await page.evaluate(() => navigator.userAgent)

  await jestPlaywright.resetContext({
    userAgent: `E2E-tests ${userAgent}`
  })

  userAgent = await page.evaluate(() => navigator.userAgent)
  logger.info(`User agent: ${userAgent}`)

  if (video) {
    videoCapture = await saveVideo(
      page,
      path.resolve(globals.VIDEO_DIR, `capture_${new Date().getTime()}.mp4`)
    )
  }

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await expect(page.title()).resolves.toMatch('Demo shop')
})

afterEach(async () => {
  if (video) {
    await videoCapture.stop()
  }
})