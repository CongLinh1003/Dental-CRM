'use client'

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { LoaderCircle, Undo2 } from 'lucide-react';
import { UserAPI, UserMe, UserProfile, AppointmentHistory, Service, Dentist } from '@/services/user';

const ProfilePage: React.FC = () => {
    const [userMe, setUserMe] = useState<UserMe | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [appointments, setAppointments] = useState<AppointmentHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');

    // New states for appointment editing
    const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
    const [appointmentEditData, setAppointmentEditData] = useState<{
        scheduledTime?: string;
        notes?: string;
        serviceId?: number | null;
        dentistId?: number | null;
    } | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [dentists, setDentists] = useState<Dentist[]>([]);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            setError('');
            try {
                const [meRes, profileRes, historyRes] = await Promise.all([
                    UserAPI.getMe(),
                    UserAPI.getProfile(),
                    UserAPI.getAppointmentHistory()
                ]);
                if (!meRes.success || !profileRes.success || !historyRes.success) {
                    setError('Không thể tải dữ liệu người dùng.');
                    setIsLoading(false);
                    return;
                }
                setUserMe(meRes.data);
                setProfile(profileRes.data);
                setFormData(profileRes.data);
                setAppointments(historyRes.data);
            } catch (err) {
                console.error(err);
                setError('Lỗi khi tải dữ liệu người dùng.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Helpers to fetch services and dentists when needed
    const fetchServicesAndDentists = async () => {
        try {
            const [svcRes, dRes] = await Promise.all([UserAPI.getServices(), UserAPI.getDentists()]);
            if (svcRes.success) setServices(svcRes.data);
            if (dRes.success) setDentists(dRes.data);
        } catch (e) {
            console.error('Failed to load services or dentists', e);
        }
    };

    const openAppointmentEditor = async (record: AppointmentHistory) => {
        await fetchServicesAndDentists();
        setEditingAppointmentId(record.id);
        // convert ISO to datetime-local value
        const toLocalInput = (iso?: string) => {
            if (!iso) return '';
            const d = new Date(iso);
            const tzOffset = d.getTimezoneOffset() * 60000; // offset in ms
            const local = new Date(d.getTime() - tzOffset);
            return local.toISOString().slice(0, 16);
        };
        setAppointmentEditData({
            scheduledTime: toLocalInput(record.scheduledTime),
            notes: record.notes || '',
            serviceId: record.service?.id ?? null,
            dentistId: record.dentistId ?? null,
        });
    };

    const closeAppointmentEditor = () => {
        setEditingAppointmentId(null);
        setAppointmentEditData(null);
    };

    const handleAppointmentFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!appointmentEditData) return;
        const { name, value } = e.target;
        setAppointmentEditData({ ...appointmentEditData, [name]: value });
    };

    const saveAppointmentChanges = async (id: number) => {
        if (!appointmentEditData) return;
        setActionLoading(true);
        setError('');
        try {
            // convert datetime-local back to ISO
            const scheduledLocal = appointmentEditData.scheduledTime;
            let scheduledIso: string | undefined = undefined;
            if (scheduledLocal) {
                // scheduledLocal is like '2025-09-15T10:00'
                const localDate = new Date(scheduledLocal);
                scheduledIso = localDate.toISOString();
            }

            const payload: Record<string, unknown> = {};
            if (scheduledIso) payload.scheduledTime = scheduledIso;
            if (appointmentEditData.notes !== undefined) payload.notes = appointmentEditData.notes;
            if (appointmentEditData.serviceId) payload.service = { id: Number(appointmentEditData.serviceId) };
            // dentist is read-only in UI; do not include dentistId in update payload to avoid accidental changes

            const res = await UserAPI.updateAppointment(id, payload);
            if (res.success) {
                // refresh appointment list
                const historyRes = await UserAPI.getAppointmentHistory();
                if (historyRes.success) setAppointments(historyRes.data);
                closeAppointmentEditor();
            } else {
                setError(res.message || 'Cập nhật lịch hẹn thất bại.');
            }
        } catch (err) {
            console.error(err);
            setError('Lỗi khi cập nhật lịch hẹn.');
        } finally {
            setActionLoading(false);
        }
    };

    const cancelAppointment = async (id: number) => {
        if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
        setActionLoading(true);
        setError('');
        try {
            const res = await UserAPI.cancelAppointment(id);
            if (res.success) {
                const historyRes = await UserAPI.getAppointmentHistory();
                if (historyRes.success) setAppointments(historyRes.data);
            } else {
                setError(res.message || 'Hủy lịch hẹn thất bại.');
            }
        } catch (err) {
            console.error(err);
            setError('Lỗi khi hủy lịch hẹn.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!formData) return;
        setIsLoading(true);
        setError('');
        try {
            const res = await UserAPI.updateProfile(formData);
            if (res.success) {
                setProfile(res.data);
                setFormData(res.data);
                setIsEditing(false);
            } else {
                setError(res.message || 'Cập nhật thông tin thất bại.');
            }
        } catch (err) {
            console.error(err);
            setError('Lỗi khi cập nhật thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

    if (error || !userMe || !profile) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-semibold text-red-500">{error || 'Không tìm thấy dữ liệu người dùng.'}</div>
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <motion.button
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.2, width: 48, height: 48 }}
                whileTap={{ scale: 0.98 }}
                className='h-10 w-10 mb-4 bg-gray-300 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors duration-200'>
                <Undo2 className=" text-gray-600 hover:text-white cursor-pointer" size={24} />
            </motion.button>
            <motion.div
                className="max-w-4xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Thông tin cá nhân */}
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
                            src={profile.avatarUrl || userMe.avatarUrl || '/images/default-avatar.jpg'}
                            alt="Ảnh đại diện"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="rounded-full border-4 border-blue-400 shadow-md"
                        />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input type="text" name="address" value={formData?.address || ''} onChange={handleInputChange}
                                    className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200" placeholder="Địa chỉ" />
                                <input type="text" name="phone" value={formData?.phone || ''} onChange={handleInputChange}
                                    className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200" placeholder="Số điện thoại" />
                                <input type="date" name="birthDate" value={formData?.birthDate || ''} onChange={handleInputChange}
                                    className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200" placeholder="Ngày sinh" />
                                <select name="gender" value={formData?.gender || ''} onChange={handleSelectChange}
                                    className="text-md sm:text-lg text-gray-600 border-b border-gray-300 w-full p-2 focus:outline-none focus:border-blue-500 transition-colors duration-200">
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center md:justify-start">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-600">
                                        {/* Show full name if available, else username */}
                                        {userMe.fullName || userMe.username || 'Chưa cập nhật tên'}
                                    </h2>
                                </div>
                                <p className="text-md sm:text-lg text-gray-600 mt-2">
                                    <span className="font-semibold text-gray-500">Email:</span> {userMe.email || 'Chưa cập nhật email'}
                                </p>
                                <p className="text-md sm:text-lg text-gray-600">
                                    <span className="font-semibold text-gray-500">Số điện thoại:</span> {profile.phone || userMe.phone || 'Chưa cập nhật số điện thoại'}
                                </p>
                                <p className="text-md sm:text-lg text-gray-600">
                                    <span className="font-semibold text-gray-500">Địa chỉ:</span> {profile.address || userMe.address || 'Chưa cập nhật địa chỉ'}
                                </p>
                                <p className="text-md sm:text-lg text-gray-600">
                                    <span className="font-semibold text-gray-500">Ngày sinh:</span> {profile.birthDate || userMe.birthDate || 'Chưa cập nhật ngày sinh'}
                                </p>
                                <p className="text-md sm:text-lg text-gray-600">
                                    <span className="font-semibold text-gray-500">Giới tính:</span> {profile.gender || userMe.gender || 'Chưa cập nhật giới tính'}
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Thông tin bổ sung */}
                <motion.div
                    className="bg-purple-100 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b-2 pb-2 border-gray-200">
                        Thông Tin Bổ Sung
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="font-semibold text-gray-500">Ngày tạo tài khoản</p>
                            <p className="md:text-lg text-sm text-white font-extrabold p-2 px-4 bg-purple-400 rounded-full">{userMe.createdAt ? new Date(userMe.createdAt).toLocaleDateString('vi-VN') : '-'}</p>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="font-semibold text-gray-500">Lần cập nhật gần nhất</p>
                            <p className="md:text-lg text-sm text-white font-extrabold p-2 px-4 bg-purple-400 rounded-full">{userMe.updatedAt ? new Date(userMe.updatedAt).toLocaleDateString('vi-VN') : '-'}</p>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="font-semibold text-gray-500">Vai trò</p>
                            <p className="md:text-lg text-sm text-white font-extrabold p-2 px-4 bg-purple-400 rounded-full">{userMe.role || '-'}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Lịch sử điều trị / lịch sử đặt hẹn */}
                <motion.div
                    className="bg-purple-100 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b-2 pb-2 border-gray-200">
                        Lịch Sử Đặt Hẹn
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Ngày hẹn</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lễ tân</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-4 text-gray-500">Không có lịch sử đặt hẹn.</td></tr>
                                ) : appointments.map((record) => (
                                    <React.Fragment key={record.id}>
                                        <motion.tr
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                            variants={tableRowVariants}
                                            whileHover="hover"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {new Date(record.scheduledTime).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {record.status}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {record.notes}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {record.dentistUsername}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {record.receptionistUsername}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openAppointmentEditor(record)} className="px-3 py-1 bg-blue-500 text-white rounded">Chỉnh sửa</button>
                                                    <button onClick={() => cancelAppointment(record.id)} className="px-3 py-1 bg-red-500 text-white rounded">Hủy</button>
                                                </div>
                                            </td>
                                        </motion.tr>

                                        {editingAppointmentId === record.id && appointmentEditData && (
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3" colSpan={6}>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                                                        <div>
                                                            <label className="text-sm text-gray-600">Ngày & giờ</label>
                                                            <input name="scheduledTime" type="datetime-local" value={appointmentEditData.scheduledTime || ''} onChange={handleAppointmentFieldChange}
                                                                className="w-full border rounded p-2" />
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-600">Dịch vụ</label>
                                                            <select name="serviceId" value={appointmentEditData.serviceId ?? ''} onChange={handleAppointmentFieldChange}
                                                                className="w-full border rounded p-2">
                                                                <option value="">(Giữ nguyên)</option>
                                                                {services.map(s => (
                                                                    <option key={s.id} value={s.id}>{s.name} - {s.price}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-600">Nha sĩ</label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    (appointmentEditData?.dentistId != null && dentists.find(d => d.id === Number(appointmentEditData.dentistId))?.name) || record.dentistUsername || ''
                                                                }
                                                                disabled
                                                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-600">Ghi chú</label>
                                                            <input name="notes" type="text" value={appointmentEditData.notes || ''} onChange={handleAppointmentFieldChange}
                                                                className="w-full border rounded p-2" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex gap-2 justify-end">
                                                        <button onClick={() => saveAppointmentChanges(record.id)} disabled={actionLoading} className="px-4 py-2 bg-green-500 text-white rounded">{actionLoading ? 'Đang lưu...' : 'Lưu'}</button>
                                                        <button onClick={closeAppointmentEditor} disabled={actionLoading} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
