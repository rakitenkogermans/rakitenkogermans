require('dotenv').config();
const Mustache = require('mustache');
const axios = require('axios');
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const WEATHER_API_URL = 'https://api.openweathermap.org';
const WEATHER_URL = 'https://openweathermap.org';
const DATA = {};
const dateBuildOptions = {
    year: "numeric",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: 'Europe/Riga'
};

const dateWeatherOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
};

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const setBuildDate = () => {
    const intlObj = new Intl.DateTimeFormat('en-GB', dateBuildOptions);
    const date = new Date();
    DATA.BUILD_DATE = intlObj.format(date);
}

const setImageInformation = async () => {
    try {
        const query = 'riga';
        const orderBy = 'relevant';
        const orientation = 'portrait';
        const perPage = 25;
        const page = randomNumber(1, 3);
        const img = await axios.get(`${UNSPLASH_API_URL}/search/photos/?client_id=${process.env.UNSPLASH_API_KEY}&query=${query}&order_by=${orderBy}&per_page=${perPage}&page=${page}`);
        const imgCount = img.data.results.length;
        const randomNum = randomNumber(0, imgCount + 1);
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

const setWeatherInformation = async () => {
    try {
        const lat = '57';
        const lon = '24.0833';
        const units = 'metric';
        const { data } = await axios.get(`${WEATHER_API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPEN_WEATHER_API_KEY}`);
        const weather = data.weather[0];

        const intlObj = new Intl.DateTimeFormat('en-GB', dateWeatherOptions);
        const date = new Date();
        DATA.WEATHER_DATE = intlObj.format(date);
        DATA.WEATHER_TEMP = Math.round(data.main.temp);
        DATA.WEATHER_MAIN = weather.main;
        DATA.WEATHER_ICON = `${WEATHER_URL}/img/wn/${weather.icon}@2x.png`
        DATA.WEATHER_CLOUDS = Math.round(data.clouds.all);
        DATA.WEATHER_TEMP_FEELS = Math.round(data.main.feels_like);
        DATA.WEATHER_DESCRIPTION = weather.description;
    } catch(err) {

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

    await setWeatherInformation();

    setBuildDate();

    await generateReadMe();
}

action();
