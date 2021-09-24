const BASE_URL = "http://localhost:8000/api";
const URLS = {
  getProducts: () => `${BASE_URL}/product`,
  getFileUpload: () => `${BASE_URL}/upload-file`,
  getFileDownload: () => `${BASE_URL}/download-file`,
  getParsedProducts: () => `${BASE_URL}/parsed`,
  getSizes: (id?: string) => `${BASE_URL}/size${id ? `/${id}` : ""}`,
  getColors: (id?: string) => `${BASE_URL}/color${id ? `/${id}` : ""}`,
  getMaterials: (id?: string) => `${BASE_URL}/material${id ? `/${id}` : ""}`,
  getSleeves: (id?: string) => `${BASE_URL}/sleeve${id ? `/${id}` : ""}`,
  getPrints: (id?: string) => `${BASE_URL}/print${id ? `/${id}` : ""}`,
  getSellers: (id?: string) => `${BASE_URL}/seller${id ? `/${id}` : ""}`,
  getStocks: (id?: string) => `${BASE_URL}/stock${id ? `/${id}` : ""}`,
};

export { URLS };
