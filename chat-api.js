async function requestAIResponse(messages, assistant) {
  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, assistant })
    });
  } catch (error) {
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
      throw new Error('المساعد لا يعمل عند فتح الملف مباشرة. شغّل المشروع باستخدام vercel dev واضبط GEMINI_API_KEYS.');
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('اتصال الإنترنت غير متاح. تحقق من اتصالك ثم أعد المحاولة.');
    }
    console.error('AI chat request failed:', error);
    throw new Error('تعذر الوصول إلى خادم المساعد. تأكد من نشر الموقع مع خدمة /api/chat وإعداد GEMINI_API_KEYS.');
  }

  if (response.status === 404) {
    throw new Error('خدمة المساعد غير موجودة على هذا الموقع. انشر المشروع على Vercel وتأكد من تفعيل /api/chat.');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('تعذر قراءة استجابة المساعد الذكي. حاول مرة أخرى.');
  }
  if (!result || typeof result !== 'object') {
    throw new Error('وصلت استجابة غير صالحة من المساعد الذكي. حاول مرة أخرى.');
  }
  if (!response.ok) {
    throw new Error(typeof result.error === 'string' ? result.error : 'تعذر الاتصال بالمساعد الذكي. حاول مرة أخرى.');
  }

  if (typeof result.reply !== 'string' || !result.reply.trim()) {
    throw new Error('لم يصل رد صالح من المساعد الذكي. حاول مرة أخرى.');
  }

  return result.reply;
}
