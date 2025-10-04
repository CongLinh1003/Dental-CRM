import {
  CalendarIcon,
  Check,
  ChevronLeft,
  CreditCardIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  ShieldAlert,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditionsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-4">
      <div className="w-full p-5">
        <span
          onClick={handleGoBack}
          className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-300"
        >
          <ChevronLeft />
        </span>
      </div>
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            <ShieldCheckIcon className="h-8 w-8 inline-block mr-2 align-middle" />
            Chính sách và Điều khoản Nha Khoa
          </h1>

          {/* Đặt lịch khám */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Chính sách đặt lịch khám
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>
                Đặt lịch qua website, ứng dụng di động, điện thoại hoặc trực
                tiếp tại phòng khám.
              </li>
              <li>
                Vui lòng cung cấp thông tin cá nhân và tình trạng răng miệng
                chính xác để được tư vấn phù hợp.
              </li>
              <li>
                Có thể đặt lịch trước tối thiểu 30 phút và tối đa 30 ngày.
              </li>
              <li>Xác nhận lịch khám sẽ được gửi qua email hoặc SMS.</li>
            </ul>
          </section>

          {/* Hủy lịch */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2" />
              Chính sách hủy / đổi lịch
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="mb-2">Nếu cần thay đổi kế hoạch, vui lòng lưu ý:</p>
              <ul className="list-disc pl-6">
                <li>Miễn phí hủy hoặc đổi lịch trước 12 giờ so với giờ hẹn.</li>
                <li>
                  Hủy trong vòng 12 giờ áp dụng phí 30% giá trị dịch vụ đã đặt.
                </li>
                <li>
                  Không đến (no-show) sẽ tính 100% giá trị dịch vụ dự kiến.
                </li>
              </ul>
              <p className="mt-2">
                Liên hệ sớm qua điện thoại hoặc email để được hỗ trợ hủy / đổi
                lịch.
              </p>
            </div>
          </section>

          {/* Thanh toán */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <CreditCardIcon className="h-6 w-6 mr-2" />
              Chính sách thanh toán
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chấp nhận: tiền mặt, thẻ (Visa, Mastercard, v.v.), chuyển khoản,
              ví điện tử (nếu hỗ trợ). Thanh toán sau khi hoàn thành dịch vụ
              hoặc theo từng giai đoạn (ví dụ: trồng Implant, niềng răng) theo
              thỏa thuận. Hóa đơn điện tử / giấy cung cấp theo yêu cầu và tuân
              thủ quy định thuế.
            </p>
          </section>

          {/* Bảo mật */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Chính sách bảo mật thông tin
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Hồ sơ bệnh án, kết quả chẩn đoán hình ảnh (X-quang, CT Cone Beam),
              và thông tin cá nhân của bạn được bảo mật và chỉ sử dụng để chẩn
              đoán, điều trị và chăm sóc khách hàng. Không cung cấp cho bên thứ
              ba trừ khi có yêu cầu pháp lý hoặc bạn đồng ý bằng văn bản. Dữ
              liệu trên hệ thống được mã hóa an toàn.
            </p>
          </section>

          {/* Quyền & nghĩa vụ khách hàng */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của khách hàng
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">
                Quyền của bạn:
              </h3>
              <ul className="list-disc pl-6 mb-3">
                <li>
                  Được tư vấn rõ ràng về tình trạng răng miệng và lựa chọn điều
                  trị.
                </li>
                <li>
                  Được cung cấp phác đồ điều trị và chi phí dự kiến minh bạch.
                </li>
                <li>Có quyền yêu cầu giải thích thêm hoặc từ chối dịch vụ.</li>
                <li>Được bảo mật thông tin cá nhân và hồ sơ bệnh án.</li>
                <li>
                  Được phản hồi / khiếu nại nếu không hài lòng về dịch vụ.
                </li>
              </ul>
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">
                Nghĩa vụ của bạn:
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Cung cấp trung thực thông tin sức khỏe tổng quát, tiền sử dị
                  ứng, bệnh lý.
                </li>
                <li>Tuân thủ hướng dẫn điều trị, tái khám đúng lịch.</li>
                <li>Thanh toán đầy đủ, đúng hạn theo thỏa thuận.</li>
                <li>
                  Giữ gìn vệ sinh răng miệng và tuân thủ chăm sóc sau điều trị.
                </li>
              </ul>
            </div>
          </section>

          {/* Quyền & nghĩa vụ phòng khám */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <HomeIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của phòng khám
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">
                Quyền của chúng tôi:
              </h3>
              <ul className="list-disc pl-6 mb-3">
                <li>
                  Từ chối điều trị khi bệnh nhân có hành vi không phù hợp hoặc
                  chống chỉ định y khoa.
                </li>
                <li>
                  Điều chỉnh lịch khám khi phát sinh sự cố (bác sĩ phẫu thuật,
                  thiết bị bảo trì) và thông báo sớm.
                </li>
                <li>
                  Yêu cầu thanh toán theo bảng giá và chính sách hiện hành.
                </li>
              </ul>
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">
                Nghĩa vụ của chúng tôi:
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Cung cấp dịch vụ điều trị nha khoa an toàn, hiệu quả, tuân thủ
                  quy định Bộ Y tế.
                </li>
                <li>Đảm bảo vô trùng dụng cụ, trang thiết bị đạt chuẩn.</li>
                <li>
                  Giải thích rõ ràng quy trình, rủi ro và hướng dẫn chăm sóc hậu
                  điều trị.
                </li>
                <li>
                  Tiếp nhận và xử lý phản hồi của bệnh nhân nhanh chóng, công
                  bằng.
                </li>
              </ul>
            </div>
          </section>

          {/* Cập nhật chính sách */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2" />
              Thay đổi và cập nhật
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chính sách có thể được điều chỉnh để phù hợp quy định pháp luật và
              hoạt động chuyên môn. Thông báo sẽ đăng trên website hoặc gửi
              email nếu bạn đăng ký nhận tin. Việc tiếp tục sử dụng dịch vụ đồng
              nghĩa bạn chấp thuận nội dung cập nhật.
            </p>
          </section>

          {/* Liên hệ */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <Check className="h-6 w-6 mr-2" />
              Liên hệ
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Mọi thắc mắc liên quan đến chính sách / điều khoản, vui lòng liên
              hệ:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                Điện thoại: <span className="font-semibold">0987 654 321</span>
              </p>
              <p className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 text-blue-500" />
                Email:{" "}
                <span className="font-semibold">
                  {" "}
                  contact.nhakhoa@example.com
                </span>
              </p>
              <p className="flex items-center sm:col-span-2">
                <HomeIcon className="h-5 w-5 mr-2 text-blue-500" />
                Địa chỉ:{" "}
                <span className="font-semibold">
                  456 Đường Sức Khỏe Răng Miệng, Quận Trung Tâm, TP. DentalCare
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
