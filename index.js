const express = require('express');
const bodyParser = require('body-parser')
const hbs  = require('hbs');
const path = require('path');
const fs = require('fs');

// const curr_dir = 'public/frames163/part_' + process.argv[2] + '/';
 
var app = express();
 
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'hbs')

app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    const dir = `public`;
    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    // console.log(files);
    res.render('framelist', {eps: files});
});
app.get('/frames:f', (req, res) => {
    const dir = `public/frames${req.params.f}`;
    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    // console.log(files);
    res.render('framelist', {eps: files});
});
app.get('/frames:f/part_:p/', (req, res) => {
    const dir = `public/frames${req.params.f}/part_${req.params.p}/`;
    const imgs = fs.readdirSync(dir).filter(s => s.startsWith('frame') && s.endsWith('.jpg'));
    // console.log(files);
    res.render('home', {imgs, dir: dir.split('public/')[1]});
});
app.post('/frames:f/part_:p/save', (req, res) => {
    const dir = `public/frames${req.params.f}/part_${req.params.p}/`;
    const subs = req.body;
    console.log(subs);
    const pairs = [];
    subs.forEach((sub, i) => {
        if (i%2===0) pairs.push([sub]);
        else pairs[parseInt(i/2)].push(sub);
    });
    if (!fs.existsSync(dir+'paired/')){
        fs.mkdirSync(dir+'paired/');
    }
    fs.writeFileSync(dir+'frames.json', JSON.stringify(pairs, null, 2));
    
    res.send('Done.');
});
 
app.listen(3000, () => console.log('Listening to port 3000.'));