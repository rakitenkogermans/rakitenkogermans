require('dotenv').config();
const Mustache = require('mustache');
const axios = require('axios');
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';
const UNSPLASH_URL = 'https://api.unsplash.com';
const DATA = {};

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const setImageInformation = async () => {
    try {
        const query = 'riga-old-town';
        const orderBy = 'relevant';
        const orientation = 'portrait';
        const perPage = 30;
        const img = await axios.get(`${UNSPLASH_URL}/search/photos/?client_id=${process.env.UNSPLASH_API_KEY}&query=${query}&order_by=${orderBy}&orientation=${orientation}&per_page=${perPage}`);
        const imgCount = img.data.results.length;
        const randomNum = randomNumber(0, imgCount);
        const image = img.data.results[randomNum];
        const smallImageUrl = image.urls.small;
        const imageUsername = image.user.username;
        const imageCreatorLink = image.user.links.html;
        DATA.IMG_URL = smallImageUrl;
        DATA.IMG_USERNAME = imageUsername;
        DATA.IMG_CREATOR_LINK = imageCreatorLink;
    } catch(err) {
        console.log(err);
    }

}

const generateReadMe = async () => {
    await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}

async function action() {
    await setImageInformation();

    await generateReadMe();
}

action();
