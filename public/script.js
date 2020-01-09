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
    $('.subs').html(subtext.map(s => `<div>${s[0]} - ${s[1]}</div>`).join(''));
    $('.subs').scrollTop($('.subs')[0].scrollHeight);
  }

  push(s) { this.subs.push(s); this.update(); }
  pop() { this.subs.pop(); this.update(); }

  save() {
    $.ajax({url: "save", type: 'POST', data: JSON.stringify(this.subs), dataType: 'json', contentType: 'application/json', success: (result) => {
      alert(result);
    }});
  }
}

// console.log('presaved', pre_saved);
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
    case 13: // enter
        subs.save();
        break;
    default:
        console.log(e.keyCode);
  }
  // use e.keyCode
};
let curr_i = -1;
const prev = () => {
  if (curr_i > 0) {
    $('#img-' + curr_i).hide();
    $('#cap-' + curr_i).hide();
    curr_i--;
    $('#img-' + curr_i).show();
    $('#cap-' + curr_i).show();
    updateProgress();
  }
}
const next = () => {
  if ($('#img-' + (curr_i+1)).length) {
    $('#img-' + curr_i).hide();
    $('#cap-' + curr_i).hide();
    curr_i++;
    $('#img-' + curr_i).show();
    $('#cap-' + curr_i).show();
    updateProgress();
  }
}
const updateProgress = () => {
  const total = $('*[id^=img-]').length;
  $('.progress').css({width: (curr_i * 100/ total)+'%'});
}
