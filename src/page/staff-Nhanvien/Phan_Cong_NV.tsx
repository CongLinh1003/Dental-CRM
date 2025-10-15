import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

interface Staff {
  id: number;
  name: string;
  specialty: string;
  active: boolean;
}

interface Service {
  id: number;
  name: string;
  duration: number; // phút
}

interface Assignment {
  id: number;
  staffId: number;
  serviceId: number;
  date: string; // ISO date
}

const mockStaff: Staff[] = [
  { id: 1, name: 'BS Nguyễn Văn A', specialty: 'Nha chu', active: true },
  { id: 2, name: 'BS Trần Thị B', specialty: 'Niềng răng', active: true },
  { id: 3, name: 'BS Lê Văn C', specialty: 'Cấy ghép', active: false },
];

const mockServices: Service[] = [
  { id: 1, name: 'Cạo vôi răng', duration: 30 },
  { id: 2, name: 'Niềng răng', duration: 60 },
  { id: 3, name: 'Trồng implant', duration: 120 },
];

const mockAssignments: Assignment[] = [
  { id: 1, staffId: 1, serviceId: 1, date: '2025-09-12' },
  { id: 2, staffId: 2, serviceId: 2, date: '2025-09-13' },
];

const DentalStaffAssignment: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filterStaff, setFilterStaff] = useState<string>('');
  const [filterService, setFilterService] = useState<string>('');
  const [editing, setEditing] = useState<Assignment | null>(null);

  useEffect(() => {
    setStaff(mockStaff);
    setServices(mockServices);
    setAssignments(mockAssignments);
  }, []);

  const addAssignment = () => {
    if (!editing?.staffId || !editing?.serviceId || !editing?.date) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }
    setAssignments(prev => [...prev, { ...editing, id: Date.now() }]);
    toast.success('Đã phân công thành công');
    setEditing(null);
  };

  const deleteAssignment = (id: number) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    toast.info('Đã xóa phân công');
  };

  const filteredAssignments = assignments.filter(a => {
    const matchDate = selectedDate ? a.date === selectedDate : true;
    const matchStaff = filterStaff ? a.staffId === Number(filterStaff) : true;
    const matchService = filterService ? a.serviceId === Number(filterService) : true;
    return matchDate && matchStaff && matchService;
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Bảng phân công nhân viên nha khoa</h1>
      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 items-end">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
        <select value={filterStaff} onChange={(e) => setFilterStaff(e.target.value)} className="border p-2 rounded">
          <option value="">Tất cả nhân viên</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="border p-2 rounded">
          <option value="">Tất cả dịch vụ</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={() => setEditing({ id: 0, staffId: 0, serviceId: 0, date: '' })} className="bg-indigo-500 text-white px-4 py-2 rounded">+ Thêm phân công</button>
      </div>

      {/* Bảng phân công */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Nhân viên</th>
              <th className="p-3 text-left">Chuyên môn</th>
              <th className="p-3 text-left">Dịch vụ</th>
              <th className="p-3 text-left">Thời lượng</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map(a => {
              const staffInfo = staff.find(s => s.id === a.staffId);
              const serviceInfo = services.find(s => s.id === a.serviceId);
              return (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.date}</td>
                  <td className="p-3">{staffInfo?.name}</td>
                  <td className="p-3">{staffInfo?.specialty}</td>
                  <td className="p-3">{serviceInfo?.name}</td>
                  <td className="p-3">{serviceInfo?.duration} phút</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => setEditing(a)} className="text-blue-500 hover:underline">Sửa</button>
                    <button onClick={() => deleteAssignment(a.id)} className="text-red-500 hover:underline">Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa phân công */}
      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl shadow-xl w-96" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h2 className="text-xl font-bold mb-4">{editing.id ? 'Chỉnh sửa' : 'Thêm'} phân công</h2>
              <div className="space-y-3">
                <select value={editing.staffId} onChange={(e) => setEditing({ ...editing, staffId: Number(e.target.value) })} className="border p-2 rounded w-full">
                  <option value={0}>Chọn nhân viên</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select value={editing.serviceId} onChange={(e) => setEditing({ ...editing, serviceId: Number(e.target.value) })} className="border p-2 rounded w-full">
                  <option value={0}>Chọn dịch vụ</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="border p-2 rounded w-full" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                <button onClick={addAssignment} className="px-4 py-2 bg-indigo-500 text-white rounded">Lưu</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DentalStaffAssignment;
