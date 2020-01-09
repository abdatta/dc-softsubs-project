const fs = require('fs');
const files = fs.readdirSync(process.argv[2]);
const lenpd = files.length;
const batch_len = parseInt(lenpd/12);

const batches = [];
for (let i=0; i<lenpd; i+=batch_len) {
    batches.push(files.slice(i,i+batch_len));
}

batches.forEach(async (batch, i) => {
    const dir = process.argv[2] + '/';
    // const dir = './public/frames_' + parseInt(Math.random()*1000) + '/';
    const part = 'part_' + String(i+1).padStart(2, '0');
    if (!fs.existsSync(dir+part)){
        fs.mkdirSync(dir+part);
    }
    await Promise.all(batch.map(file => new Promise((resolve, reject) => {
        fs.rename(dir + file, dir + part + '/' + file, err => {
            if (err) return reject(err);
            resolve();
        });
    })))
})

