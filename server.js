const express = require("express");
const puppeteer = require("puppeteer-core");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/check", async (req, res) => {
  const { plate } = req.body;

  try {

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto("https://opposition.narsa.gov.ma:82", {
      waitUntil: "networkidle2"
    });

    await page.type("#txtImmatriculation", plate);

    await page.click("#btnRechercher");

    await page.waitForTimeout(5000);

    const result = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();

    res.json({ success: true, result });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT || 3000);
