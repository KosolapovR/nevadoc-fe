const BASE_URL = "http://localhost:8000/api";
const URLS = {
  getProducts: () => `${BASE_URL}/product`,
  getSizes: (id?: string) => `${BASE_URL}/size${id ? `/${id}` : ""}`,
  getColors: () => `${BASE_URL}/color`,
};

export { URLS };
