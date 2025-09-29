'use client'

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { LoaderCircle, Undo2 } from 'lucide-react';

// Giao diện cho dữ liệu người dùng
interface UserData {
    name: string;
    email: string;
    phone: string;
    address: string;
    loyaltyStatus: 'Kim Cương' | 'Thân Thiết' | 'Mới';
    avatarUrl: string;
    joinedDate: string;
    lastVisit: string;
    nextAppointment: string;
    dentalHistory: {
        date: string;
        service: string;
        doctor: string;
        price: number;
    }[];
}

const mockUserData: UserData = {
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    phone: "+84 912 345 678",
    address: "Số 123, Đường ABC, Quận XYZ, TP.HCM",
    loyaltyStatus: "Kim Cương",
    avatarUrl: "/penguin.png", // Dùng ảnh mẫu
    joinedDate: "01/03/2023",
    lastVisit: "05/06/2024",
    nextAppointment: "12/07/2024",
    dentalHistory: [
        { date: "15/05/2023", service: "Lấy cao răng", doctor: "BS. Trần Thanh Tùng", price: 500000 },
        { date: "22/07/2023", service: "Trám răng sâu", doctor: "BS. Nguyễn Thúy Vân", price: 1200000 },
        { date: "10/01/2024", service: "Tẩy trắng răng", doctor: "BS. Trần Thanh Tùng", price: 3000000 },
        { date: "05/06/2024", service: "Nhổ răng khôn", doctor: "BS. Lê Hữu Nghĩa", price: 2500000 },
    ],
};

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserData | null>(null);

    useEffect(() => {
        // Mô phỏng việc tải dữ liệu từ API
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                // Giả lập độ trễ mạng
                await new Promise(resolve => setTimeout(resolve, 1500));
                setUserData(mockUserData);
                setFormData(mockUserData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Mô phỏng việc lưu dữ liệu
        setUserData(formData);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <LoaderCircle className="animate-spin text-blue-500" size={68} />
            </div>
        );
    }

    if (!userData || !formData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-semibold text-red-500">Không tìm thấy dữ liệu người dùng.</div>
            </div>
        );
    }

    // Variants cho các animation
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        hover: { scale: 1.02, backgroundColor: "rgba(249, 250, 251, 1)" },
    };

    // Tùy chỉnh màu sắc và nội dung của tag dựa trên trạng thái
    const getLoyaltyTag = (status: UserData['loyaltyStatus']) => {
        switch (status) {
            case 'Kim Cương':
                return <span className="ml-2 text-sm font-bold text-white bg-blue-500 px-2 py-1 rounded-full">{status}</span>;
            case 'Thân Thiết':
                return <span className="ml-2 text-sm font-bold text-white bg-green-500 px-2 py-1 rounded-full">{status}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.2, width: 48, height: 48 }}
            whileTap={{ scale: 0.98 }}
            className='h-10 w-10 mb-4 bg-gray-300 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors duration-200'>
                <Undo2 className=" text-gray-600 hover:text-white cursor-pointer" size={24} onClick={() => window.history.back()} />
            </motion.button>
            <motion.div
                className="max-w-4xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Phần thông tin cá nhân */}
                <motion.div
                    className="bg-purple-300 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative"
                    variants={itemVariants}
                >
                    <div className="absolute top-4 right-4">
                        {isEditing ? (
                            <button onClick={handleSave} className="bg-purple-400 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-colors duration-200">
                                Lưu
                            </button>
                        ) : (
                            <button onClick={handleEdit} className="bg-purple-400 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-colors duration-200">
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                    <div className="relative w-32 h-32 flex-shrink-0 flex flex-col gap-2 items-center justify-center">
                        <motion.img
                            src={userData.avatarUrl}
                            alt="Ảnh đại diện"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="rounded-full border-4 border-blue-400 shadow-md"
                        /> 
                        {getLoyaltyTag(userData.loyaltyStatus)}
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        {isEditing ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center md:justify-start">
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} 
                                    className="text-2xl sm:text-3xl font-bold text-gray-600 border-b border-gray-300 w-full
                                    p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200
                                    " />

                                </div>
                                <input type="text" name="email" value={formData.email} onChange={handleChange} 
                                className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full
                                p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200
                                " />
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                                className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full
                                p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200
                                " />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} 
                                className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full
                                p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200
                                " />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center md:justify-start">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-600">
                                        {userData.name}
                                    </h2>

                                </div>
                                <p className="text-md sm:text-lg text-gray-600 mt-2">
                                    <span className="font-semibold text-gray-500">Email:</span> {userData.email}
                                </p>
                                <p className="text-md sm:text-lg text-gray-600">
                                    <span className="font-semibold text-gray-500">Số điện thoại:</span> {userData.phone}
                                </p>
                                <p className="text-md sm:text-lg text-gray-600">
                                    <span className="font-semibold text-gray-500">Địa chỉ:</span> {userData.address}
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Phần thông tin bổ sung */}
                <motion.div
                    className="bg-purple-100 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b-2 pb-2 border-gray-200">
                        Thông Tin Bổ Sung
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                        <div>
                            <p className="font-semibold text-gray-500">Ngày tham gia</p>
                            <p className="text-lg text-gray-800">{userData.joinedDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-500">Lần khám gần nhất</p>
                            <p className="text-lg text-gray-800">{userData.lastVisit}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-500">Lịch hẹn tiếp theo</p>
                            <p className="text-lg text-gray-800">{userData.nextAppointment}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Phần lịch sử điều trị */}
                <motion.div
                    className="bg-purple-100 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b-2 pb-2 border-gray-200">
                        Lịch Sử Điều Trị
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                                        Ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dịch vụ
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bác sĩ
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                                        Chi phí (VNĐ)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userData.dentalHistory.map((record, index) => (
                                    <motion.tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                        variants={tableRowVariants}
                                        whileHover="hover"
                                    >
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {record.date}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {record.service}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {record.doctor}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.price.toLocaleString('vi-VN')}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
