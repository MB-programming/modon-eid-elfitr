/* ═══════════════════════════════════════════════════════════════
   مخازن العناية – بطاقة تهنئة عيد الفطر
   ═══════════════════════════════════════════════════════════════

   ╔══════════════════════════════════════════════════════════╗
   ║           للتحكم في الاسم على البطاقة                   ║
   ╠══════════════════════════════════════════════════════════╣
   ║  fontSize  : حجم الخط بالبيكسيل — غيّر هذا الرقم        ║
   ║  nameX     : الموضع الأفقي  0=يمين  0.5=وسط  1=يسار     ║
   ║  nameY     : الموضع الرأسي  0=أعلى  0.5=وسط  1=أسفل     ║
   ║  nameYoffset : إزاحة رأسية ثابتة بالبيكسيل (+ = أسفل)   ║
   ║  fontColor : لون الخط                                    ║
   ╚══════════════════════════════════════════════════════════╝

   ═══════════════════════════════════════════════════════════════ */

const CARD_CONFIG = {
    imgId:        'card-img',

    /* ══ حجم الخط (بالبيكسيل) – غيّر هذا الرقم فقط ══ */
    fontSize:     50,

    nameX:        0.5,
    nameY:        0.61,
    nameYoffset:  3,          /* إزاحة إضافية للأسفل بالبيكسيل */

    fontColor:    '#111111',
    strokeWidth:  0,
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

        ctx.drawImage(img, 0, 0);

        ctx.font         = `700 ${CARD_CONFIG.fontSize}px PNUFont, Cairo, sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        const x = canvas.width  * CARD_CONFIG.nameX;
        const y = canvas.height * CARD_CONFIG.nameY + CARD_CONFIG.nameYoffset;

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

    const loadFresh = () => {
        img.onload  = render;
        img.onerror = () => { done(); alert('تعذّر تحميل صورة البطاقة (card.jpg). تأكد من وجود الملف.'); };
        img.src = img.src.split('?')[0] + '?t=' + Date.now(); /* force reload */
    };

    if (img.complete && img.naturalWidth > 0) {
        render();
    } else if (img.complete && img.naturalWidth === 0) {
        /* image already failed to load — retry */
        loadFresh();
    } else {
        img.onload  = render;
        img.onerror = () => { done(); alert('تعذّر تحميل صورة البطاقة (card.jpg). تأكد من وجود الملف.'); };
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
