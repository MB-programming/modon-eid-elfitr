/* ═══════════════════════════════════════════════════════════════
   مخازن العناية – بطاقة تهنئة عيد الفطر
   ═══════════════════════════════════════════════════════════════

   📐 fontScale : حجم الخط نسبة من ارتفاع الصورة (0.01 – 0.20)
   📍 nameX     : الموضع الأفقي  0 = يمين ، 0.5 = وسط ، 1 = يسار
   📍 nameY     : الموضع الرأسي  0 = أعلى ، 0.5 = وسط ، 1 = أسفل
   🎨 fontColor : لون الخط مثل '#111111' أو '#FFFFFF'

   ═══════════════════════════════════════════════════════════════ */

const CARD_CONFIG = {
    imgId:      'card-img',
    fontScale:  0.055,        /* حجم الخط – نسبة من ارتفاع الصورة */
    nameX:      0.5,
    nameY:      0.61,
    fontColor:  '#111111',
    strokeWidth: 0,
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

    const btn = document.querySelector('#step1 .btn-primary');
    btn.disabled    = true;
    btn.textContent = 'جاري الإنشاء…';

    const img    = document.getElementById(CARD_CONFIG.imgId);
    const canvas = document.getElementById('result-canvas');
    const ctx    = canvas.getContext('2d');

    const done = () => {
        btn.disabled    = false;
        btn.textContent = 'توليد البطاقة';
    };

    const render = () => {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;

        if (!canvas.width) { done(); return; }

        ctx.drawImage(img, 0, 0);

        const baseFontSize = Math.floor(canvas.height * CARD_CONFIG.fontScale);
        const fontSpec     = `700 ${baseFontSize}px PNUFont, Cairo, sans-serif`;

        const drawText = () => {
            /* auto-shrink font to fit 70% of card width */
            const maxW = canvas.width * 0.70;
            let fs = baseFontSize;
            ctx.font         = `700 ${fs}px PNUFont, Cairo, sans-serif`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            while (fs > 12 && ctx.measureText(name).width > maxW) {
                fs -= 2;
                ctx.font = `700 ${fs}px PNUFont, Cairo, sans-serif`;
            }

            const x = canvas.width  * CARD_CONFIG.nameX;
            const y = canvas.height * CARD_CONFIG.nameY;

            if (CARD_CONFIG.strokeWidth > 0) {
                ctx.lineWidth   = CARD_CONFIG.strokeWidth;
                ctx.strokeStyle = CARD_CONFIG.fontColor;
                ctx.lineJoin    = 'round';
                ctx.strokeText(name, x, y);
            }

            ctx.fillStyle = CARD_CONFIG.fontColor;
            ctx.fillText(name, x, y);

            done();
            document.getElementById('result-modal').classList.add('open');
        };

        /* wait for PNUFont to load so measureText is accurate */
        (document.fonts ? document.fonts.load(fontSpec) : Promise.resolve())
            .then(drawText).catch(drawText);
    };

    const loadFresh = () => {
        img.onload  = render;
        img.onerror = () => { done(); alert('تعذّر تحميل صورة البطاقة (cardeid.webp). تأكد من وجود الملف.'); };
        img.src = img.src.split('?')[0] + '?t=' + Date.now(); /* force reload */
    };

    if (img.complete && img.naturalWidth > 0) {
        render();
    } else if (img.complete && img.naturalWidth === 0) {
        /* image already failed to load — retry */
        loadFresh();
    } else {
        img.onload  = render;
        img.onerror = () => { done(); alert('تعذّر تحميل صورة البطاقة (cardeid.webp). تأكد من وجود الملف.'); };
    }
}

/* ── Download ── */
function downloadCard() {
    const canvas = document.getElementById('result-canvas');
    const name   = document.getElementById('name-input').value.trim();

    try {
        canvas.toBlob(blob => {
            if (!blob) { alert('تعذّر تصدير البطاقة، حاول مرة أخرى.'); return; }
            const link    = document.createElement('a');
            link.href     = URL.createObjectURL(blob);
            link.download = `تهنئة_عيد_الفطر_${name || 'مخازن'}.jpg`;
            link.click();
            URL.revokeObjectURL(link.href);
        }, 'image/jpeg', 0.95);
    } catch (e) {
        /* canvas tainted – fallback: open image in new tab */
        const url = canvas.toDataURL('image/jpeg', 0.95);
        const win = window.open();
        win.document.write(`<img src="${url}" style="max-width:100%">`);
    }
}

/* ── Clear image cache ── */
function clearImageCache() {
    const img = document.getElementById(CARD_CONFIG.imgId);
    img.onload  = () => {};
    img.onerror = () => {};
    img.src = img.src.split('?')[0] + '?t=' + Date.now();
    const btn = document.querySelector('.cache-row .btn-secondary');
    btn.textContent = 'تم التحديث';
    setTimeout(() => { btn.textContent = 'تحديث الصورة'; }, 1500);
}

/* ── Back ── */
function goBack() {
    document.getElementById('result-modal').classList.remove('open');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    document.getElementById('name-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') generateCard();
    });
});
