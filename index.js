//import modules
const request = require('request');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//csv file setup
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
        { id: 'Username', title: 'Username' },
        { id: 'Title', title: 'Title' },
        { id: 'Body', title: 'Body' },
        { id: 'Date', title: 'Date' },
        { id: 'ProfileImg', title: 'ProfileImg' },
        { id: 'ReadingTime', title: 'ReadingTime' }
    ]
});

//some dummy arrays
let data = [
];

let username = [];
let title = [];
let body = [];
let date = [];
let profileImg = [];
let readingTime = [];

//request setup
request('https://uxdesign.cc/', (err, response, html) => {
    if (!err && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('div[class = "postMetaInline postMetaInline-authorLockup ui-captionStrong u-flex1 u-noWrapWithEllipsis"]').find('a').each((i, el) => {
            const item = $(el).text();
            username.push(item);
        });

        //find length of data
        const length = $('div[class = "u-letterSpacingTight u-lineHeightTighter u-breakWord u-textOverflowEllipsis u-lineClamp3 u-fontSize24"]').length;
        console.log(length);

        $('div[class = "u-letterSpacingTight u-lineHeightTighter u-breakWord u-textOverflowEllipsis u-lineClamp3 u-fontSize24"]').each((i, el) => {
            const item = $(el).text();
            title.push(item);
        });

        $('div[class = "u-fontSize18 u-letterSpacingTight u-lineHeightTight u-marginTop7 u-textColorNormal u-baseColor--textNormal"]').each((i, el) => {
            const item = $(el).text();
            body.push(item);
        });

        $('div[class = "ui-caption u-fontSize12 u-baseColor--textNormal u-textColorNormal js-postMetaInlineSupplemental"]').find('time').each((i, el) => {
            const item = $(el).text();
            date.push(item);
        });

        $('img[class = "avatar-image u-size36x36 u-xs-size32x32"]').each((i, el) => {
            const src = $(el).attr('src');
            profileImg.push(src);
        });

        $('span[class = "readingTime"]').each((i, el) => {
            const time = $(el).attr('title');
            readingTime.push(time);
        });

        //for fixing a bug
        username.splice(1, 1);

        //push all data in an array
        let i;
        for (i = 0; i < 18; i++) {
            data.push({
                Username: username[i],
                Title: title[i],
                Body: body[i],
                Date: date[i],
                ProfileImg: profileImg[i],
                ReadingTime: readingTime[i]
            })
           
        }
        console.log(data);

        //write data in csv file
        csvWriter
            .writeRecords(data)
            .then(() => console.log('The CSV file was written successfully'));

    }
    else {
        console.log("error");
    }
});


//request to open csv file in exel or some other software...

