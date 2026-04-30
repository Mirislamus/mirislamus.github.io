import { toast } from './toast.js';

const BOT_TOKEN = 'YOUR_BOT_TOKEN';       // <-- замените на токен бота
const CHAT_ID = 'YOUR_CHAT_ID';           // <-- замените на ID чата

export function initForm() {
  const phoneInput = document.getElementById('phone');
  if (phoneInput && typeof IMask !== 'undefined') {
    IMask(phoneInput, {
      mask: '+998 (00) 000-00-00',
      lazy: false,
      placeholderChar: '_',
    });
  }

  // Date constraints
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const today = new Date().toISOString().split('T')[0];
  if (checkin) {
    checkin.min = today;
    checkin.addEventListener('change', () => {
      if (checkout) checkout.min = checkin.value;
    });
  }
  if (checkout) {
    checkout.min = today;
  }

  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add('is-loading');
    btn.disabled = true;

    const data = {
      checkin: form.checkin.value,
      checkout: form.checkout.value,
      guests: form.guests.value,
      room: form.room.options[form.room.selectedIndex].text,
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      comment: form.comment.value.trim(),
    };

    const text = `
<b>Новая заявка с сайта Friday</b>

📅 Заезд: ${data.checkin}
📅 Выезд: ${data.checkout}
👥 Гости: ${data.guests}
🏨 Номер: ${data.room}
👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
💬 Комментарий: ${data.comment || '—'}
    `.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Заявка отправлена',
          message: 'Мы свяжемся с вами в ближайшее время.',
          type: 'success',
        });
        form.reset();
      } else {
        throw new Error('Telegram API error');
      }
    } catch (err) {
      toast({
        title: 'Ошибка отправки',
        message: 'Пожалуйста, позвоните нам напрямую: +998 71 235 59 39',
        type: 'error',
      });
    } finally {
      btn.classList.remove('is-loading');
      btn.disabled = false;
    }
  });
}

function validateForm(form) {
  let isValid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#b91c1c';
    } else {
      field.style.borderColor = '';
    }
  });

  const phone = form.phone;
  if (phone && phone.value.includes('_')) {
    isValid = false;
    phone.style.borderColor = '#b91c1c';
    toast({
      title: 'Некорректный телефон',
      message: 'Введите номер полностью в формате +998 (__) ___-__-__',
      type: 'error',
    });
  }

  if (!isValid) {
    toast({
      title: 'Заполните все поля',
      message: 'Проверьте правильность введённых данных.',
      type: 'error',
    });
  }

  return isValid;
}
