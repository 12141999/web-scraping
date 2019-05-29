const request = require('request');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
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

let data = [

];

let username = [];
let title = [];
let body = [];
let date = [];
let profileImg = [];
let readingTime = [];

let obj = {
    // Username : '',
    // Title : '',
    // Body : '',
    // Date : '',
    // ProfileImg : '',
    // ReadingTime : ''
};


request('https://uxdesign.cc/', (err, response, html) => {
    if (!err && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('div[class = "postMetaInline postMetaInline-authorLockup ui-captionStrong u-flex1 u-noWrapWithEllipsis"]').find('a').each((i, el) => {
            const item = $(el).text();
            username.push(item);
            //obj[0] = item;
            //console.log(item);
        });


        const length = $('div[class = "u-letterSpacingTight u-lineHeightTighter u-breakWord u-textOverflowEllipsis u-lineClamp3 u-fontSize24"]').length;

        console.log(length);

        $('div[class = "u-letterSpacingTight u-lineHeightTighter u-breakWord u-textOverflowEllipsis u-lineClamp3 u-fontSize24"]').each((i, el) => {
            const item = $(el).text();
            title.push(item);
            //obj[1] = item;
            //console.log(item);
        });

        $('div[class = "u-fontSize18 u-letterSpacingTight u-lineHeightTight u-marginTop7 u-textColorNormal u-baseColor--textNormal"]').each((i, el) => {
            const item = $(el).text();
            body.push(item);
            //obj[2] = item;
            //console.log(item);
        });

        $('div[class = "ui-caption u-fontSize12 u-baseColor--textNormal u-textColorNormal js-postMetaInlineSupplemental"]').find('time').each((i, el) => {
            const item = $(el).text();
            date.push(item);
            //obj[3] = date;
            //console.log(date);
        });

        $('img[class = "avatar-image u-size36x36 u-xs-size32x32"]').each((i, el) => {
            const src = $(el).attr('src');
            profileImg.push(src);
            //obj[4] = src;
            //console.log(src);
        });

        $('span[class = "readingTime"]').each((i, el) => {
            const time = $(el).attr('title');
            readingTime.push(time);
            //obj[5] = readingTime;
            //console.log(readingTime);
        });

        // console.log(username);
        // console.log(title);
        // console.log(body);
        username.splice(1, 1);

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


        csvWriter
            .writeRecords(data)
            .then(() => console.log('The CSV file was written successfully'));

    }
    else {
        console.log("error");
    }
});

