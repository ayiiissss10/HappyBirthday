document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let allCandlesOut = false;

  const happyBirthdayMessage = document.createElement("h1");
  happyBirthdayMessage.className = "happy-birthday";
  happyBirthdayMessage.textContent = "Happy Birthday Odi Sayang!";
  document.body.insertBefore(happyBirthdayMessage, document.body.firstChild);

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    if (!analyser) return false;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40;
  }

  function checkAllCandlesOut() {
    return candles.length > 0 && candles.every(candle => candle.classList.contains("out"));
  }

  function showLoveLetter() {
    const letter = document.createElement("div");
    letter.className = "love-letter";
    letter.innerHTML = `
      <div class="letter-content">
        <h2>💝 Untuk Odi Sayang 💝</h2>
        <p>Hari spesial ini adalah hari yang tepat untuk memberitahu bahwa kamu membuat hidupku lebih indah dan bermakna.</p>
        <p>Setiap momen bersamamu adalah hadiah terbaik yang bisa aku terima. Semoga hari ini membawamu kebahagiaan yang tak terlupakan.</p>
        <p>Selamat ulang tahun, sayang! 🎂✨</p>
        <p>Dengan sepenuh cinta,</p>
        <p>❤️</p>
      </div>
    `;
    document.body.appendChild(letter);
  }

  function blowOutCandles() {
    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
        }
      });

      if (!allCandlesOut && checkAllCandlesOut()) {
        allCandlesOut = true;
        setTimeout(showLoveLetter, 1000);
      }
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});