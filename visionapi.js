require('dotenv').config();
const fs = require('fs');
const vision = require('@google-cloud/vision');

const curr_dir = 'public/episode' + process.argv[2] + '/part_' + process.argv[3] + '/';

// Creates a client
const client = new vision.ImageAnnotatorClient();

const request =  {
    image: {
        source: {
            filename: curr_dir + 'collaged.jpg'
        }
    },
    imageContext: {
        languageHints: ["en"]
    }
};

// Performs text detection on the local file
client.textDetection(request)
    .then(responses => {
        const results = { responses };
        fs.writeFileSync(curr_dir+'ocr_results.json', JSON.stringify(results, null, 2));
        console.log('Done!');
    })
    .catch(err => {
        console.error('Error ==>', err);
        process.exit(1);
    });
