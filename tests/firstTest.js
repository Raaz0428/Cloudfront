import { Builder, Browser, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Testing cloudfront app', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    await driver.get('https://d3pv22lioo8876.cloudfront.net/tiptop/');
  });

  after(async () => {
    await driver.quit();
  });

  it('Test 1: Verify the input is disabled', async () => {
    const inputDisabled = await driver.findElement(By.xpath('//input[@name="my-disabled"]'));
    const isDisabled = await inputDisabled.getAttribute('disabled');
    expect(isDisabled).to.not.be.null;
    console.log('Test 1 Passed: Input is disabled');
  });

  it('Test 2: Verify readonly input state', async () => {
    const readonlyInput = await driver.findElement(By.xpath('//input[@value="Readonly input"]'));
    const isReadonly = await readonlyInput.getAttribute('readonly');
    expect(isReadonly).to.not.be.null;
    console.log('Test 2 Passed: Input is readonly');
  });

  it('Test 4: Verify all dropdown options change to the same color on hover', async function () {
    const selectElement = await driver.findElement(By.xpath("//select[@name='my-select']"));

    await selectElement.click();

    const dropdownOptions = await driver.findElements(By.xpath("//select[@name='my-select']/option"));

    // Assert that there are 8 options in the dropdown
    expect(dropdownOptions.length).to.equal(8);

    // Initialize an array to store hover colors
    let hoverColors = [];

    // Simulate hover on each option using JavaScript
    for (let i = 0; i < dropdownOptions.length; i++) {
        // Scroll the option into view to make sure it's visible
        await driver.executeScript("arguments[0].scrollIntoView(true);", dropdownOptions[i]);

        await driver.executeScript("arguments[0].style.backgroundColor = 'rgba(0, 123, 255, 1)';", dropdownOptions[i]);

        await driver.sleep(500); // Adjust sleep time if necessary

        // Get the background color (or text color) after hovering
        const hoverColor = await dropdownOptions[i].getCssValue('background-color');  // Or use 'color' for text color

        // Store the hover color for comparison
        hoverColors.push(hoverColor);
    }

    // Check that all hover colors are the same
    const firstColor = hoverColors[0];
    for (let color of hoverColors) {
        expect(color).to.equal(firstColor); 
    }
    await selectElement.click();

    console.log('Test 4 Passed: All dropdown options change to the same hover color');
  });

  it('Test 4: Verify submit button is disabled without name and password', async () => {
    const submitButton = await driver.findElement(By.xpath("//button[@class='btn btn-success mt-3 float-end']"));
    const isSubmitDisabled = await submitButton.getAttribute('disabled');
    expect(isSubmitDisabled).to.not.be.null;
    console.log('Test 4 Passed: Submit button is disabled');
  });

  it('Test 5: Verify submit button is enabled with name and password', async () => {
    const nameInput = await driver.findElement(By.xpath("//input[@id='my-name-id']"));
    const passwordInput = await driver.findElement(By.xpath("//input[@id='my-password-id']"));
    await nameInput.sendKeys('Test Name');
    await driver.sleep(500);
    await passwordInput.sendKeys('Test Password');
    const submitButton = await driver.findElement(By.xpath("//button[@class='btn btn-success mt-3 float-end']"));
    await driver.sleep(500);
    const isSubmitEnabled = await submitButton.getAttribute('disabled');
    expect(isSubmitEnabled).to.be.null;
    console.log('Test 5 Passed: Submit button is enabled');
  });

  it('Test 6: Verify that on submit of Submit button the page shows "Received!" text', async () => {
    
    const submitButton = await driver.findElement(By.xpath("//button[@class='btn btn-success mt-3 float-end']"));
    await submitButton.click();
    await driver.sleep(1000);  
    await driver.wait(until.elementLocated(By.xpath("//p[@id='message' and contains(text(), 'Received!')]")), 5000);
    const receivedText = await driver.findElement(By.xpath("//p[@id='message' and contains(text(), 'Received!')]"));
    const text = await receivedText.getText();
    // Assert that the text is 'Received!'
    expect(text).to.equal('Received!');

    console.log('Test 6 Passed: The page shows "Received!" after clicking Submit button');
  });

  it('Test 7: Verify that on submit of the form, all data is passed to the URL', async () => {
  
    await driver.wait(until.urlContains('submitted.html'), 5000);
  
    const currentUrl = await driver.getCurrentUrl();
    console.log('Current URL:', currentUrl);
  
    const expectedUrl = 'https://d3pv22lioo8876.cloudfront.net/tiptop/submitted.html?my-name=Test+Name&my-password=Test+Password&my-readonly=Readonly+input&my-select=white';
  
    expect(currentUrl).to.equal(expectedUrl);
  
    console.log('Test 7 Passed: Form data is passed to the URL after submission');
  });
  

});
