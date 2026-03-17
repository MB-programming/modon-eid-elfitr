/* ═══════════════════════════════════════════════════════════════
   إعدادات القوالب - Templates Configuration
   ═══════════════════════════════════════════════════════════════

   للتحكم في موقع وحجم الكلام على التصميمات:

   📐 fontScale (حجم الخط):
      - القيمة من 0.01 إلى 0.2
      - كل ما زادت القيمة، كل ما الخط بقى أكبر
      - مثال: 0.12 = خط كبير، 0.05 = خط صغير

   📍 nameX (موقع الكلام أفقياً - يمين/شمال):
      - القيمة من 0 إلى 1
      - 0 = أقصى اليمين
      - 0.5 = المنتصف
      - 1 = أقصى اليسار

   📍 nameY (موقع الكلام رأسياً - فوق/تحت):
      - القيمة من 0 إلى 1
      - 0 = أعلى الصورة
      - 0.5 = منتصف الصورة
      - 1 = أسفل الصورة

   🎨 fontColor (لون الخط):
      - استخدم كود الألوان مثل: '#FFFFFF' (أبيض)، '#D4AF37' (ذهبي)

   🌫️ shadowColor & shadowBlur (ظل الخط):
      - shadowColor: لون الظل مثل 'rgba(0, 0, 0, 0.8)' (أسود شفاف)
      - shadowBlur: مدى انتشار الظل (كل ما زاد، كل ما الظل بقى أوسع)

   ═══════════════════════════════════════════════════════════════ */

const TEMPLATES = {
    'wida-one': {
        imgId: 'img-wida-one',
        // حجم الخط: 0.035 = صغير
        fontScale: 0.035,
        // موقع الكلام أفقياً: 0.5 = في المنتصف
        nameX: 0.5,
        // موقع الكلام رأسياً: 0.84 = تحت خالص (قريب من آخر الصورة)
        nameY: 0.84,
        // لون الخط: أبيض
        fontColor: '#FFFFFF',
        // لون الظل: أسود شفاف
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        // مدى انتشار الظل: 20 = ظل واضح
        shadowBlur: 20
    },
    'wida-two': {
        imgId: 'img-wida-two',
        // حجم الخط: 0.035 = صغير
        fontScale: 0.035,
        // موقع الكلام أفقياً: 0.5 = في المنتصف
        nameX: 0.5,
        // موقع الكلام رأسياً: 0.80 = في النص السفلي تقريباً
        nameY: 0.80,
        // لون الخط: أبيض
        fontColor: '#FFFFFF',
        // لون الظل: أسود شفاف
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        // مدى انتشار الظل: 25 = ظل أوضح شوية
        shadowBlur: 25
    }
};

/* ═══════════════════════════════════════════════════════════════
   أمثلة للتحكم في الموقع:

   ✅ لو عايز الكلام يروح فوق:
      nameY: 0.2  (في الربع الأول من الصورة)

   ✅ لو عايز الكلام يروح يمين:
      nameX: 0.7  (جهة اليمين)

   ✅ لو عايز الكلام يروح شمال:
      nameX: 0.3  (جهة اليسار)

   ✅ لو عايز الخط أكبر:
      fontScale: 0.15  (زود الرقم)

   ✅ لو عايز الخط أصغر:
      fontScale: 0.06  (قلل الرقم)

   ═══════════════════════════════════════════════════════════════ */

let selectedTemplate = 'wida-one';

function selectTemplate(template) {
    selectedTemplate = template;

    document.querySelectorAll('.template-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    document.querySelector(`[data-template="${template}"]`).classList.add('selected');
}

function generateCard() {
    const name = document.getElementById('name-input').value.trim();

    if (!name) {
        const input = document.getElementById('name-input');
        input.focus();
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }

    const config = TEMPLATES[selectedTemplate];
    const img = document.getElementById(config.imgId);
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');

    // Wait for image to load
    const render = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const fontSize = Math.floor(canvas.height * config.fontScale);
        ctx.font = `700 ${fontSize}px ShaheenFont, sans-serif`;
        ctx.fillStyle = config.fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // NO SHADOW - شيلنا الظل
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillText(name, canvas.width * config.nameX, canvas.height * config.nameY);

        // Show step 2
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
        link.download = `wida-card-${selectedTemplate}-${name || 'card'}.jpg`;
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/jpeg', 0.95);
}

function goBack() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
}

// Enter key to generate
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('name-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') generateCard();
    });
});
