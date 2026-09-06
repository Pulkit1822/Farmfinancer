export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any).__env?.apiUrl) 
    ? (window as any).__env.apiUrl 
    : 'https://farmfinancer-api.onrender.com',
  baseUrl: (typeof window !== 'undefined' && (window as any).__env?.baseUrl) 
    ? (window as any).__env.baseUrl 
    : 'https://farmfinancer-api.onrender.com/api',
  // Universal Google reCAPTCHA test key that works on all domains (including vercel.app)
  recaptchaSiteKey: (typeof window !== 'undefined' && (window as any).__env?.recaptchaSiteKey)
    ? (window as any).__env.recaptchaSiteKey
    : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
};
