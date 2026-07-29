/**
 * Utility to send form submissions to FormSubmit.co
 * Destination: proyectos@studiocab.mx
 * Template: Clean White Table (_template: 'table')
 * Language: Spanish
 */
export async function sendFormSubmit(formData = {}, customSubject = null) {
  const endpoint = 'https://formsubmit.co/ajax/proyectos@studiocab.mx';

  // Construct readable Spanish labels for FormSubmit table template
  const payload = {
    _subject: customSubject || `Nueva Consulta — Studio CAB (${formData.Nombre || formData.NombreCompleto || 'General'})`,
    _template: 'table',
    _captcha: 'false',
    ...formData
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('[FormSubmit] Form sent to proyectos@studiocab.mx successfully:', result);
    return result;
  } catch (error) {
    console.warn('[FormSubmit] Failed to send email via FormSubmit:', error);
    return { success: false, error };
  }
}
