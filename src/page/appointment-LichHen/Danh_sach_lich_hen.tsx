import { useEffect, useState } from "react";
import {
  deleteAppointment,
  exportAppointmentToExcel,
  getAppointmentAll,
  updateStatusPaid,
} from "../../service/apiAppoinment";
import { AppointmentResponse } from "../../interface/Appointment_interface";
import { motion } from "framer-motion";
import AppointmentDetailModal from "./AppointmentDetailModal";
import { toast, ToastContainer } from "react-toastify";
import AppointmentList from "../../components/appointment/AppointmentList";
import AppointmentFilters from "../../components/appointment/AppointmentFilters";
import AnonymousAppointmentList from "../../components/appointment/AnonymousAppointmentList";
import PaymentModal from "../Payment/PaymentModal";
import { FaFileExcel, FaLeaf } from "react-icons/fa";

const pageSize = 8;
const NEW_THRESHOLD_SECONDS = 300;
const AUTO_REFRESH_INTERVAL = 30000;

const AppoinmentList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<AppointmentResponse[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentModal, setopenPaymentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageAmonyus, setCurrentPageAmonyus] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchItemAmonyus, setSearchItemAmonyus] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusFilterAmonyus, setStatusFilterAmonyus] = useState("");

  const statusMap: Record<string, { label: string; color: string }> = {
    SCHEDULED: {
      label: "Đã đặt lịch",
      color:
        "sm:px-2 px-1 py-1 sm:text-sm text-[10px] text-white  rounded-full bg-blue-600/70",
    },
    COMPLETED: {
      label: "Hoàn thành",
      color:
        "sm:px-2 px-1 py-1 sm:text-sm text-[10px] text-white rounded-full bg-green-600/70",
    },
    CANCELLED: {
      label: "Đã hủy",
      color:
        "sm:px-2 px-1 py-1 sm:text-sm text-[10px] text-white rounded-full bg-red-500/70",
    },
    PENDING: {
      label: "Chờ xác nhận",
      color:
        "sm:px-2 px-1 py-1 sm:text-sm text-[10px] text-white rounded-full bg-yellow-500/70",
    },
    PAID: {
      label: "Đã thanh toán",
      color:
        "sm:px-2 px-1 py-1 sm:text-sm text-[10px] text-white rounded-full bg-green-600/70",
    },
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchAppointment();
    } catch (error) {
      console.error("Không thể lấy danh sách lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchAppointment, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const fetchAppointment = async () => {
    try {
      const response = await getAppointmentAll();
      const now = Date.now();
      const sortedAppointments = response.sort(
        (a: { createdAt: string }, b: { createdAt: string }) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }
      );
      setAppointment(
        sortedAppointments.map(
          (appt: AppointmentResponse & { isNew?: boolean }) => ({
            ...appt,
            isNew:
              (now - new Date(appt.createdAt).getTime()) / 2000 <
              NEW_THRESHOLD_SECONDS,
          })
        )
      );
    } catch (error) {
      console.error("Không thể lấy danh sách lịch hẹn:", error);
    }
  };

  const filteredAppointment = appointment.filter((appoint) => {
    return (
      appoint.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || appoint.status === statusFilter)
    );
  });

  const fillteredAppointmentAmonyus = appointment.filter((apt) => {
    return (
      apt.gustName?.toLowerCase().includes(searchItemAmonyus.toLowerCase()) &&
      (statusFilterAmonyus === "" || apt.status === statusFilterAmonyus)
    );
  });

  // const paginatedAppointment = filteredAppointment.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );

  // const paginatedAppointmentAmonyus = fillteredAppointmentAmonyus.slice(
  //   (currentPageAmonyus - 1) * pageSize,
  //   currentPageAmonyus * pageSize
  // );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handlePageChangeAmonyus = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPageAmonyus(value);
  };

  // Xem chi tiết
  const handleOpenModal = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  // Payment modal
  const handleOpenPaymentModal = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setopenPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setopenPaymentModal(false);
    setSelectedAppointment(null);
  };

  const handleDeleted = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch hẹn này ?")) return;

    try {
      await deleteAppointment(id);
      toast.success(`Xóa dịch vụ thành công`);
      fetchAppointment();
    } catch (error) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại");
    }
  };

  const handleUpdateAppointmentPaidStatus = async (
    id: number,
    name: string
  ) => {
    if (!window.confirm("Bạn có chắc muốn xác nhận thanh toán lịch hẹn này ?"))
      return;

    try {
      await updateStatusPaid(id);
      toast.success(`Xác nhận thanh toán lịch hẹn ${name} thành công`);
      fetchAppointment();
    } catch (error) {
      console.error(`Lỗi kích hoạt dịch vụ`, error);
      toast.error("Xác nhận thất bại");
    }
  };

  // Xuất excel lịch hẹn
  const exportExcel = async () => {
    try {
      await exportAppointmentToExcel();
    } catch (error: unknown) {
      console.log("====================================");
      console.log("Lỗi khi xuat excel", error);
      console.log("====================================");
    }
  };

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
      className="sm:p-4 sm:mb-6 mb-20 sm:mt-0 mt-10 dark:text-black"
    >
      <ToastContainer />
      <h2 className="sm:text-2xl text-lg font-bold mb-4 dark:text-white">
        Danh sách lịch hẹn 🦷
      </h2>
      <div className="flex items-center justify-end mb-3">
        <button
          className="flex items-center justify-center sm:gap-2 gap-1 bg-green-500 hover:bg-green-600 text-white sm:p-2 p-1 rounded-lg sm:w-[150px] w-[120px]"
          onClick={exportExcel}
        >
          <FaFileExcel size={20} /> Xuất excel
        </button>
      </div>
      {/* Anonymous Appointments */}
      <details>
        <summary className="sm:text-[20px] text-[14px] text-gray-600 mb-4 bg-white p-3 rounded-lg outline outline-2 outline-gray-300 shadow-lg cursor-pointer">
          Khách hàng ẩn danh
        </summary>
        <AppointmentFilters
          searchTerm={searchItemAmonyus}
          setSearchTerm={setSearchItemAmonyus}
          statusFilter={statusFilterAmonyus}
          setStatusFilter={setStatusFilterAmonyus}
        />
        <AnonymousAppointmentList
          //appointments={paginatedAppointmentAmonyus.map(appt => ({ ...appt, isNew: (lastFetchedTime - new Date(appt.createdAt).getTime()) / 1000 < NEW_THRESHOLD_SECONDS }))}
          appointments={fillteredAppointmentAmonyus}
          statusMap={statusMap}
          handleOpenModal={handleOpenModal}
          handleOpenPaymentModal={handleOpenPaymentModal}
          handleDeleted={handleDeleted}
          currentPage={currentPageAmonyus}
          pageSize={pageSize}
          handlePageChange={handlePageChangeAmonyus}
        />
      </details>

      {/* Registered Appointments */}
      <details open className="mt-10">
        <summary className="sm:text-[20px] text-[14px] text-gray-600 mb-4 bg-white p-3 rounded-lg outline outline-2 outline-gray-300 shadow-lg cursor-pointer">
          Danh sách lịch hẹn
        </summary>
        <AppointmentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <AppointmentList
          // appointments={paginatedAppointment.map(appt => ({ ...appt, isNew: (lastFetchedTime - new Date(appt.createdAt).getTime()) / 1000 < NEW_THRESHOLD_SECONDS }))}
          appointments={filteredAppointment}
          statusMap={statusMap}
          handleOpenModal={handleOpenModal}
          handleOpenPaymentModal={handleOpenPaymentModal}
          handleDeleted={handleDeleted}
          currentPage={currentPage}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
        />
      </details>

      <AppointmentDetailModal
        open={openModal}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
        onUpdateSuccess={fetchAppointment}
      />

      <PaymentModal
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        appointment={selectedAppointment}
        onUpdateSuccess={fetchAppointment}
        handleUpdateAppointmentPaidStatus={handleUpdateAppointmentPaidStatus}
      />
    </motion.div>
  );
};

export default AppoinmentList;
