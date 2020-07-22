
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const serveImagesAsWebp = (req, res, next) => {
    if (!req.path.endsWith('.jpg')) {
        return next();
    }
    imagemin(['public' + req.path], {
        plugins: [imageminWebp({quality: 1})]
    })
    .then(([{data}]) => {
        res.setHeader('content-type', 'image/webp');
        res.send(data);
    })
    .catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
}

module.exports = serveImagesAsWebp;
