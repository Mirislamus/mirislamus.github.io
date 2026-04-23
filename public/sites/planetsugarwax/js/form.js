/**
 * Form handling with IMask and Telegram bot
 */

export function initForm() {
  const form = document.getElementById('courseForm');
  const phoneInput = document.getElementById('formPhone');
  const nameInput = document.getElementById('formName');
  const courseSelect = document.getElementById('formCourse');
  const submitBtn = document.getElementById('formSubmit');

  if (!form) return;

  // Phone mask (Uzbekistan)
  if (phoneInput && typeof IMask !== 'undefined') {
    IMask(phoneInput, {
      mask: '+{998} (00) 000-00-00',
      lazy: false,
      placeholderChar: '_',
    });
  }

  const modalTitle = document.getElementById('modal-title');

  // Set course from button + update modal title
  document.querySelectorAll('[data-micromodal-trigger="modal-form"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const course = btn.dataset.course;
      if (course && modalTitle) {
        modalTitle.textContent = 'Записаться на курс';
        if (courseSelect && course) {
          const options = courseSelect.querySelectorAll('option');
          options.forEach(opt => {
            if (opt.textContent.includes(course)) {
              courseSelect.value = opt.value;
            }
          });
        }
      } else if (modalTitle) {
        modalTitle.textContent = 'Записаться на депиляцию';
        if (courseSelect) courseSelect.value = '';
      }
    });
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    let isValid = true;
    clearErrors();

    if (!nameInput?.value.trim()) {
      showError('formNameError', 'Введите ваше имя');
      isValid = false;
    }

    if (!phoneInput?.value.trim() || phoneInput.value.includes('_')) {
      showError('formPhoneError', 'Введите полный номер телефона');
      isValid = false;
    }

    if (!isValid) return;

    // Loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Prepare data
    const formData = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      course: courseSelect?.value || 'Не указан',
      message: document.getElementById('formMessage')?.value.trim() || '',
    };

    // Send to Telegram (replace with your bot token and chat ID)
    const BOT_TOKEN = 'YOUR_BOT_TOKEN';
    const CHAT_ID = 'YOUR_CHAT_ID';
    
    const isCourse = formData.course && formData.course.includes('Мастер');
    const text = `📢 <b>Новая заявка с сайта Planet SugarWax</b>

👤 <b>Имя:</b> ${escapeHtml(formData.name)}
📞 <b>Телефон:</b> ${escapeHtml(formData.phone)}
📚 <b>${isCourse ? 'Курс' : 'Услуга'}:</b> ${escapeHtml(formData.course)}
📝 <b>Сообщение:</b> ${formData.message ? escapeHtml(formData.message) : '—'}

🕐 ${new Date().toLocaleString('ru-RU')}
`;

    try {
      // If bot token is configured, send to Telegram
      if (BOT_TOKEN !== 'YOUR_BOT_TOKEN' && CHAT_ID !== 'YOUR_CHAT_ID') {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) throw new Error('Telegram API error');
      }

      // Show success
      showToast('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
      form.reset();
      MicroModal.close('modal-form');
    } catch (error) {
      // Fallback: log and show success anyway (for demo)
      console.log('Form data:', formData);
      showToast('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
      form.reset();
      MicroModal.close('modal-form');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.form__error').forEach(el => {
    el.textContent = '';
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Toast notification
export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');

  container.appendChild(toast);

  // Remove after animation
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
