'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState('consultation'); // State mới để quản lý tab
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Thông tin từ tab "${activeTab}":`, {
            name,
            email,
            phone,
            date,
            time,
            notes,
        });
        // Thêm logic gọi API tại đây
        onClose();
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { y: '-100vh', opacity: 0 },
        visible: { y: '0', opacity: 1, transition: { duration: 0.5, damping: 25, stiffness: 500 } },
        exit: { y: '100vh', opacity: 0 },
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={onClose}
            >
                <motion.div
                    className="bg-white p-8 rounded-3xl shadow-xl w-full md:max-w-4xl max-w-lg mx-auto relative"
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>


                    {/* Header Tab */}
                    <div className="flex justify-center mb-6 border-b border-gray-200">
                        <button
                            className={`py-2 px-4 font-semibold w-full relative ${activeTab === 'consultation'
                                ? 'text-white bg-purple-500 rounded-md'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('consultation')}
                        >
                            Tư vấn
                            {activeTab === 'consultation' && (
                                <motion.div
                                    className="absolute bottom-[-2px] left-0 right-0 h-1 bg-purple-600 rounded-t-lg"
                                    layoutId="underline"
                                />
                            )}
                        </button>
                        <button
                            className={`py-2 px-4 font-semibold w-full relative ${activeTab === 'appointment'
                                ? 'text-white bg-purple-500 rounded-md'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('appointment')}
                        >
                            Đặt lịch hẹn
                            {activeTab === 'appointment' && (
                                <motion.div
                                    className="absolute bottom-[-2px] left-0 right-0 h-1 bg-purple-600 rounded-t-lg"
                                    layoutId="underline"
                                />
                            )}
                        </button>
                    </div>

                    {/* Nội dung Form */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'consultation' && (
                            <motion.form
                                key="consultation"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 overflow-y-auto h-[650px] scrollbar-hide overflow-x-hidden"
                            >
                                <div className="flex items-center gap-1">
                                    <motion.img src="/IMGLADING/Camtudental-doctor-holding-phone-to-support-customers-797x1024.png" alt="Image"
                                        className='w-20 h-40 object-cover'
                                    />
                                    <h1 className='md:text-5xl text-5xl roboto-900 bg-clip-text bg-gradient-to-bl from-purple-600 via-yellow-400 to-purple-600 text-transparent mb-4'>Tư vấn dịch vụ nha khoa</h1>
                                </div>

                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="mt-5 md:w-full">
                                        <label className="block text-purple-700">Họ và tên</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full mt-1 p-3 border-b border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="mt-5 md:w-full">
                                        <label className="block text-purple-700">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full mt-1 p-3 border-b border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 md:flex md:items-center md:justify-between md:gap-10">

                                    <div className="mt-5 md:w-full">
                                        <label className="block text-purple-700">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full mt-1 p-3 border-b border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="md:w-full mt-5">
                                        <h3 className="text-purple-700 mb-4">Phương thức tư vấn</h3>
                                        <div className="w-full flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={"Zalo"} placeholder='Zalo' />
                                                <label className="block text-yellow-500">Zalo</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={"Zalo"} placeholder='Zalo' />
                                                <label className="block text-yellow-500">Hotline</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={"Zalo"} placeholder='Zalo' />
                                                <label className="block text-yellow-500">Email</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={"Zalo"} placeholder='Zalo' />
                                                <label className="block text-yellow-500">Phone</label>
                                            </div>

                                        </div>

                                    </div>
                                </div>


                                <div className="mt-5">
                                    <label className="block text-purple-700">Nội dung tư vấn</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        className="w-full mt-1 p-3 border border-yellow-400 rounded-2xl focus:outline-none "
                                    ></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-purple-700"
                                >
                                    Gửi yêu cầu tư vấn
                                </motion.button>
                            </motion.form>
                        )}

                        {activeTab === 'appointment' && (
                            <motion.form
                                key="appointment"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 overflow-y-auto h-[650px] scrollbar-hide overflow-x-hidden"
                            >
                                <div className="flex items-center gap-1">
                                    <motion.img src="/IMGLADING/Camtudental-doctor-holding-phone-to-support-customers-797x1024.png" alt="Image"
                                        className='w-20 h-40 object-cover'
                                    />
                                    <h1 className='md:text-5xl text-5xl roboto-900 bg-clip-text bg-gradient-to-bl from-purple-600 via-yellow-400 to-purple-600 text-transparent mb-4'>
                                        Vui lòng điền thông tin đặt hẹn
                                    </h1>
                                </div>

                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="md:w-full">
                                        <label className="block text-purple-700">Họ và tên</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:w-full">
                                        <label className="block text-purple-700">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="md:w-full">
                                        <label className="block text-purple-700">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="md:w-full">
                                        <h3 className="text-purple-700 mb-4">Phương thức tư vấn</h3>
                                        <div className="w-full flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="rangsu" id="rangsu" className="text-purple-600" value={""} />
                                                <label className="block text-yellow-500">Răng Sứ</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={""} />
                                                <label className="block text-yellow-500">Implant</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={""} />
                                                <label className="block text-yellow-500">Tổng quát/Vệ sinh răng</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={""} />
                                                <label className="block text-yellow-500">Tẩy trắng</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" name="zalo" id="zalo" className="text-purple-600" value={""} />
                                                <label className="block text-yellow-500">Khác</label>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-purple-700">Ngày</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-purple-700">Giờ</label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full mt-10 bg-purple-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-purple-700"
                                >
                                    Gửi yêu cầu hẹn
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AppointmentModal;