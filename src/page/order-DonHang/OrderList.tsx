import { useEffect, useState } from "react";
import {
  cancelOrder,
  deleteOrder,
  deliveredOrder,
  exportOrdersToExcel,
  getAllOrders,
  paidOrder,
} from "../../service/apiOrder";
import { OrderResponse } from "../../interface/Order_interface";
import { motion } from "framer-motion";
import RenderNotFound from "../../components/notFound/renderNotFound";
import { CreditCard, Search } from "lucide-react";
import { Pagination } from "@mui/material";
import PaymentOrderModal from "../Payment/PaymentOrderModal";
import { FaFileExcel, FaLeaf } from "react-icons/fa";
import OrderStatus from "./OrderStatus";
import { toast, ToastContainer } from "react-toastify";

const pageSize = 8;
const OrderList = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]); // Danh sách đơn hàng
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // Trạng thái lọc
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  ); // Đơn hàng được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

  useEffect(() => {
    setLoading(true);
    try {
      fetchOrders();
    } catch (error: unknown) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      const now = new Date();
      const sortedOrders = response.sort(
        (a: OrderResponse, b: OrderResponse) => {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          return dateB.getTime() - dateA.getTime();
        }
      );
      setOrders(
        sortedOrders.map((order: OrderResponse) => ({
          ...order,
          isNew:
            (now.getTime() - new Date(order.orderDate).getTime()) / 1000 < 60,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  // Tìm kiếm theo tên
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.trim().toLowerCase(); // Loại bỏ khoảng trắng và chuyển về chữ thường
    return (
      (order.guestName?.toLowerCase().includes(search) || // Tìm theo tên khách hàng ẩn danh
        order.user?.name.toLowerCase().includes(search) || // Tìm theo tên khách hàng
        order.id.toString().includes(search)) && // Tìm theo ID đơn hàng
      (!statusFilter || order.status === statusFilter)
    ); // Lọc theo trạng thái nếu có
  });

  // Phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleOpenModal = (order: OrderResponse) => {
    setSelectedOrder(order); // Lưu thông tin đơn hàng được chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleCloseModal = () => {
    setSelectedOrder(null); // Xóa thông tin đơn hàng được chọn
    setIsModalOpen(false); // Đóng modal
  };

  // Xóa đơn hàng
  const handleDeleteOrder = async (orderId: number, orderName: string) => {
    if (!window.confirm("Bạn muốn xóa đơn hàng này không?")) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((order) => order.id !== orderId));
      toast.success(`Xóa đơn hàng #${orderName} thành công!`);
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      toast.error("Xóa đơn hàng thất bại!");
    }
  };

  // Cập nhật trạng thái đã giao
  const handleUpdateOrderDeliveredStatus = async (
    orderId: number,
    orderName: string
  ) => {
    if (!window.confirm("Bạn muốn cập nhật trạng thái đơn hàng này không?"))
      return;
    try {
      await deliveredOrder(orderId);
      fetchOrders();
      toast.success(`Cập nhật trạng thái đơn hàng #${orderName} thành công!`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Cập nhật trạng thái đơn hàng thất bại!");
    }
  };

  // Cập nhật trạng thái hủy
  const handleUpdateOrderCancelStatus = async (
    orderId: number,
    orderName: string
  ) => {
    if (!window.confirm("Bạn muốn cập nhật trạng thái đơn hàng này không?"))
      return;
    try {
      await cancelOrder(orderId);
      fetchOrders();
      toast.success(`Cập nhật trạng thái đơn hàng #${orderName} thành công!`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Cập nhật trạng thái đơn hàng thất bại!");
    }
  };

  // Cập nhạt trạng thái thanh toán
  const handleUpdateOrderPaidStatus = async (
    orderId: number,
    orderName: string
  ) => {
    if (!window.confirm("Bạn muốn cập nhật trạng thái đơn hàng này không?"))
      return;
    try {
      await paidOrder(orderId);
      fetchOrders();
      toast.success(`Cập nhật trạng thái đơn hàng #${orderName} thành công!`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Cập nhật trạng thái đơn hàng thất bại!");
    }
  };

  // Xuất excel lịch hẹn
  const exportExcel = async () => {
    try {
      await exportOrdersToExcel();
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
      className="sm:p-6 p-2 bg-white rounded-lg shadow-md sm:mb-6 mb-20 sm:mt-0 mt-10 dark:bg-gray-800"
    >
      <ToastContainer />
      <h2 className="sm:text-2xl text-lg font-semibold">
        Danh sách đơn hàng 🦷
      </h2>
      <div className="flex justify-between mb-4 mt-4">
        <div className="relative flex items-center w-full md:justify-center">
          <input
            type="text"
            className="sm:w-[50%] w-full dark:text-black sm:p-4 p-2 sm:text-[16px] text-[14px] pr-12 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Tìm kiếm theo tên, id đơn hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-[calc(25%-2rem)] sm:right-[calc(25%+1rem)] top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </div>
        </div>
        <select
          className="border p-2 rounded-lg ml-2 shadow-lg dark:text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="DELIVERED">Đã giao</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="PAID">Đã thanh toán</option>
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
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentOrders.map((order) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={order.id}
              className="sm:text-[16px] text-[14px] relative border rounded-lg p-4 shadow-md
                        hover:bg-blue-50
                        hover:dark:text-black
                        hover:cursor-pointer
                        "
            >
              {/* Thông tin đơn hàng */}
              {order.isNew && (
                <span className="absolute top-2 left-2 inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
                  New ✨
                </span>
              )}

              <OrderStatus orderStatus={order.status} />
              <div className="flex justify-between items-center mb-4 mt-5">
                <div>
                  <p className="font-semibold">
                    Mã đơn hàng:{" "}
                    <span className="text-blue-500">#{order.id}</span>
                  </p>
                  <p>
                    Khách hàng:{" "}
                    {order.user
                      ? order.user.name
                      : order.guestName || "Khách hàng ẩn danh"}
                  </p>
                  <p>
                    Ngày đặt:{" "}
                    {new Date(order.orderDate).toLocaleString("vi-VN", {
                      weekday: "long",
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p>Địa chỉ: {order.shippingAddress || "Không có"}</p>
                  <p>Số điện thoại: {order.shippingPhone || "Không có"}</p>
                  <p>Ghi chú: {order.notes}</p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="mb-4 sm:h-[200px] h-auto sm:text-[16px] text-[14px]">
                <h3 className="font-semibold mb-2">Sản phẩm:</h3>
                <ul className="space-y-2">
                  {order.orderItems.slice(0, 2).map((item) => (
                    <li key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.nameProduct}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">
                          {item.product.nameProduct}
                        </p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity} x{" "}
                          {item.price.toLocaleString()} VNĐ
                        </p>
                        <p className="text-sm text-gray-500">
                          Thành tiền: {item.subTotal.toLocaleString()} VNĐ
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {order.orderItems.length > 2 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Và {order.orderItems.length - 2} sản phẩm khác...
                  </p>
                )}
              </div>

              {/* Tổng tiền */}
              <div className="sm:text-[16px] text-[14px]">
                <p className="font-semibold text-green-500">
                  Tổng tiền: {order.totalAmount.toLocaleString()} VNĐ
                </p>
              </div>

              {/* THanh toán */}

              {order.status != "PAID" && (
                <div className="">
                  {order.status != "CANCELLED" && (
                    <div className="flex justify-end mt-4 sm:text-[16px] text-[14px]">
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => handleOpenModal(order)}
                      >
                        <CreditCard className="sm:w-5 sm:h-5 w-4 h-4" /> Thanh
                        toán
                      </button>
                    </div>
                  )}

                  {order.status != "DELIVERED" && (
                    <div className="flex flex-col">
                      <label>Cập nhật trạng thái:</label>

                      <div className="w-full flex gap-3 items-center">
                        {order.status != "CANCELLED" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateOrderDeliveredStatus(
                                  order.id,
                                  order.id.toString()
                                )
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-green-600"
                            >
                              Hoàn thành
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateOrderCancelStatus(
                                  order.id,
                                  order.id.toString()
                                )
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-red-500"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteOrder(order.id, order.id.toString())
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-orange-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <RenderNotFound />
      )}

      {filteredOrders.length === 0 && <RenderNotFound />}

      {/* Phân trang */}
      {currentOrders.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(filteredOrders.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}

      {/* Modal Thanh Toán */}
      {isModalOpen && selectedOrder && (
        <PaymentOrderModal
          open={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
          handleUpdateOrderPaidStatus={handleUpdateOrderPaidStatus}
        />
      )}
    </motion.div>
  );
};

export default OrderList;
