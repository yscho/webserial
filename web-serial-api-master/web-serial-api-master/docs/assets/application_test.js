//import connectButton from './application.js'

const ledDimmer = document.getElementById('led-dimmer');
const ledDimmerValue = document.querySelector('label span');

function renderDemo() {
  const percent = Math.floor(ledDimmer.value / 255 * 100);

  ledDimmer.style = 'background-image: linear-gradient(to right, #fed609 ' + percent + '%, #2c2b2f ' + percent + '%);';
  ledDimmerValue.innerText = percent;

  window.requestAnimationFrame(renderDemo);
}
window.requestAnimationFrame(renderDemo);

async function getReader() {
  port = await navigator.serial.requestPort({});
  await port.open({ baudRate: 38400 });

  document.querySelector('input').disabled = false;
  connectButton.innerText = '🔌 Disconnect';
  document.querySelector('figure').classList.remove('fadeOut');
  document.querySelector('figure').classList.add('bounceIn');

  //reader = port.readable.getReader();
  //outputStream = port.writable


  if (port) {
      connectionToPortSuccessfulMessage = 'Connection successful'
      //setPortFound(true)

      while (port.readable) {
        const reader = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // |reader| has been canceled.
              console.log(value);
            
              break;
            }
            console.log('Just read a chunk:', value);
            // Do something with |value|…
          }
        } catch (error) {
          // Handle |error|…
        } finally {
          reader.releaseLock();
        }
      }

  }


  ledDimmer.addEventListener('input', (event) => {
    if (port && port.writable) {
      const value = parseInt(event.target.value);
      const bytes = new Uint8Array([value]);
      const writer = port.writable.getWriter();

      writer.write(bytes);
      writer.releaseLock();
    }
  });
}
