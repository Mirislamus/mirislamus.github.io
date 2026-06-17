// Telegram Bot configuration
// NOTE: Replace these with your actual bot token and chat ID
const TELEGRAM_BOT_TOKEN = "8946078764:AAH-kePe5TKG-3W-Wn7_1rn7oAIbKVNc2lk";
const TELEGRAM_CHAT_ID = "-1004322846497";

// Toast helper
function showToast({ type = "success", title, message, duration = 4000 }) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "status");

  const iconName = type === "success" ? "check-circle" : "alert-circle";

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast__icon" aria-hidden="true"></i>
    <div class="toast__content">
      <div class="toast__title">${title}</div>
      <div class="toast__message">${message}</div>
    </div>
    <button class="toast__close" aria-label="Закрыть уведомление">
      <i data-lucide="x" aria-hidden="true"></i>
    </button>
  `;

  container.appendChild(toast);

  // Initialize lucide icons inside toast
  if (window.lucide) {
    lucide.createIcons({ nodes: [toast] });
  }

  // Close button
  const closeBtn = toast.querySelector(".toast__close");
  closeBtn?.addEventListener("click", () => hideToast(toast));

  // Auto remove
  setTimeout(() => hideToast(toast), duration);
}

function hideToast(toast) {
  toast.classList.add("is-hiding");
  setTimeout(() => {
    toast.remove();
  }, 300);
}

// Phone mask initialization
function initPhoneMask(inputId) {
  const input = document.getElementById(inputId);
  if (!input || !window.IMask) return;

  IMask(input, {
    mask: "+{998} (00) 000-00-00",
    lazy: false,
    placeholderChar: "_",
  });
}

initPhoneMask("phone");
initPhoneMask("modal-phone");

// Form validation
function validateForm(nameInput, phoneInput, nameError, phoneError) {
  let isValid = true;

  // Name validation
  if (!nameInput.value.trim()) {
    nameError.textContent = "Введите ваше имя";
    nameInput.classList.add("is-invalid");
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    nameError.textContent = "Имя должно содержать минимум 2 символа";
    nameInput.classList.add("is-invalid");
    isValid = false;
  } else {
    nameError.textContent = "";
    nameInput.classList.remove("is-invalid");
  }

  // Phone validation
  const phoneValue = phoneInput.value.replace(/\D/g, "");
  if (!phoneValue || phoneValue.length < 12) {
    phoneError.textContent = "Введите полный номер телефона";
    phoneInput.classList.add("is-invalid");
    isValid = false;
  } else {
    phoneError.textContent = "";
    phoneInput.classList.remove("is-invalid");
  }

  return isValid;
}

// Telegram send function
async function sendToTelegram(data) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram bot token or chat ID is not configured");
    // Demo mode: simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { ok: true, demo: true };
  }

  const text = `
<b>Новая заявка с Volt Master</b>

<b>Имя:</b> ${data.name}
<b>Телефон:</b> ${data.phone}
<b>Услуга:</b> ${data.service || "Не указана"}
<b>Сообщение:</b> ${data.message || "Нет"}
  `.trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: "HTML",
    }),
  });

  return response.json();
}

// Form submission handler
function initForm(
  formId,
  nameId,
  phoneId,
  nameErrorId,
  phoneErrorId,
  submitBtnId,
) {
  const form = document.getElementById(formId);
  if (!form) return;

  const nameInput = document.getElementById(nameId);
  const phoneInput = document.getElementById(phoneId);
  const nameError = document.getElementById(nameErrorId);
  const phoneError = document.getElementById(phoneErrorId);
  const submitBtn = document.getElementById(submitBtnId);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(nameInput, phoneInput, nameError, phoneError)) {
      return;
    }

    // Show loading state
    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    const data = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: form.querySelector("#service")?.value || "",
      message: form.querySelector("#message")?.value || "",
    };

    try {
      const result = await sendToTelegram(data);

      if (result.ok) {
        showToast({
          type: "success",
          title: "Заявка отправлена",
          message: result.demo
            ? "Демо-режим: заявка принята. Настройте токен бота для реальной отправки."
            : "Наш мастер свяжется с вами в течение 15 минут.",
        });
        form.reset();
      } else {
        throw new Error("Telegram API error");
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Ошибка отправки",
        message: "Пожалуйста, позвоните нам напрямую или попробуйте позже.",
      });
      console.error("Form submit error:", error);
    } finally {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
    }
  });

  // Real-time validation cleanup
  nameInput?.addEventListener("input", () => {
    if (nameInput.classList.contains("is-invalid")) {
      nameError.textContent = "";
      nameInput.classList.remove("is-invalid");
    }
  });

  phoneInput?.addEventListener("input", () => {
    if (phoneInput.classList.contains("is-invalid")) {
      phoneError.textContent = "";
      phoneInput.classList.remove("is-invalid");
    }
  });
}

// Init forms
initForm(
  "order-form",
  "name",
  "phone",
  "name-error",
  "phone-error",
  "submit-btn",
);
initForm(
  "modal-form",
  "modal-name",
  "modal-phone",
  "modal-name-error",
  "modal-phone-error",
  "modal-submit-btn",
);
