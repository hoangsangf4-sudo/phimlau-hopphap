let audioCtx;
let oscillator;
let gainNode;
let sirenInterval;
let countdownTimer;
let isPlaying = false;

// Xử lý phát còi báo động cảnh sát
function startPoliceSiren() {
    if (isPlaying) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = 'sawtooth';
        const now = audioCtx.currentTime;
        oscillator.frequency.setValueAtTime(600, now);
        
        let high = true;
        sirenInterval = setInterval(() => {
            if (!audioCtx || audioCtx.state === 'closed') return;
            const t = audioCtx.currentTime;
            oscillator.frequency.cancelScheduledValues(t);
            oscillator.frequency.linearRampToValueAtTime(high ? 1100 : 600, t + 0.35);
            high = !high;
        }, 400);

        gainNode.gain.setValueAtTime(0.15, now);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        isPlaying = true;
    } catch(e) {
        console.log("Audio Error:", e);
    }
}

// Dừng còi báo động
function stopPoliceSiren() {
    if (sirenInterval) clearInterval(sirenInterval);
    if (oscillator) {
        try { oscillator.stop(); oscillator.disconnect(); } catch(e){}
    }
    if (audioCtx) {
        try { audioCtx.close(); } catch(e){}
    }
    isPlaying = false;
}

// Xử lý đồng hồ đếm ngược vị trí IP
function startIPCountdown() {
    let seconds = 10;
    const timerEl = document.getElementById('timer');
    const statusEl = document.getElementById('status');

    timerEl.style.color = '#ffeb3b';
    timerEl.innerText = seconds;
    statusEl.innerText = "📡 Đang định vị địa chỉ IP & Tọa độ GPS...";

    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            timerEl.innerText = seconds;
            if (seconds <= 5) {
                statusEl.innerText = "⚠️ ĐÃ KHÓA TỌA ĐỘ! Đang gửi xe tuần tra...";
                statusEl.style.color = "#ff3333";
            }
        } else {
            clearInterval(countdownTimer);
            timerEl.innerText = "00";
            timerEl.style.color = "#ff0000";
            statusEl.innerText = "📍 ĐÃ XÁC ĐỊNH IP: 192.168.1.1 (Đội cảnh sát đã có mặt tại nhà bạn!)";
            statusEl.style.color = "#ff0000";
        }
    }, 1000);
}

// Chuyển sang màn hình cảnh báo
function triggerArrest() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('warning-screen').style.display = 'flex';
    startPoliceSiren();
    startIPCountdown();
}

// Quay về trang chủ
function goHome() {
    stopPoliceSiren();
    if (countdownTimer) clearInterval(countdownTimer);
    document.getElementById('warning-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

// Xử lý gửi biểu mẫu góp ý
function submitFeedback(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Cảm ơn ${name} đã gửi góp ý! Chúng tôi đã ghi nhận phản hồi của bạn.`);
    event.target.reset();
}
