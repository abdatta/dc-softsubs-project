const getTextBlocks = (visionResults) => {
    let textBlocks = [];
    let blockIndex = 0;
    // visionResults.forEach(result => {
    //     result.fullTextAnnotation.pages.forEach(page => {
    //         textBlocks = textBlocks.concat(page.blocks.map(block => ({
    //           y: parseInt(block.boundingBox.vertices[0].y / 120) + 1,
    //           text: getBlockText(block).trim()
    //         })))
    //     });
    // });
    // console.log(textBlocks);
    // process.exit(1);
    visionResults.forEach(result => {
      result.fullTextAnnotation.pages.forEach(page => {
          page.blocks.forEach(block => {
            const i = parseInt(block.boundingBox.vertices[0].y / 120);
            const text = getBlockText(block).trim();
            if (i < textBlocks.length) {
              textBlocks[i] += '\n' + text;
            } else if (i === textBlocks.length) {
              textBlocks.push(text);
            } else {
              console.log('Error - block skipped! Should be: ' + textBlocks.length + '  Found: ' + i);
              console.log(textBlocks);
              process.exit(1);
            }
          })
      });
    });
    return textBlocks;
}

const getBlockText = (block) => {
    let result = '';
    block.paragraphs.forEach(paragraph => {
        paragraph.words.forEach(word => {
            word.symbols.forEach(symbol => {
                result += symbol.text;
                if (symbol.property && symbol.property.detectedBreak) {
                    const breakType = symbol.property.detectedBreak.type;
                    if (['EOL_SURE_SPACE' ,'SPACE'].includes(breakType)) {
                        result += " ";
                    }
                    if (['EOL_SURE_SPACE' ,'LINE_BREAK'].includes(breakType)) {
                        result += "\n"; // Perhaps use os.EOL for correctness.
                    }
                }
            })
        })
    })

    return result;
}

const fs = require('fs');
const moment = require('moment');

const curr_dir = 'public/episode' + process.argv[2] + '/part_' + process.argv[3] + '/';
const results = JSON.parse(fs.readFileSync(curr_dir+'ocr.json'));
const files = fs.readdirSync(curr_dir+'paired').filter(s => s.endsWith('.jpg'));
const blocks = getTextBlocks(results.responses);
if (files.length !== blocks.length) {
    console.log('blocks and files not of same sizes!', 'block size: ', blocks.length, 'files:', files.length);
    process.exit(1);
}
const submap = files.map((file, i) => {
  const match = file.match(/frame(.*)_(.*).jpg$/);
  return {
    filename: file,
    start: match && parseInt(match[1]),
    end: match && parseInt(match[2]),
    startTS: match && moment.utc(parseInt(match[1]) * 1000 / 29.97).format('HH:mm:ss.SS'),
    endTS: match && moment.utc(parseInt(match[2]) * 1000 / 29.97).format('HH:mm:ss.SS'),
    text: blocks[i]
  }
});

const subtemp = fs.readFileSync('subtemp.ass', 'utf8');
const finalsubs = subtemp + submap.map(sub => `Dialogue: 0,${sub.startTS},${sub.endTS},DCMain,,0000,0000,0000,,${sub.text.replace(/\n/g, ' ').replace(/\s+/g, ' ')}\n`).join('');
fs.writeFileSync(curr_dir+'ocr_subs.ass', finalsubs);
console.log(finalsubs);
