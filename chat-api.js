async function requestAIResponse(messages, assistant) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, assistant })
  });

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
