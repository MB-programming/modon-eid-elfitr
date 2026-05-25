/* ═══════════════════════════════════════════════════════════════
   إعدادات القوالب - Eid al-Fitr Templates
   ═══════════════════════════════════════════════════════════════

   للتحكم في موقع وحجم الاسم على كل قالب بشكل مستقل:

   fontScale  : حجم الخط نسبة من ارتفاع الصورة (0.01 – 0.20)
   nameX      : الموضع الأفقي  0 = يمين ، 0.5 = وسط ، 1 = يسار
   nameY      : الموضع الرأسي  0 = أعلى ، 0.5 = وسط ، 1 = أسفل
   fontColor  : لون الخط مثل '#FFFFFF' أو '#6B3FA0'

   ═══════════════════════════════════════════════════════════════ */

const TEMPLATES = {
    'wida-one': {
        imgId: 'img-wida-one',
        fontScale: 0.048,
        nameX: 0.5,
        nameY: 0.655,       // white ribbon area in design one
        fontColor: '#6B3FA0',
    },
    'wida-two': {
        imgId: 'img-wida-two',
        fontScale: 0.048,
        nameX: 0.5,
        nameY: 0.50,
        fontColor: '#6B3FA0',
    }
};

let selectedTemplate = 'wida-one';

function selectTemplate(template) {
    selectedTemplate = template;

    document.querySelectorAll('.template-card').forEach(opt => {
        opt.classList.remove('selected');
    });

    document.querySelector(`[data-template="${template}"]`).classList.add('selected');
}

function generateCard() {
    const name = document.getElementById('name-input').value.trim();

    if (!name) {
        const input = document.getElementById('name-input');
        input.focus();
        input.style.borderColor = '#D968A0';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }

    const config = TEMPLATES[selectedTemplate];
    const img = document.getElementById(config.imgId);
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');

    const render = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        const fontSize = Math.floor(canvas.height * config.fontScale);
        ctx.font = `700 ${fontSize}px ShaheenFont, Cairo, sans-serif`;
        ctx.fillStyle = config.fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        /* No shadow */
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillText(name, canvas.width * config.nameX, canvas.height * config.nameY);

        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
    };

    if (img.complete && img.naturalWidth > 0) {
        render();
    } else {
        img.onload = render;
    }
}

function downloadCard() {
    const canvas = document.getElementById('result-canvas');
    const name = document.getElementById('name-input').value.trim();

    canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `تهنئة_عيد_الفطر_${name || 'card'}.jpg`;
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/jpeg', 0.95);
}

function goBack() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    /* Scroll to top on load */
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    document.getElementById('name-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') generateCard();
    });
});
