const createCollage = require("@settlin/collage");
const fs = require('fs');

const curr_dir = 'public/frames' + process.argv[2] + '/part_' + process.argv[3] + '/';

const pairFrames = async () => {
  const pairs  = JSON.parse(fs.readFileSync(curr_dir+'frames.json'));

  const fixDigits = (i) => String(i).padStart(6, '0');

  if (!fs.existsSync(curr_dir+'paired/')){
      fs.mkdirSync(curr_dir+'paired/');
  }

  await Promise.all(pairs.map((pair, i) => {
    if (pair.length < 2) return Promise.reject('Less than 2 frames in a pair!');

    const start = parseInt(pair[0].split('frame')[1].split('.jpg')[0]); //pair[0].split('.jpg')[0];
    const end = parseInt(pair[1].split('frame')[1].split('.jpg')[0]); // pair[1].split('frame')[1];
    const outfile = `${curr_dir}paired/frame${fixDigits(start)}_${fixDigits(end)}.jpg`;

    return new Promise((resolve, reject) => {
      fs.copyFile(curr_dir + pair[0], outfile, (err) => {
          if (err) return reject(err);
          console.log('Created:', outfile);
          // moves used files to used dir
          // if (!fs.existsSync(curr_dir+'used/')){
          //     fs.mkdirSync(curr_dir+'used/');
          // }
          // for (let j=start; j<=end; j++) {
          //     fs.renameSync(`${curr_dir}frame${fixDigits(j)}.jpg`, `${curr_dir}used/frame${fixDigits(j)}.jpg`);
          // }
          resolve();
        });
    })
  }));
  console.log('Pairing Done!');
}

const collageFrames = async () => {
  const files = fs.readdirSync(curr_dir+'paired').filter(s => s.endsWith('.jpg'));
  
  const options = {
    sources: files.map(s => curr_dir+'paired/'+s),
    width: 1, // number of images per row
    height: files.length, // number of images per column
    imageWidth: 640,
    imageHeight: 100,
    spacing: 20, // optional: pixels between each image
  };
  
  await createCollage(options)
    .then((canvas) => {
      const src = canvas.jpegStream();
      const dest = fs.createWriteStream(curr_dir+"collaged.jpg");
      src.pipe(dest);
    });
  console.log('Collage Done!')
}

Promise.resolve() // this line is just for styling the thens
  .then(pairFrames)
  .then(collageFrames)
  .catch(err => console.error('Error ==>', err));
