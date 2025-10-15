'use client'

import React, { useState } from "react";
import { DentistAPI } from "../../services/dentist";
import { AnimatePresence, motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Định nghĩa giao diện cho dữ liệu form (sử dụng TypeScript tốt hơn nhưng giữ lại JS cho môi trường React)
interface StaffData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    bio: string;
}

// Định nghĩa giao diện cho trạng thái lỗi
interface FormErrors {
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
}

const AddStaffForm: React.FC = () => {

    // Regex Validation Patterns
    const regexPatterns = {
        uid: /^\d{1,8}$/, 
        name: /^[a-zA-Z\s\p{L}]+$/u, 
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        phone: /^\d{9,15}$/,
    };

    // State để giữ dữ liệu form
    const [formData, setFormData] = useState<StaffData>({
        uid: '',
        name: '',
        email: '',
        phone: '',
        specialization: '',
        bio: '',
    });

    // State để giữ lỗi validation
    const [errors, setErrors] = useState<FormErrors>({});
    // Xóa biến isSubmitted không dùng
    // Xóa state thông báo, dùng toast thay thế

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Xóa lỗi ngay khi người dùng bắt đầu nhập lại
        if (errors[id as keyof FormErrors]) {
            setErrors({ ...errors, [id]: undefined });
        }
    };

    // Hàm validation
    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        // UID Validation
        if (!formData.uid) {
            newErrors.uid = 'UID không được để trống.';
        } else if (!regexPatterns.uid.test(formData.uid)) {
            newErrors.uid = 'UID phải là 4-8 chữ số.';
        }

        // Name Validation
        if (!formData.name) {
            newErrors.name = 'Tên không được để trống.';
        } else if (!regexPatterns.name.test(formData.name)) {
            newErrors.name = 'Tên không hợp lệ (chỉ chứa chữ cái và khoảng trắng).';
        }

        // Email Validation
        if (!formData.email) {
            newErrors.email = 'Email không được để trống.';
        } else if (!regexPatterns.email.test(formData.email)) {
            newErrors.email = 'Email không đúng định dạng.';
        }

        // Phone Validation
        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại không được để trống.';
        } else if (!regexPatterns.phone.test(formData.phone)) {
            newErrors.phone = 'SĐT phải là 9-15 chữ số.';
        }

        return newErrors;
    };

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const payload = {
                name: formData.name,
                userId: Number(formData.uid),
                specialization: formData.specialization,
                email: formData.email,
                phone: formData.phone,
                active: true,
                bio: formData.bio
            };
            try {
                const res = await DentistAPI.addDentist(payload);
                if (res.success) {
                    toast.success('Thêm nhân viên thành công!', { position: 'top-right' });
                    setFormData({
                        uid: '',
                        name: '',
                        email: '',
                        phone: '',
                        specialization: '',
                        bio: '',
                    });
                } else {
                    if (res.message === `User not found: ${formData.uid}`) {
                        toast.error("UID không tồn tại trong hệ thống!", { position: 'top-right' });
                    } else if (res.message === "Access Denied") {
                        toast.error("Bạn không có quyền thực hiện hành động này!", { position: 'top-right' });
                    } else {
                        toast.error(res.message || 'Thêm nhân viên thất bại!', { position: 'top-right' });
                    }
                }
            } catch {
                toast.error('Lỗi hệ thống hoặc mạng!', { position: 'top-right' });
            }
        }
    };

    // Giữ lại ErrorMessage cho validation dưới input
    const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
        <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1 font-medium"
        >
            {message}
        </motion.p>
    );

    return (
        <div className="min-h-screen bg-white p-4 rounded-xl">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="flex md:flex-row flex-col items-center p-4 md:pb-4 pb-40 overflow-auto bg-white rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-4">
                        <img src="/id-card.png" alt="id card" className="w-40 h-30 mx-auto rounded-lg" />
                        <p className="text-gray-600 text-center mt-4 text-lg font-medium">Vui lòng nhập thông tin nhân viên</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full md:mt-0 mt-4 px-4">
                        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl space-y-4">
                            
                            {/* UID */}
                            <div className="flex flex-col">
                                <label htmlFor="uid" className="font-medium text-gray-700">UID <span className="text-red-500">*</span></label>
                                <input
                                    id="uid"
                                    type="text"
                                    value={formData.uid}
                                    onChange={handleChange}
                                    placeholder="19082"
                                    className={`p-3 border ${errors.uid ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-colors`}
                                />
                                <AnimatePresence>{errors.uid && <ErrorMessage message={errors.uid} />}</AnimatePresence>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col">
                                <label htmlFor="name" className="font-medium text-gray-700">Tên <span className="text-red-500">*</span></label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nguyen Van A"
                                    className={`p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                                />
                                <AnimatePresence>{errors.name && <ErrorMessage message={errors.name} />}</AnimatePresence>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label htmlFor="email" className="font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john.hessin.clarke@example.com"
                                    className={`p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                                />
                                <AnimatePresence>{errors.email && <ErrorMessage message={errors.email} />}</AnimatePresence>
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col">
                                <label htmlFor="phone" className="font-medium text-gray-700">Điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0123456789"
                                    className={`p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                                />
                                <AnimatePresence>{errors.phone && <ErrorMessage message={errors.phone} />}</AnimatePresence>
                            </div>

                            {/* Specialization */}
                            <div className="flex flex-col">
                                <label htmlFor="specialization" className="font-medium text-gray-700">Chuyên môn</label>
                                <select
                                    id="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-xl text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    <option value="">-- Chọn Chuyên môn --</option>
                                    <option value="dentist">Nha sĩ</option>
                                    <option value="hygienist">Chuyên gia vệ sinh răng miệng</option>
                                    <option value="assistant">Trợ lý</option>
                                    <option value="receptionist">Lễ tân</option>
                                </select>
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col">
                                <label htmlFor="bio" className="font-medium text-gray-700">Tiểu sử (Bio)</label>
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tiểu sử ngắn gọn về nhân viên"
                                    className="p-3 border border-gray-300 rounded-xl text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    rows={4}
                                ></textarea>
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg mt-4"
                            >
                                Xác nhận thêm
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default AddStaffForm;
