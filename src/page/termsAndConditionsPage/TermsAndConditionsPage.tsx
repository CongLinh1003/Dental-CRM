import { CalendarIcon, Check, ChevronLeft, CreditCardIcon, HomeIcon, MailIcon, PhoneIcon, ShieldAlert, ShieldCheckIcon, UserIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditionsPage: React.FC = () => {

const navigate = useNavigate();

const handleGoBack = () => {
    navigate(-1);
};

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-4">
     <div className="w-full p-5">
        <span onClick={handleGoBack} className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-300">
            <ChevronLeft/>
        </span>
     </div>
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            <ShieldCheckIcon className="h-8 w-8 inline-block mr-2 align-middle" />
            Chính sách và Điều khoản
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Chính sách đặt lịch khám
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>Đặt lịch khám dễ dàng qua website, ứng dụng di động, điện thoại hoặc trực tiếp tại phòng khám nha khoa.</li>
              <li>Vui lòng cung cấp thông tin cá nhân chính xác, tình trạng sức khỏe răng miệng và lựa chọn dịch vụ nha khoa mong muốn.</li>
              <li>Thời gian đặt lịch linh hoạt, tối thiểu trước 2 giờ và tối đa 60 ngày cho các dịch vụ thường, 3 tháng cho các ca phẫu thuật.</li>
              <li>Xác nhận đặt lịch sẽ được gửi nhanh chóng qua email hoặc tin nhắn SMS kèm hướng dẫn chuẩn bị trước khám.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2" />
              Chính sách hủy lịch khám
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="mb-2">Chúng tôi hiểu rằng đôi khi bạn cần thay đổi lịch khám. Vui lòng lưu ý:</p>
              <ul className="list-disc pl-6">
                <li>Hủy lịch khám miễn phí trước 24 tiếng so với giờ hẹn đối với khám tổng quát.</li>
                <li>Hủy lịch khám trước 48 tiếng đối với các ca phẫu thuật, cấy ghép implant.</li>
                <li>Hủy lịch trong thời gian quy định sẽ áp dụng phí hủy 50% giá trị dịch vụ.</li>
                <li>Bệnh nhân không đến khám (no-show) sẽ bị tính phí 100% giá trị dịch vụ đã đặt.</li>
              </ul>
              <p className="mt-2">Để hủy lịch khám, vui lòng liên hệ với chúng tôi qua điện thoại hoặc email càng sớm càng tốt.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <CreditCardIcon className="h-6 w-6 mr-2" />
              Chính sách thanh toán
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chúng tôi chấp nhận đa dạng hình thức thanh toán để thuận tiện cho bệnh nhân: tiền mặt, các loại thẻ tín dụng (Visa, Mastercard, American Express), chuyển khoản ngân hàng và thanh toán qua ví điện tử. Thanh toán có thể thực hiện trước hoặc sau khi điều trị theo thỏa thuận. Đối với các liệu trình dài hạn, chúng tôi hỗ trợ thanh toán theo đợt. Hóa đơn điện tử hoặc hóa đơn giấy sẽ được cung cấp ngay sau khi thanh toán.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Chính sách bảo mật thông tin y tế
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Sự riêng tư và bảo mật thông tin y tế của bạn là ưu tiên hàng đầu. Mọi thông tin cá nhân và hồ sơ bệnh án được bảo mật tuyệt đối theo quy định pháp luật về khám chữa bệnh. Thông tin chỉ được sử dụng cho mục đích điều trị, theo dõi sức khỏe răng miệng và liên lạc y tế cần thiết. Chúng tôi cam kết không tiết lộ thông tin cho bên thứ ba ngoại trừ các trường hợp quy định pháp luật. Dữ liệu thanh toán và thông tin cá nhân được mã hóa và bảo vệ an toàn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của bệnh nhân
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Quyền của bệnh nhân:</h3>
              <ul className="list-disc pl-6 mb-3">
                <li>Được khám và điều trị răng miệng chất lượng cao, an toàn theo tiêu chuẩn y tế.</li>
                <li>Được tư vấn đầy đủ về tình trạng răng miệng và các phương án điều trị phù hợp.</li>
                <li>Được biết rõ chi phí điều trị trước khi thực hiện và có quyền lựa chọn phương án điều trị.</li>
                <li>Được bảo mật thông tin cá nhân và hồ sơ bệnh án theo quy định pháp luật.</li>
                <li>Được khiếu nại và phản hồi về chất lượng dịch vụ nếu có bất kỳ vấn đề gì.</li>
              </ul>
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Nghĩa vụ của bệnh nhân:</h3>
              <ul className="list-disc pl-6">
                <li>Cung cấp thông tin sức khỏe tổng quát và tình trạng răng miệng đầy đủ, chính xác.</li>
                <li>Tuân thủ lịch hẹn và thông báo trước nếu có thay đổi theo quy định.</li>
                <li>Thanh toán đầy đủ và đúng hạn các chi phí điều trị theo thỏa thuận.</li>
                <li>Tuân thủ hướng dẫn chăm sóc răng miệng sau điều trị của bác sĩ.</li>
                <li>Thông báo ngay với bác sĩ nếu có biến chứng bất thường sau điều trị.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <HomeIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của spa
            </h2>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <HomeIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của phòng khám nha khoa
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Quyền của phòng khám:</h3>
              <ul className="list-disc pl-6 mb-3">
                <li>Từ chối điều trị cho bệnh nhân có hành vi không phù hợp hoặc không tuân thủ hướng dẫn y tế.</li>
                <li>Yêu cầu bệnh nhân thanh toán theo đúng bảng giá và chính sách đã thông báo.</li>
                <li>Điều chỉnh lịch hẹn trong trường hợp khẩn cấp y tế và thông báo trước cho bệnh nhân.</li>
                <li>Yêu cầu xét nghiệm bổ sung hoặc chuyển tuyến khi cần thiết cho quá trình điều trị.</li>
              </ul>
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Nghĩa vụ của phòng khám:</h3>
              <ul className="list-disc pl-6">
                <li>Cung cấp dịch vụ khám và điều trị răng miệng chuyên nghiệp, an toàn theo tiêu chuẩn y tế.</li>
                <li>Đảm bảo vệ sinh và khử trùng thiết bị y tế, môi trường khám chữa bệnh sạch sẽ.</li>
                <li>Tư vấn đầy đủ, rõ ràng về tình trạng bệnh và các phương án điều trị.</li>
                <li>Giải quyết mọi thắc mắc và khiếu nại của bệnh nhân một cách công bằng và nhanh chóng.</li>
                <li>Bảo mật thông tin cá nhân và hồ sơ bệnh án theo quy định pháp luật.</li>
              </ul>
            </div>
          </section>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2" />
              Thay đổi và cập nhật
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Phòng khám có quyền cập nhật và điều chỉnh các chính sách và điều khoản này theo thời gian để phù hợp với quy định pháp luật về hành nghề khám chữa bệnh và tình hình hoạt động thực tế. Mọi thay đổi sẽ được thông báo trên website, tại phòng khám và/hoặc qua email (nếu bệnh nhân đã đăng ký nhận thông tin). Việc tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực đồng nghĩa với việc bệnh nhân chấp nhận các điều khoản đã được cập nhật.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <Check className="h-6 w-6 mr-2" />
              Liên hệ
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc cần hỗ trợ liên quan đến chính sách và điều khoản này hoặc về tình trạng sức khỏe răng miệng, xin vui lòng liên hệ với chúng tôi theo thông tin sau:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                Điện thoại: <span className="font-semibold">0987654321</span>
              </p>
              <p className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 text-blue-500" />
                Email: <span className="font-semibold"> contact.jaloo.1@gmail.com</span>
              </p>
              <p className="flex items-center sm:col-span-2">
                <HomeIcon className="h-5 w-5 mr-2 text-blue-500" />
                Địa chỉ: <span className="font-semibold">123 Đường Nha Khoa, Quận Y Tế, Thành phố Sức Khỏe</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;