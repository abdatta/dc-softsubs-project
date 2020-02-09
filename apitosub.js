const fs = require('fs');
const moment = require('moment');

const groupIntoBlocks = (apiResults) => {
  let texts = [];
  apiResults.forEach(result => {
    result.fullTextAnnotation.pages.forEach(page => {
      page.blocks.forEach(block => {
        block.paragraphs.forEach(paragraph => {
          paragraph.words.forEach(word => {
            word.symbols.forEach(symbol => {
                const i = parseInt((symbol.boundingBox.vertices[0].y + 10) / 120); // divisions at 110, 230, 350,...
                let len = texts.length;
                if (i >= len) for(; len<=i; len++) texts.push('');
                texts[i] += symbol.text;
                if (symbol.property && symbol.property.detectedBreak) {
                    const breakType = symbol.property.detectedBreak.type;
                    if (['EOL_SURE_SPACE' ,'SPACE'].includes(breakType)) {
                      texts[i] += ' ';
                    }
                    if (['EOL_SURE_SPACE' ,'LINE_BREAK'].includes(breakType)) {
                      texts[i] += '\n'; // Perhaps use os.EOL for correctness.
                    }
                }
            });
          });
        });
      });
    });
  });

  return texts;
}

const epNo = process.argv[2];
const startPartNo = process.argv[3];
const endPartNo = process.argv[4] || startPartNo;

if (!epNo || !startPartNo) {
  console.error('Missing arguements!');
  process.exit(1);
}

const submap = [];

for (let p = parseInt(startPartNo); p <= parseInt(endPartNo); p++) {
  const curr_dir = 'public/episode' + epNo + '/part_' + String(p).padStart(2, '0') + '/';
  const results = JSON.parse(fs.readFileSync(curr_dir+'ocr_results.json'));
  const files = fs.readdirSync(curr_dir+'paired').filter(s => s.endsWith('.jpg'));

  const blocks = groupIntoBlocks(results.responses).map(text => text.trim());

  if (files.length !== blocks.length) {
      console.log('blocks and files not of same sizes!', 'block size: ', blocks.length, 'files:', files.length);
      process.exit(1);
  }
  submap.push(...files.map((file, i) => {
    const match = file.match(/frame(.*)_(.*).jpg$/);
    const fps = 29.97;
    return {
      filename: file,
      start: match && parseInt(match[1]),
      end: match && parseInt(match[2]),
      startTS: match && moment.utc(parseInt(match[1]) * 1000 / fps - 10).format('H:mm:ss.SS'),
      endTS: match && moment.utc(parseInt(match[2]) * 1000 / fps + 10).format('H:mm:ss.SS'),
      text: blocks[i].replace(/\n/g, ' ').replace(/\s+/g, ' ')
    }
  }));
}

const subtemp = fs.readFileSync('subtemp.ass', 'utf8');
const finalsubs = subtemp + submap.map(
      sub => `Dialogue: 0,${sub.startTS},${sub.endTS},DCMain,,0,0,0,,${sub.text}`
  ).join('\n') + '\n';
const finalsubfile = `public/episode${epNo}/ocr_subs_${epNo}_${startPartNo}${endPartNo === startPartNo ? '' : '_' + endPartNo}.ass`;
fs.writeFileSync(finalsubfile, finalsubs);
console.log('Subs written to file:', finalsubfile);

submap.forEach(sub => console.log(sub.text));
