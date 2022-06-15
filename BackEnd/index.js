const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");

//Setup
const app = express();
dotenv.config();
app.use(express.urlencoded({ extended: true, parameterLimit: 100000 }));
app.use(express.json({ limit: "50mb" }));

// Routes

// Get all character = raw webscrape(Cào thông tin từ 1 trang web)
app.get("/api", (req, response) => {
  try {
    // axios(process.env.URL_ANIME).then((response) => {
    //   const $ = cheerio.load(response.data);
    //   const data = [];
    //   $("#list-anime")
    //     .find(".item")
    //     .each(function () {
    //       const title = $(this).find(".title").text();
    //       const img = $(this).find(".thumb").attr("src");
    //       const link = $(this).find(".thumb").attr("href");
    //       const description = $(this).find(".description").text();
    //       const dataItem = {
    //         title,
    //         img,
    //         link,
    //         description,
    //       };
    //       data.push(dataItem);
    //     });
    //   res.json(data);
    // });

    axios(process.env.URL_ANIME).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      const thumnails = [];
      $(".portal").each(function () {
        const name = $(this).find("a").attr("title");
        const url = $(this).find("a").attr("href");
        const image = $(this).find("a > img").attr("data-src");

        const dataItem = {
          name,
          url: "http://localhost:5000/api" + url.split("/wiki")[1],
          image,
        };
        thumnails.push(dataItem);
      });
      response.status(200).json(thumnails);
    });
  } catch (error) {
    response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get a character
app.get("/api/:character", (req, res) => {
  console.log(req.params.character);
});

// Run PORT
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
