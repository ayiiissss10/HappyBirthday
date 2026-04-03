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
        <h2> Untuk Kesayanganku, Odi </h2>
        <p>Selamat ulang tahun sayang, hari ini mungkin cuma hari biasa untuk orang lain, tapi hari ini adalah hari dimana seseorang yang sangat berarti dan berharga buat aku dan sekelilingnya hadir ke dunia.</p>
        <p>Dan sejak itu, tanpa kamu sadari, kamu membawa kebahagiaan, ketenangan, energi positif, dan makna buat orang orang di sekitar kamu, terima kasih sudah menjadi yang terbaik buat orang orang di sekelilingmu yang bahkan kamu ga sadari.</p>
        <p>Terima kasih sudah bertahan sejauh ini sayang, terima kasih karena kamu ga menyerah dengan kehidupan kamu yang kadang ga mudah buat dijalanin. Terima kasih selalu ada buat orang orang saat mereka butuh kamu bahkan di saat kamu sendiri sedang butuh bantuan, terima kasih kamu udah jadi diri kamu sendiri.</p>
        <p>Di umur kamu yang sekarang, aku ga berharap yang berlebihan, aku cuma mau kamu di kelilingi hal hal yang baik,semoga kamu selalu di beri kesehatan, semoga kamu selalu punya alasan buat tersenyum bahkan di hari yang berat, semoga kamu di beri kekuatan saat lelah, dan ga pernah merasa sendirian karena aku ada dengan caraku sendiri.</p>
        <p>Apapun doa doa kamu semoga terkabulkan.</p>
        <p>Sekali lagi selamat ulang tahun, sayang! </p>
        <p>Terima kasih sudah jadi kamu.🤍</p>
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