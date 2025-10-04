import { useState, useEffect, useCallback } from "react";
import {
  getEmployees,
  getPositions,
  updateEmployee,
  deleteEmployee,
  activeEmp,
  deactiveEmp,
  exportStaffToExcel,
} from "../../service/apiStaff";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Captions, CaptionsOff, DeleteIcon, Edit3 } from "lucide-react";
import { motion } from "framer-motion";
import { Position, StaffDataFull } from "../../interface/StaffData_interface";
import { Pagination } from "@mui/material";
import RenderNotFound from "../../components/notFound/renderNotFound";
import { FaFileExcel, FaLeaf } from "react-icons/fa";
import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const STAFF = import.meta.env.VITE_CLOUDINARY_UPLOAD_STAFF;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const pageSize = 6;

// Trong file EmployeeList.tsx, bạn có thể định nghĩa mảng này ở trên cùng của component.

const mockEmployees = [
  {
    staffId: 1,
    name: "Trần Văn An",
    email: "an.tran@gmail.com",
    phone: "0901234567",
    address: "123 Đường Nguyễn Trãi, Q.5, TP.HCM",
    position: { positionId: 1, positionName: "Quản lý" },
    status: "ACTIVATE",
    startDate: "2020-01-15",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/an.jpg",
  },
  {
    staffId: 2,
    name: "Lê Thị Bình",
    email: "binh.le@gmail.com",
    phone: "0912345678",
    address: "456 Đường Lê Lợi, Q.1, TP.HCM",
    position: { positionId: 2, positionName: "Nha sĩ" },
    status: "ACTIVATE",
    startDate: "2019-05-20",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/binh.jpg",
  },
  {
    staffId: 3,
    name: "Nguyễn Văn Cường",
    email: "cuong.nguyen@gmail.com",
    phone: "0987654321",
    address: "789 Đường Hai Bà Trưng, Q.3, TP.HCM",
    position: { positionId: 2, positionName: "Nha sĩ" },
    status: "ACTIVATE",
    startDate: "2021-02-10",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/cuong.jpg",
  },
  {
    staffId: 4,
    name: "Phạm Thu Dung",
    email: "dung.pham@gmail.com",
    phone: "0978123456",
    address: "101 Đường Trần Hưng Đạo, Q.1, TP.HCM",
    position: { positionId: 3, positionName: "Kỹ thuật viên" },
    status: "DEACTIVATED",
    startDate: "2022-08-01",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/dung.jpg",
  },
  {
    staffId: 5,
    name: "Hoàng Minh Hải",
    email: "hai.hoang@gmail.com",
    phone: "0945678910",
    address: "22B Đường Thống Nhất, Q. Gò Vấp, TP.HCM",
    position: { positionId: 2, positionName: "Nha sĩ" },
    status: "ACTIVATE",
    startDate: "2020-11-25",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/hai.jpg",
  },
  {
    staffId: 6,
    name: "Đặng Ngọc Hân",
    email: "han.dang@gmail.com",
    phone: "0934567890",
    address: "33C Đường Nguyễn Đình Chiểu, Q.3, TP.HCM",
    position: { positionId: 4, positionName: "Tiếp tân" },
    status: "ACTIVATE",
    startDate: "2023-03-10",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/han.jpg",
  },
  {
    staffId: 7,
    name: "Võ Văn Hùng",
    email: "hung.vo@gmail.com",
    phone: "0967890123",
    address: "55A Đường Phan Đình Phùng, Q. Phú Nhuận, TP.HCM",
    position: { positionId: 2, positionName: "Nha sĩ" },
    status: "DEACTIVATED",
    startDate: "2018-09-05",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/hung.jpg",
  },
  {
    staffId: 8,
    name: "Trần Thanh Long",
    email: "long.tran@gmail.com",
    phone: "0923456789",
    address: "88 Đường Hồ Xuân Hương, Q.3, TP.HCM",
    position: { positionId: 3, positionName: "Kỹ thuật viên" },
    status: "ACTIVATE",
    startDate: "2022-01-30",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/long.jpg",
  },
  {
    staffId: 9,
    name: "Mai Lan Hương",
    email: "huong.mai@gmail.com",
    phone: "0956123789",
    address: "15 Tôn Thất Thiệp, Q.1, TP.HCM",
    position: { positionId: 2, positionName: "Nha sĩ" },
    status: "ACTIVATE",
    startDate: "2021-07-12",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/huong.jpg",
  },
  {
    staffId: 10,
    name: "Bùi Anh Tuấn",
    email: "tuan.bui@gmail.com",
    phone: "0909999888",
    address: "44 Nguyễn Văn Cừ, Q.5, TP.HCM",
    position: { positionId: 4, positionName: "Tiếp tân" },
    status: "ACTIVATE",
    startDate: "2023-05-01",
    imageUrl:
      "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/staff/tuan.jpg",
  },
];

const mockPositions = [
  { positionId: 1, positionName: "Quản lý" },
  { positionId: 2, positionName: "Nha sĩ" },
  { positionId: 3, positionName: "Kỹ thuật viên" },
  { positionId: 4, positionName: "Tiếp tân" },
];

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  // const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Original errors state, perhaps for a general form
  const [editingErrors, setEditingErrors] = useState<{
    [staffId: number]: { [field: string]: string };
  }>({}); // Errors for specific editing rows
  const [employees, setEmployees] = useState<StaffDataFull[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [editingRows, setEditingRows] = useState<{ [key: number]: any }>({});
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await fetchEmployees();
        await fetchPositions();
      } catch (error: unknown) {
        console.error("Error fetching data:", error);
        toast.error("Lỗi tải dữ liệu ban đầu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await getEmployees();
  //     setEmployees(response);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //     toast.error("Lỗi tải danh sách nhân viên.");
  //   }
  // };

  // Thay thế hàm fetchEmployees hiện tại bằng đoạn mã này
  const fetchEmployees = async () => {
    try {
      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Gán dữ liệu mẫu
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Lỗi tải danh sách nhân viên.");
    }
  };

  // const fetchPositions = async () => {
  //   try {
  //     const response = await getPositions();
  //     setPositions(response);
  //   } catch (error) {
  //     console.error("Error fetching positions:", error);
  //     toast.error("Lỗi tải danh sách chức vụ.");
  //   }
  // };

  // Thay thế hàm fetchPositions hiện tại bằng đoạn mã này
  const fetchPositions = async () => {
    try {
      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Gán dữ liệu mẫu
      setPositions(mockPositions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("Lỗi tải danh sách chức vụ.");
    }
  };

  // --- Hàm kiểm tra validation ( Reuse this as it is good) ---
  const validateField = useCallback((name: string, value: string): string => {
    value = String(value || "").trim(); // Ensure value is a string and trim
    switch (name) {
      case "name":
        if (!value) return "Vui lòng nhập họ và tên.";
        if (!/^[a-zA-Z\u00C0-\u1FFF\s]+$/.test(value))
          return "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
        return "";
      case "phone":
        if (!value) return "Vui lòng nhập số điện thoại.";
        if (!/^0\d{9}$/.test(value)) {
          return "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
        }
        return "";
      case "email":
        if (!value) return "Vui lòng nhập email.";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value))
          return "Email không hợp lệ. Phải là @gmail.com";
        return "";
      case "address":
        if (!value) return "Vui lòng nhập địa chỉ.";
        return "";
      default:
        return "";
    }
  }, []);

  const handleEditChange = async (
    staffId: number,
    field: string,
    value: string | number
  ) => {
    if (field === "status") return;
    setEditingRows((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value,
      },
    }));
    // Clear error for this field when user types
    setEditingErrors((prevErrors) => ({
      ...prevErrors,
      [staffId]: {
        ...prevErrors[staffId],
        [field]: "",
      },
    }));
    // No need to fetchEmployees here, it will be fetched on save or cancel
  };

  const handleEditBlur = (
    staffId: number,
    field: string,
    value: string | number
  ) => {
    const errorMessage = validateField(field, String(value));
    setEditingErrors((prevErrors) => ({
      ...prevErrors,
      [staffId]: {
        ...prevErrors[staffId],
        [field]: errorMessage,
      },
    }));
  };

  const handleEdit = (staffId: number) => {
    setEditMode((prev) => ({ ...prev, [staffId]: true }));
    // Initialize editingRows with current employee data if not already set
    const employee = employees.find((emp) => emp.staffId === staffId);
    if (employee) {
      setEditingRows((prev) => ({
        ...prev,
        [staffId]: { ...employee, ...prev[staffId] }, // Prioritize existing edits
      }));
    }
    // Clear any previous errors for this row
    setEditingErrors((prev) => ({ ...prev, [staffId]: {} }));
  };

  const handleCancelEdit = (staffId: number) => {
    setEditingRows((prev) => {
      const newRows = { ...prev };
      delete newRows[staffId];
      return newRows;
    });
    setEditMode((prev) => ({ ...prev, [staffId]: false }));
    setPreviewImages((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[staffId];
      return newPreviews;
    });
    // Clear errors for this row
    setEditingErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[staffId];
      return newErrors;
    });
  };

  const handleSaveEmployee = async (staffId: number) => {
    const employeeToUpdate = employees.find((emp) => emp.staffId === staffId);
    if (!employeeToUpdate) return;

    const currentEdits = editingRows[staffId] || {};
    const dataToValidate = {
      name: currentEdits.name ?? employeeToUpdate.name,
      email: currentEdits.email ?? employeeToUpdate.email,
      phone: currentEdits.phone ?? employeeToUpdate.phone,
      address: currentEdits.address ?? employeeToUpdate.address,
      positionId:
        currentEdits.positionId ?? employeeToUpdate.position?.positionId,
    };

    let formIsValid = true;
    const newErrorsForStaff: { [key: string]: string } = {};

    // Validate relevant fields
    (Object.keys(dataToValidate) as Array<keyof typeof dataToValidate>).forEach(
      (field) => {
        if (field === "positionId") return; // positionId is a select, usually doesn't need this type of validation
        const errorMessage = validateField(
          field,
          String(dataToValidate[field])
        );
        if (errorMessage) {
          newErrorsForStaff[field] = errorMessage;
          formIsValid = false;
        }
      }
    );
    if (!dataToValidate.positionId) {
      // Specific check for positionId
      newErrorsForStaff["positionId"] = "Vui lòng chọn chức vụ.";
      formIsValid = false;
    }

    setEditingErrors((prev) => ({
      ...prev,
      [staffId]: newErrorsForStaff,
    }));

    if (!formIsValid) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn cập nhật thông tin nhân viên này không?"
      )
    )
      return;

    try {
      const updatedData = {
        ...employeeToUpdate,
        ...currentEdits,
        positionId:
          currentEdits.positionId ?? employeeToUpdate.position?.positionId,
        position: {
          // Ensure position object is correctly structured if positionId changed
          ...employeeToUpdate.position,
          positionId:
            currentEdits.positionId ?? employeeToUpdate.position?.positionId,
          positionName:
            positions.find(
              (p) =>
                p.positionId ===
                (currentEdits.positionId ??
                  employeeToUpdate.position?.positionId)
            )?.positionName || "",
        },
      };

      if (currentEdits.imageFile) {
        const formData = new FormData();
        formData.append("file", currentEdits.imageFile);
        formData.append(UPLOAD_PRESET, STAFF);

        try {
          const uploadResponse = await axios.post(CLOUDINARY_URL, formData);
          updatedData.imageUrl = uploadResponse.data.secure_url;
        } catch (error: unknown) {
          console.error("Lỗi khi tải ảnh lên:", error);
          toast.error("Lỗi khi tải ảnh lên, vui lòng thử lại.");
          return;
        }
      }

      await updateEmployee(staffId, updatedData);
      // Instead of locally updating, fetch fresh data to ensure consistency
      await fetchEmployees();

      setEditingRows((prev) => {
        const newRows = { ...prev };
        delete newRows[staffId];
        return newRows;
      });
      setEditMode((prev) => ({ ...prev, [staffId]: false }));
      setPreviewImages((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[staffId];
        return newPreviews;
      });
      setEditingErrors((prev) => {
        // Clear errors on successful save
        const newErrors = { ...prev };
        delete newErrors[staffId];
        return newErrors;
      });
      toast.success("Cập nhật thông tin nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    staffId: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2048576) {
        // 2MB
        toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({ ...prev, [staffId]: previewUrl }));
      setEditingRows((prev) => ({
        ...prev,
        [staffId]: { ...prev[staffId], imageFile: file },
      }));
    }
  };

  // Xóa nhân viên
  const handleDeleteEmployee = async (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?"))
      return;
    try {
      const response = await deleteEmployee(staffId);
      setEmployees((prev) => prev.filter((emp) => emp.staffId !== staffId));
      return response;
      toast.success("Xóa nhân viên thành công!");
    } catch (error: unknown) {
      console.error("🔥 Lỗi toàn bộ:", error);

      if (
        (error as { response?: { data?: { code?: number } } }).response?.data
          ?.code === 1006
      ) {
        toast.error(
          "Không thể xóa nhân viên này đang phụ trách lịch hẹn nào đó!"
        );
      } else {
        const errorMessage = (
          error as { response?: { data?: { message?: string } } }
        )?.response?.data?.message;
        toast.error(errorMessage || "Xóa nhân viên thất bại!");
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || emp.status === statusFilter)
    );
  });

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleDeactivate = async (staffId: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn ngưng làm việc nhân viên này không?"
      )
    )
      return;
    try {
      await deactiveEmp(staffId);
      await fetchEmployees();
      toast.success("Ngưng làm việc nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi ngưng làm việc nhân viên:", error);
      toast.error("Ngưng làm việc thất bại!");
    }
  };

  const handleActivate = async (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn kích hoạt nhân viên này không?"))
      return;
    try {
      await activeEmp(staffId);
      await fetchEmployees();
      toast.success("Kích hoạt nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi kích hoạt nhân viên:", error);
      toast.error("Kích hoạt thất bại!");
    }
  };

  const exportExcel = async () => {
    try {
      await exportStaffToExcel();
      // Toast or notification for success can be added here
    } catch (error: unknown) {
      console.log("Lỗi khi xuat excel", error);
      toast.error("Xuất excel thất bại!");
    }
  };

  // The original handleBlur and validateForm are not used for inline editing,
  // but kept here if you have another form elsewhere.
  // --- Xử lý khi một trường mất focus (onBlur) ---
  // const handleBlur_original = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   if (['name', 'phone', 'email', 'address', 'startDate', 'positionId'].includes(name)) {
  //     const errorMessage = validateField(name, value);
  //     setErrors((prevErrors) => ({ // This setErrors is for the global errors state
  //       ...prevErrors,
  //       [name]: errorMessage,
  //     }));
  //   }
  // };

  // --- Hàm kiểm tra validation cho toàn bộ form (khi submit) ---
  // const validateForm_original = (formDataToCheck: any): boolean => { // Added formDataToCheck parameter
  //   const newErrors: { [key: string]: string } = {};
  //   let isValid = true;
  //   const fieldsToValidate: (keyof typeof formDataToCheck)[] = ['name', 'phone', 'email', 'address']; // Removed startDate, positionId as they are selects or date pickers

  //   fieldsToValidate.forEach(field => {
  //     const errorMessage = validateField(field, formDataToCheck[field]);
  //     if (errorMessage) {
  //       newErrors[field] = errorMessage;
  //       isValid = false;
  //     }
  //   });
  //   // setErrors(newErrors); // This setErrors is for the global errors state
  //   return isValid;
  // };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-y-4">
        <div className="relative h-[100px] w-[100px]">
          <div className="animate-spin rounded-full h-[90px] w-[90px] border-t-2 border-l-2 border-teal-400 absolute"></div>
          <div className="animate-spin rounded-full h-[80px] w-[80px] border-t-2 border-r-2 border-purple-400 absolute top-1 left-1"></div>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-green-400 absolute top-2 left-2"></div>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-blue-400 absolute top-2 left-2"></div>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-red-400 absolute top-2 left-2"></div>
        </div>
        <div className="flex items-center">
          <FaLeaf className="animate-bounce text-green-400 text-xl mr-2" />
          <span className="text-gray-600 text-sm">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sm:p-6 p-1 sm:mb-4 mb-20 sm:mt-0 mt-10 relative"
    >
      <ToastContainer limit={3} />
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        Danh sách nhân viên 🦷
      </h2>
      <div className="flex sm:gap-4 gap-1 mb-2 sm:flex-row">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          className="border p-4 rounded-full w-full  text-[12px] sm:text-[16px] dark:text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border sm:p-4 p-1 rounded-full text-[12px] sm:text-[16px] dark:text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVATE">Hoạt động</option>
          <option value="DEACTIVATED">Không hoạt động</option>
        </select>
      </div>
      <div className="flex items-center justify-end mb-3">
        <button
          className="flex items-center justify-center sm:gap-2 gap-1 bg-green-500 hover:bg-green-600 text-white sm:p-2 p-1 rounded-lg sm:w-[150px] w-[120px]"
          onClick={exportExcel}
        >
          <FaFileExcel size={20} /> Xuất excel
        </button>
      </div>
      {employees.length > 0 ? (
        <div className="grid sm:gap-6 gap-2 sm:gap-y-10 gap-y-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedEmployees.map((employee) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={employee.staffId}
              className="bg-white sm:p-4 p-2  rounded-lg shadow-md"
            >
              <div className="mt-4 text-center dark:text-black">
                {editMode[employee.staffId] ? (
                  <>
                    <div
                      className={`bg-emerald-400/20 rounded-t-xl  ${employee.status == "DEACTIVATED" ? "bg-red-400/20" : ""}`}
                    >
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={
                          previewImages[employee.staffId] ||
                          editingRows[employee.staffId]?.imageUrl ||
                          employee.imageUrl
                        }
                        alt="Ảnh"
                        className="sm:w-24 sm:h-24 w-16 h-16 mx-auto rounded-full object-cover cursor-pointer outline outline-green-300"
                        onClick={() =>
                          document
                            .getElementById(`file-input-${employee.staffId}`)
                            ?.click()
                        }
                      />
                      <input
                        type="file"
                        id={`file-input-${employee.staffId}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, employee.staffId)}
                      />
                    </div>

                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-left">
                      Họ và tên
                    </label>
                    <input
                      name="name"
                      className="w-full border p-2 rounded sm:text-sm text-[12px]"
                      value={
                        editingRows[employee.staffId]?.name ?? employee.name
                      }
                      onChange={(e) =>
                        handleEditChange(
                          employee.staffId,
                          "name",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        handleEditBlur(employee.staffId, "name", e.target.value)
                      }
                    />
                    {editingErrors[employee.staffId]?.name && (
                      <p className="text-red-500 text-xs text-left mt-1">
                        {editingErrors[employee.staffId].name}
                      </p>
                    )}

                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-left">
                      Email
                    </label>
                    <input
                      name="email"
                      className="w-full border p-2 rounded mt-1 sm:text-sm text-[12px]"
                      value={
                        editingRows[employee.staffId]?.email ?? employee.email
                      }
                      onChange={(e) =>
                        handleEditChange(
                          employee.staffId,
                          "email",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        handleEditBlur(
                          employee.staffId,
                          "email",
                          e.target.value
                        )
                      }
                    />
                    {editingErrors[employee.staffId]?.email && (
                      <p className="text-red-500 text-xs text-left mt-1">
                        {editingErrors[employee.staffId].email}
                      </p>
                    )}

                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-left">
                      Số điện thoại
                    </label>
                    <input
                      name="phone"
                      className="w-full border p-2 rounded mt-1 sm:text-sm text-[12px]"
                      value={
                        editingRows[employee.staffId]?.phone ?? employee.phone
                      }
                      onChange={(e) =>
                        handleEditChange(
                          employee.staffId,
                          "phone",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        handleEditBlur(
                          employee.staffId,
                          "phone",
                          e.target.value
                        )
                      }
                    />
                    {editingErrors[employee.staffId]?.phone && (
                      <p className="text-red-500 text-xs text-left mt-1">
                        {editingErrors[employee.staffId].phone}
                      </p>
                    )}

                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-left">
                      Địa chỉ
                    </label>
                    <input
                      name="address"
                      className="w-full border p-2 rounded mt-1 sm:text-sm text-[12px]"
                      value={
                        editingRows[employee.staffId]?.address ??
                        employee.address
                      }
                      onChange={(e) =>
                        handleEditChange(
                          employee.staffId,
                          "address",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        handleEditBlur(
                          employee.staffId,
                          "address",
                          e.target.value
                        )
                      }
                    />
                    {editingErrors[employee.staffId]?.address && (
                      <p className="text-red-500 text-xs text-left mt-1">
                        {editingErrors[employee.staffId].address}
                      </p>
                    )}

                    <label className="block text-gray-600 sm:text-sm text-[12px] m-1 text-left">
                      Chức vụ
                    </label>
                    <select
                      name="positionId"
                      className="w-full mt-1 border p-2 rounded sm:text-sm text-[12px]"
                      value={
                        editingRows[employee.staffId]?.positionId ??
                        employee.position?.positionId ??
                        ""
                      }
                      onChange={(e) =>
                        handleEditChange(
                          employee.staffId,
                          "positionId",
                          Number(e.target.value)
                        )
                      }
                      onBlur={(e) =>
                        handleEditBlur(
                          employee.staffId,
                          "positionId",
                          e.target.value
                        )
                      } // Can add validation for "required" if needed
                    >
                      <option value="" disabled>
                        Chọn chức vụ
                      </option>
                      {positions.map((pos) => (
                        <option key={pos.positionId} value={pos.positionId}>
                          {pos.positionName}
                        </option>
                      ))}
                    </select>
                    {editingErrors[employee.staffId]?.positionId && (
                      <p className="text-red-500 text-xs text-left mt-1">
                        {editingErrors[employee.staffId].positionId}
                      </p>
                    )}
                  </>
                ) : (
                  <div
                    className="sm:text-justify text-left"
                    style={{ lineHeight: "1.9" }}
                  >
                    <div
                      className={`bg-emerald-400/20 rounded-t-xl ${employee.status == "DEACTIVATED" ? "bg-red-400/20" : ""}`}
                    >
                      <img
                        src={employee.imageUrl}
                        alt="Ảnh"
                        className={`sm:w-24 sm:h-24 w-16 h-16 mx-auto rounded-full object-cover outline outline-green-300 ${employee.status == "DEACTIVATED" ? "outline-red-300" : ""}`}
                      />
                    </div>
                    <p className="sm:text-lg text-[13px] mt-4">
                      {employee.name}
                    </p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400 sm:line-clamp-none line-clamp-1">
                      Email: {employee.email}
                    </p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">
                      SĐT: {employee.phone}
                    </p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">
                      Ngày vào: {employee.startDate}
                    </p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400 sm:line-clamp-none line-clamp-2">
                      Địa chỉ: {employee.address}
                    </p>
                    <p className="sm:text-[14px] text-[12px] text-gray-400">
                      Chức vụ: {employee.position?.positionName}
                    </p>
                  </div>
                )}
                <p
                  className={`mt-2 sm:px-2 sm:py-2 rounded-2xl sm:text-sm text-[12px] ${employee.status === "ACTIVATE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  <span
                    className="animate-ping"
                    style={{
                      width: "8px",
                      marginRight: "10px",
                      height: "8px",
                      borderRadius: "50%",
                      display: "inline-block",
                      backgroundColor:
                        employee.status === "ACTIVATE" ? "#10B981" : "#EF4444",
                    }}
                  ></span>
                  {employee.status === "ACTIVATE"
                    ? "Đang làm việc"
                    : "Đã nghỉ việc"}
                </p>
                <div className="sm:mt-4 mt-2 flex justify-center gap-2">
                  {editMode[employee.staffId] ? (
                    <>
                      <button
                        onClick={() => handleSaveEmployee(employee.staffId)}
                        className="sm:px-4 sm:py-2 p-2  sm:text-sm text-[12px] bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => handleCancelEdit(employee.staffId)}
                        className="sm:px-4 sm:py-2 p-2  sm:text-sm text-[12px] bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Hoàn Tác
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center sm:gap-4 gap-2">
                      <button
                        onClick={() => handleEdit(employee.staffId)}
                        className="sm:px-5 sm:py-2 p-1 bg-blue-300 text-white rounded hover:bg-blue-500"
                      >
                        <Edit3 className="sm:w-5 sm:h-5 w-4 h-4" />
                      </button>
                      {employee.status === "ACTIVATE" && (
                        <button
                          title="Ngừng làm việc"
                          onClick={() => handleDeactivate(employee.staffId)}
                          className="sm:px-5 sm:py-2 p-1 bg-orange-200 text-white rounded hover:bg-orange-500"
                        >
                          <CaptionsOff className="sm:w-5 sm:h-5 w-4 h-4" />
                        </button>
                      )}

                      {employee.status === "DEACTIVATED" && (
                        <button
                          title="Kích hoạt"
                          onClick={() => handleActivate(employee.staffId)}
                          className="sm:px-5 sm:py-2 p-1 bg-green-200 text-white rounded hover:bg-green-500"
                        >
                          <Captions className="sm:w-5 sm:h-5 w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteEmployee(employee.staffId)}
                        className="sm:px-5 sm:py-2 p-1 bg-red-300 text-white rounded hover:bg-red-500"
                      >
                        <DeleteIcon className="sm:w-5 sm:h-5 w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="text-center text-gray-400 col-span-full mt-10">
              Không tìm thấy nhân viên nào!
            </div>
          )}
        </div>
      ) : (
        <RenderNotFound />
      )}

      {filteredEmployees.length > pageSize && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(filteredEmployees.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeList;
