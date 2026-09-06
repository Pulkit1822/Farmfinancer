export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any).__env?.apiUrl) 
    ? (window as any).__env.apiUrl 
    : 'https://farmfinancer-api.onrender.com',
  baseUrl: (typeof window !== 'undefined' && (window as any).__env?.baseUrl) 
    ? (window as any).__env.baseUrl 
    : 'https://farmfinancer-api.onrender.com/api',
};
