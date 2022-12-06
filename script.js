import WaveformData from 'https://cdn.skypack.dev/waveform-data';

const response = await fetch('./track.dat');
const buffer = await response.arrayBuffer();
const waveform = await  WaveformData.create(buffer);
const zoom = 1;
const zoomMultiplier = 1.3;
let lineCount = 100;

const scaleY = (amplitude, height) => {
  const range = 256;
  const offset = 128;

  return height - ((amplitude + offset) * height) / range;
}

const range = document.getElementById('lines-range');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


range.addEventListener('change', e => {
  lineCount = e.target.value;
  console.log({lineCount})
  render();
})
const render = () => {
  canvas.width = lineCount * 10 + 10;
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'grey';
  ctx.lineCap = "round";
  ctx.beginPath();

  const channel = waveform.channel(0);
  console.log('length',  waveform.length)
  const include = Math.floor(waveform.length/lineCount);
  
  
  // Loop forwards, drawing the upper half of the waveform
  let items = 0;
  let ctr = 0;
  console.log(waveform.length + `10px`)
  for (let x = 0; x < waveform.length; x++) {
    items += channel.max_sample(x);
    if(x % include !== 0) {
      continue;
    };
    // console.log({ctr}, ctr++)
    const val = items/include;
    items = 0;
    // console.log({val}, x)
    const xA = x / include * 10;
    // console.log({x})
    ctx.moveTo(xA, canvas.height/2 + 0.5)
    
    ctx.lineTo(xA, scaleY(val, canvas.height) + 0.5);
    ctx.lineTo(xA, scaleY(-val, canvas.height) + 0.5);
    
  }
  
  // Loop backwards, drawing the lower half of the waveform
  // for (let x = waveform.length - 1; x >= 0; x--) {
  //   // console.log(x, include)
  //   if(x % include !== 0) {
  //     continue;
  //   };
  //   const val = channel.max_sample(x);
  //   ctx.moveTo(x + 0.5, canvas.height/2 + 0.5)
  
  //   ctx.lineTo(x + 0.5, scaleY(-val, canvas.height) + 0.5);
  // }
  
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  
  console.log(`Waveform has ${waveform.channels} channels`);
  console.log(`Waveform has length ${waveform.length} points`);

}
render();
