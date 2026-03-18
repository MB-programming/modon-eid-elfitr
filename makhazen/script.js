/* ═══════════════════════════════════════════════════════════════
   مخازن العناية – بطاقة تهنئة عيد الفطر
   ═══════════════════════════════════════════════════════════════

   للتحكم في موقع وحجم الاسم على البطاقة:

   fontScale  : حجم الخط نسبة من ارتفاع الصورة (0.01 – 0.20)
   nameX      : الموضع الأفقي  0 = يمين ، 0.5 = وسط ، 1 = يسار
   nameY      : الموضع الرأسي  0 = أعلى ، 0.5 = وسط ، 1 = أسفل
   fontColor  : لون الخط

   ═══════════════════════════════════════════════════════════════ */

const CARD_CONFIG = {
    imgId:     'card-img',
    fontScale: 0.055,
    nameX:     0.5,
    nameY:     0.78,
    fontColor: '#111111',
};

/* ── Generate card ── */
function generateCard() {
    const name = document.getElementById('name-input').value.trim();

    if (!name) {
        const input = document.getElementById('name-input');
        input.focus();
        input.style.borderColor = '#c0392b';
        setTimeout(() => (input.style.borderColor = ''), 2000);
        return;
    }

    const img    = document.getElementById(CARD_CONFIG.imgId);
    const canvas = document.getElementById('result-canvas');
    const ctx    = canvas.getContext('2d');

    const render = () => {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        const fontSize = Math.floor(canvas.height * CARD_CONFIG.fontScale);
        ctx.font         = `700 ${fontSize}px PNUFont, Cairo, sans-serif`;
        ctx.fillStyle    = CARD_CONFIG.fontColor;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor   = 'transparent';
        ctx.shadowBlur    = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillText(
            name,
            canvas.width  * CARD_CONFIG.nameX,
            canvas.height * CARD_CONFIG.nameY
        );

        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    };

    if (img.complete && img.naturalWidth > 0) {
        render();
    } else {
        img.onload  = render;
        img.onerror = () => alert('تعذّر تحميل صورة البطاقة. تأكد من وجود ملف card.jpg');
    }
}

/* ── Download ── */
function downloadCard() {
    const canvas = document.getElementById('result-canvas');
    const name   = document.getElementById('name-input').value.trim();

    canvas.toBlob(blob => {
        const link    = document.createElement('a');
        link.href     = URL.createObjectURL(blob);
        link.download = `تهنئة_عيد_الفطر_${name || 'مخازن'}.jpg`;
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/jpeg', 0.95);
}

/* ── Back ── */
function goBack() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    document.getElementById('name-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') generateCard();
    });
});
