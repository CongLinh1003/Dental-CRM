import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Pagination,
} from "@mui/material";
import { getAllPayment, totalAmountPayment } from "../../service/apiPayment";
import { PaymentResponse } from "../../interface/Payment_interface";
import { FaLeaf } from "react-icons/fa";

const pageSize = 6;
const ServicePaymentHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentResponse[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPaymentAll = async () => {
    try {
      const response = await getAllPayment();
      const now = Date.now();
      const sortedAppointments = response.sort(
        (a: { createdAt: string }, b: { createdAt: string }) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }
      );
      setPaymentHistory(
        sortedAppointments.map(
          (appt: PaymentResponse & { isNew?: boolean }) => ({
            ...appt,
            isNew: (now - new Date(appt.createdAt).getTime()) / 1000 < 60,
          })
        )
      );
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const fetchTotalAmountPayment = async () => {
    try {
      const response = await totalAmountPayment();
      setTotalAmount(response);
    } catch (error) {
      console.error("Error fetching total amount:", error);
      return 0;
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      fetchPaymentAll();
      fetchTotalAmountPayment();
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const filteredPaymentHistory = paymentHistory.filter((payment) => {
    const searchFields = [
      payment.transactionId,
      payment.appointment.gustName,
      payment.appointment.userId?.name,
      payment.appointment.serviceIds.map((service) => service.name).join(", "),
      payment.bankCode,
      payment.paymentMethod,
    ];
    return searchFields.some((field) =>
      String(field).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Phân trang lịch sử thanh toán đã lọc
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPaymentHistory = filteredPaymentHistory.slice(
    startIndex,
    endIndex
  );

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
          <span className="text-gray-600 text-sm">Đang và tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:p-4 gap-8 sm:mb-4 mb-20 sm:mt-0 mt-10">
      <p className="sm:text-2xl text-lg font-bold">
        Lịch sử thanh toán dịch vụ🦷
      </p>

      <div className="w-full flex justify-end items-center gap-2 sm:text-lg text-sm">
        <p>Tổng giao dịch:</p>
        <p className="p-3 bg-blue-400 text-white rounded-lg ">
          {" "}
          {totalAmount.toLocaleString("vi-VN")} VND
        </p>
      </div>

      {/* Tìm kiếm */}
      <div className="mb-1">
        <input
          type="text"
          placeholder="Tìm kiếm mã giao dịch, khách hàng, dịch vụ..."
          className="shadow-sm p-4 dark:text-black focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="w-full flex flex-col justify-center items-end gap-2 text-sm">
        <span className="text-gray-600">
          Số lượng giao dịch: {paymentHistory.length}
        </span>
        <div className="flex items-center gap-3">
          <p className="flex gap-2">
            <span className=" px-2 bg-red-400"></span> Lỗi giao dịch{" "}
          </p>
          <p className="flex gap-2">
            <span className=" px-2 bg-white outline outline-1 outline-gray-400"></span>{" "}
            Đã giao dịch
          </p>
        </div>
      </div>

      {/* Row 1: Bảng lịch sử thanh toán */}
      <Card className="shadow-md">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            className="text-gray-800 font-medium"
          >
            Thông tin thanh toán
          </Typography>
          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold text-gray-600">
                    Mã giao dịch
                  </TableCell>
                  <TableCell className="font-bold text-gray-600">
                    Khách hàng
                  </TableCell>
                  <TableCell className="font-bold text-gray-600">
                    Dịch vụ
                  </TableCell>
                  <TableCell className="font-bold text-gray-600">
                    Ngày thanh toán
                  </TableCell>
                  <TableCell className="font-bold text-right text-gray-600">
                    Số tiền
                  </TableCell>
                  <TableCell className="font-bold text-gray-600">
                    Ngân hàng
                  </TableCell>
                  <TableCell className="font-bold text-gray-600">
                    Phương thức
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPaymentHistory.map((payment) => (
                  <>
                    {payment.status != "PENDING" ? (
                      <TableRow key={payment.id} className="hover:bg-gray-100 ">
                        <TableCell>{payment.transactionId}</TableCell>
                        <TableCell>
                          {payment.appointment.gustName
                            ? payment.appointment.gustName + " " + payment.id
                            : payment.appointment.userId?.name ||
                              "Khách hàng ẩn danh"}
                        </TableCell>
                        <TableCell>
                          {payment.appointment.serviceIds
                            .map((service) => service.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(payment.paymentDate).toLocaleString(
                            "vi-VN",
                            {
                              weekday: "long", // Hiển thị tên thứ đầy đủ
                              hour: "numeric", // Hiển thị giờ
                              minute: "2-digit", // Hiển thị phút với 2 chữ số
                              second: "2-digit", // Hiển thị giây với 2 chữ số
                              day: "2-digit", // Hiển thị ngày với 2 chữ số
                              month: "2-digit", // Hiển thị tháng với 2 chữ số
                              year: "numeric", // Hiển thị năm đầy đủ
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.amount.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell>{payment.bankCode}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        key={payment.id}
                        className="hover:bg-gray-100  bg-red-200/40"
                      >
                        <TableCell>{payment.transactionId}</TableCell>
                        <TableCell>
                          {payment.appointment.gustName
                            ? payment.appointment.gustName + " " + payment.id
                            : payment.appointment.userId?.name ||
                              "Khách hàng ẩn danh"}
                        </TableCell>
                        <TableCell>
                          {payment.appointment.serviceIds
                            .map((service) => service.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(payment.paymentDate).toLocaleString(
                            "vi-VN",
                            {
                              weekday: "long", // Hiển thị tên thứ đầy đủ
                              hour: "numeric", // Hiển thị giờ
                              minute: "2-digit", // Hiển thị phút với 2 chữ số
                              second: "2-digit", // Hiển thị giây với 2 chữ số
                              day: "2-digit", // Hiển thị ngày với 2 chữ số
                              month: "2-digit", // Hiển thị tháng với 2 chữ số
                              year: "numeric", // Hiển thị năm đầy đủ
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {payment.amount.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell>{payment.bankCode}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                      </TableRow>
                    )}
                  </>
                ))}

                {paginatedPaymentHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Phân trang */}
      {filteredPaymentHistory.length > pageSize && (
        <div className="flex justify-center mt-2">
          <Pagination
            count={Math.ceil(filteredPaymentHistory.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default ServicePaymentHistory;
