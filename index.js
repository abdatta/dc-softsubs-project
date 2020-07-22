const express = require('express');
const bodyParser = require('body-parser')
const hbs  = require('hbs');
const path = require('path');
const fs = require('fs');
const serveImagesAsWebp = require('./webp');

// const curr_dir = 'public/frames163/part_' + process.argv[2] + '/';
 
var app = express();
 
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'hbs')

app.use(bodyParser.json());
app.use(serveImagesAsWebp);
app.use(express.static('public'));

app.get('/', (req, res) => {
    const dir = `public`;
    const epsInfo = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({dir: dirent.name}));
    // console.log(files);
    res.render('framelist', { epsInfo });
});

app.get('/episode:e', (req, res) => {
    const dir = `public/episode${req.params.e}`;
    const epsInfo = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({
            dir: dirent.name,
            marked: getMarkedFrames(`${dir}/${dirent.name}`).length + ''
        }));

        res.render('framelist', { epsInfo });
});

app.get('/episode:e/part_:p/', (req, res) => {
    const dir = `public/episode${req.params.e}/part_${req.params.p}/`;
    const imgs = fs.readdirSync(dir).filter(s => s.startsWith('frame') && s.endsWith('.jpg'));
    const saved = getMarkedFrames(dir);

    res.render('home', {imgs, dir: dir.split('public/')[1], saved: JSON.stringify(pairsToArray(saved))});
});

app.post('/episode:e/part_:p/save', (req, res) => {
    const dir = `public/episode${req.params.e}/part_${req.params.p}/`;
    const subs = req.body;
    console.log(subs);

    const pairs = arrayToPairs(subs);

    fs.writeFileSync(dir+'frames.json', JSON.stringify(pairs, null, 2));
    res.send('Done.');
});
 
app.listen(4300, () => console.log('Listening to port 4300.'));

const arrayToPairs = (array) => {
    const pairs = [];
    array.forEach((sub, i) => {
        if (i%2===0) pairs.push([sub]);
        else pairs[parseInt(i/2)].push(sub);
    });
    return pairs;
}

const pairsToArray = (pairs) => {
    const array = [];
    pairs.forEach(pair => array.push(...pair));
    return array;
}

const getMarkedFrames = (dir) => fs.existsSync(dir+'/frames.json') ? JSON.parse(fs.readFileSync(dir+'/frames.json')) : [];
