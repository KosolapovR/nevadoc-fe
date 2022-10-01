const BASE_URL = "http://localhost:8000/api";
const URLS = {
  getProducts: (id?: string) => `${BASE_URL}/product${id ? `/${id}` : ""}`,
  getFileUpload: () => `${BASE_URL}/upload-file`,
  getClientsUpload: () => `${BASE_URL}/upload-clients`,
  getFileDownload: () => `${BASE_URL}/download-file`,
  getClientsDownload: () => `${BASE_URL}/download-clients`,
  getParsedProducts: () => `${BASE_URL}/parsed`,
  getSizes: (id?: string) => `${BASE_URL}/size${id ? `/${id}` : ""}`,
  getColors: (id?: string) => `${BASE_URL}/color${id ? `/${id}` : ""}`,
  getMaterials: (id?: string) => `${BASE_URL}/material${id ? `/${id}` : ""}`,
  getSleeves: (id?: string) => `${BASE_URL}/sleeve${id ? `/${id}` : ""}`,
  getPrints: (id?: string) => `${BASE_URL}/print${id ? `/${id}` : ""}`,
  getSellers: (id?: string) => `${BASE_URL}/seller${id ? `/${id}` : ""}`,
  getStocks: (id?: string) => `${BASE_URL}/stock${id ? `/${id}` : ""}`,
  getClientLastDate: () => `${BASE_URL}/client-last-date`,
};

export { URLS };
