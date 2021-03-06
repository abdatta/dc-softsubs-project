class Subs {
  subs;
  constructor(subs) {
    this.subs = subs || [];
    this.update();
  }
  update() {
    const subtext = [];
    this.subs.forEach((sub, i) => {
      if (i%2===0) subtext.push([sub, '']);
      else subtext[parseInt(i/2)][1] = sub;
    });
    $('.subs').html(subtext.map(s => `
      <div>
        <span class="sel-frame" onclick="jumpToFrame('${s[0]}')">${s[0]}</span> -
        <span class="sel-frame" onclick="jumpToFrame('${s[1]}')">${s[1]}</span>
      </div>`).join(''));
    if ($('.subs').length) $('.subs').scrollTop($('.subs')[0].scrollHeight);
  }

  push(s) {
    if (this.subs.length > 0 && this.subs[this.subs.length-1] > s) {
      alert('You can only select frames greater than the last selected frame!');
      return;
    }
    this.subs.push(s);
    this.update();
  }
  pop() { this.subs.pop(); this.update(); }

  save() {
    $.ajax({
      url: "save",
      type: 'POST',
      data: JSON.stringify(this.subs),
      contentType: 'application/json',
      success: (result) => {
        alert('Saved Successfully!');
        backWithinSite();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        alert('Error: ' + errorThrown);
        console.log(jqXHR, textStatus, errorThrown);
    }});
  }
}

const subs = new Subs(typeof pre_saved === 'undefined' ? [] : pre_saved);
document.onkeydown = (e) => {
  e = e || window.event;
  switch(e.keyCode) {
    case 37: // left arrow
        prev();
        break;
    case 39: // right arrow
        next();
        break;
    case 32:
        const frame = $('#img-' + curr_i).attr('src').split('/').reverse()[0];
        subs.push(frame);
        console.log(frame);
        break;
    case 8: // backspace
        subs.pop();
        break;
    // case 13: // enter
    //     subs.save();
    //     break;
    default:
        console.log(e.keyCode);
  }
  // use e.keyCode
};

const save = () => {
  subs.save();
}

const backWithinSite = () => {
  if (window.location.pathname !== '/') {
    const endsWithSlash = window.location.pathname.endsWith('/');
    window.location = window.location.href.split('/').slice(0, endsWithSlash ? -2 : -1).join('/');
  }
}

const updateProgress = () => {
  const total = $('*[id^=img-]').length - 1;
  $('.progress').css({width: ((curr_i+1) * 100/ total)+'%'});
}

let curr_i = -1;
const moveTo = (i /* index from 0 */) => {
  if (i >= 0 && $('#img-' + i).length) {
    $('#img-' + curr_i).hide();
    $('#cap-' + curr_i).hide();
    curr_i = i;
    $('#img-' + curr_i).show();
    $('#cap-' + curr_i).show();
    updateProgress();
  }
}

const prev = () => {
  moveTo(curr_i - 1);
}

const next = () => {
  moveTo(curr_i + 1);
}

const jumpToFrame = (frame) => {
  const frameOffset = parseInt($('#img-0').attr('src').match(/frame(.*)\.jpg/)[1]);
  const frameIndex = parseInt(frame.match(/frame(.*)\.jpg/)[1]) - frameOffset;
  moveTo(frameIndex);
}

if (typeof pre_saved !== 'undefined' && pre_saved.length > 0)
  jumpToFrame(pre_saved[pre_saved.length-1]);
