import axios from "axios";
import {
  CategoryForm,
  ServiceDentalForm,
  ServiceDentalFormUpdate,
} from "../interface/ServiceSPA_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_URL_SERVER,
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// Auth - Đăng nhập, Đăng ký, Đăng xuất -----------------------------------------------------------------------------------------------------------

// Lấy thông tin người dùng từ ID
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/auth/users/${id}`, {
      // Không cần thêm header 'Authorization' nếu backend kiểm tra cookie trực tiếp
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch user data.");
    }
  }
};

//Role - Quyền -----------------------------------------------------------------------------------------------------------
// Lấy danh sách quyền
export const getRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch roles.");
    }
  }
};

// Dịch vụ ----------------------------------------------------------------

export const getServiceDental = async () => {
  try {
    const response = await api.get("/service-spa");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch service SPA.");
    }
  }
};

export const addServiceDental = async (data: ServiceDentalForm) => {
  try {
    const response = await api.post("/service-spa", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Không thể kết nối đến server.");
    }
  }
};

export const deleteServiceDental = async (id: number) => {
  try {
    const response = await api.delete(`/service-spa/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Không thể kết nối server");
    }
  }
};

export const updateServiceDental = async (
  id: number,
  data: ServiceDentalFormUpdate
) => {
  try {
    const response = await api.put(`/service-spa/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to update Dental service.");
    }
  }
};

// Activate the service

export const activateServiceDental = async (id: number) => {
  try {
    const response = await api.put(`/service-spa/activate/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to activate Dental service.");
    }
  }
};

// Deactivate the service

export const deactivateServiceDental = async (id: number) => {
  try {
    const response = await api.put(`/service-spa/deactivate/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to deactivate Dental service.");
    }
  }
};

// Category - Danh mục ----------------------------------------------------------------

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch categories.");
    }
  }
};

export const addCategory = async (data: CategoryForm) => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to add category.");
    }
  }
};

// Thống kế tổng số lượng dịch vụ ----------------------------------------------------------------

export const getCountServiceDental = async () => {
  try {
    const response = await api.get("/service-dental/count");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch statistics.");
    }
  }
};

// Thống kê số lượng dịch vụ theo danh mục

export const getCountServiceDentalByCategory = async () => {
  try {
    const response = await api.get("/service-spa/count-by-category");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch statistics.");
    }
  }
};

// Xuất sang Excel

export const exportServiceDentalToExcel = async () => {
  try {
    const response = await api.get("/service-spa/export/excel", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Lấy ngày tháng năm hiện tại
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(now.getDate()).padStart(2, "0");

    // Tạo tên file kết hợp
    const filename = `Danh_sach_dich_vu_${year}${month}${day}.xlsx`;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to export employees.");
    }
  }
};
