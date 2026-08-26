import { expect, test } from '@playwright/test'

const calculator = async (page) => {
  await page.goto('/')
  return {
    form: page.locator('#calculator'),
    first: page.getByTestId('first'),
    second: page.getByTestId('second'),
    add: page.getByTestId('add'),
    result: page.getByTestId('result'),
  }
}

test('preserves the fixed markup and accessibility contract', async ({ page }) => {
  const ui = await calculator(page)

  await expect(ui.form).toHaveClass('calculator')
  await expect(ui.first).toHaveAttribute('id', 'first-number')
  await expect(ui.first).toHaveAttribute('name', 'first')
  await expect(ui.first).toHaveAttribute('required', '')
  await expect(ui.first).toHaveAttribute('inputmode', 'decimal')
  await expect(ui.second).toHaveAttribute('id', 'second-number')
  await expect(ui.second).toHaveAttribute('name', 'second')
  await expect(ui.result).toHaveAttribute('id', 'result')
  await expect(ui.result).toHaveAttribute('aria-live', 'polite')
  await expect(ui.result).toHaveText('—')
})

test('adds non-negative decimal values with either separator without reloading', async ({ page }) => {
  const ui = await calculator(page)
  const initialUrl = page.url()

  await ui.first.fill('1,5')
  await ui.second.fill('2.25')
  await ui.add.click()

  await expect(ui.result).toHaveText('3.75')
  await expect(page).toHaveURL(initialUrl)
})

test('rejects invalid and missing values with native validation feedback', async ({ page }) => {
  const ui = await calculator(page)

  await ui.first.fill('1.')
  await ui.second.fill('')
  await ui.add.click()

  expect(await ui.first.evaluate((input) => input.validity.valid)).toBe(false)
  expect(await ui.second.evaluate((input) => input.validity.valid)).toBe(false)
  await expect(ui.first).toHaveJSProperty('validationMessage', 'Enter a valid decimal number.')
  await expect(ui.result).toHaveText('—')
})

test('keeps controls keyboard-accessible with visible focus treatment', async ({ page }) => {
  const ui = await calculator(page)

  await ui.first.focus()
  await expect(ui.first).toBeFocused()
  await expect(ui.first).toHaveCSS('outline-width', '2px')

  await ui.first.press('Tab')
  await expect(ui.second).toBeFocused()
  await ui.second.press('Tab')
  await expect(ui.add).toBeFocused()
  await expect(ui.add).toHaveCSS('outline-width', '2px')
})

test('matches the approved default visual baseline', async ({ page }, testInfo) => {
  await calculator(page)
  await expect(page).toHaveScreenshot(`calculator-${testInfo.project.name}.png`, {
    animations: 'disabled',
    caret: 'hide',
    fullPage: true,
  })
})

test('retains interaction styles and reduced-motion behaviour', async ({ page }) => {
  const ui = await calculator(page)

  await ui.add.hover()
  await expect(ui.add).toHaveCSS('background-color', 'rgb(21, 58, 137)')
  await ui.add.focus()
  await expect(ui.add).toHaveCSS('outline-width', '2px')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(ui.add).toHaveCSS('transition-duration', '1e-05s')
})
