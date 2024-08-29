const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function fetchImagesFromUrl(url, folder = 'trend_images') {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    $('img').each((index, element) => {
      const imgUrl = $(element).attr('src');
      const fullImgUrl = imgUrl.startsWith('http') ? imgUrl : `${url}${imgUrl}`;

      
      axios({
        url: fullImgUrl,
        responseType: 'stream',
      })
        .then(response => {
          const imgPath = path.join(folder, `trend_${index}.jpg`);
          response.data.pipe(fs.createWriteStream(imgPath));
          console.log(`Image ${index} saved at ${imgPath}`);
        })
        .catch(err => {
          console.error(`Failed to download image ${index}: ${err.message}`);
        });
    });

  } catch (err) {
    console.error(`Error fetching data from ${url}: ${err.message}`);
  }
}

fetchImagesFromUrl('https://www.pinkvilla.com/CelebFashion');
