import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileCsv, FaEdit, FaTrash, FaUserAlt, FaColumns } from "react-icons/fa";
import { DentistAPI, Dentist } from "../../services/dentist";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

/* ---------------- Types ---------------- */
type Position = { positionId: number; positionName: string };
type Staff = {
  staffId: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  position?: Position;
  status: "ACTIVATE" | "DEACTIVATED";
  startDate?: string;
  imageUrl?: string;
};

// Loại bỏ 'any' bằng cách định nghĩa các kiểu cụ thể
type StaffUpdatePayload = Partial<Omit<Staff, 'position'>> & {
  position?: Position | null; // Chức vụ có thể null hoặc undefined khi chỉnh sửa
};

type EditingErrors = {
  [K in keyof Staff]?: string;
};

/* ---------------- Config ---------------- */
const PAGE_SIZE = 8;
const STORAGE_COLS_KEY = "employee_visible_columns_v1";

/* ---------------- Mock data ---------------- */
// Xóa mock data, sẽ lấy từ API

/* ---------------- Helpers ---------------- */
const defaultVisibleCols = {
  staffId: true,
  name: true,
  email: true,
  phone: true,
  position: true,
  status: true,
  address: false,
  startDate: false,
};

const downloadCSV = (rows: Array<Record<string, string | number | boolean | undefined>>, filename = "employees.csv") => {
  if (!rows || rows.length === 0) {
    toast.info("Không có dữ liệu để xuất.");
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map(r =>
      keys
        .map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const validateField = (name: string, value: string) => {
  const v = String(value ?? "").trim();
  switch (name) {
    case "name":
      if (!v) return "Vui lòng nhập họ và tên.";
      // Chỉnh sửa regex để chấp nhận chữ cái tiếng Việt
      if (!/^[a-zA-Z\u00C0-\u1EF9\s]+$/.test(v)) return "Họ và tên chỉ chứa chữ cái và khoảng trắng.";
      return "";
    case "phone":
      if (!v) return "Vui lòng nhập số điện thoại.";
      if (!/^0\d{9}$/.test(v)) return "SĐT phải bắt đầu 0 và đủ 10 chữ số.";
      return "";
    case "email":
      if (!v) return "Vui lòng nhập email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email không hợp lệ.";
      return "";
    case "address":
      if (!v) return "Vui lòng nhập địa chỉ.";
      return "";
    default:
      return "";
  }
};

/* ---------------- Component ---------------- */
export default function EmployeeList() {
  // State cho dropdown cột
  const [showColsDropdown, setShowColsDropdown] = useState(false);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById('cols-dropdown');
      if (showColsDropdown && dropdown && !dropdown.contains(e.target as Node)) {
        setShowColsDropdown(false);
      }
    };
    if (showColsDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showColsDropdown]);
  // data + configs
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI states
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVATE" | "DEACTIVATED">("");
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_COLS_KEY);
      return raw ? JSON.parse(raw) : defaultVisibleCols;
    } catch {
      return defaultVisibleCols;
    }
  });

  // edit states per staffId
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [editingRows, setEditingRows] = useState<Record<number, StaffUpdatePayload>>({});
  const [editingErrors, setEditingErrors] = useState<Record<number, EditingErrors>>({});

  /* ---------- Init load mock (replace this with API calls) ---------- */
  useEffect(() => {
    setLoading(true);
    DentistAPI.getDentists()
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          // Chuyển đổi dữ liệu Dentist sang Staff
          const staffList: Staff[] = res.data.map((d: Dentist) => ({
            staffId: d.id,
            name: d.name,
            email: d.email,
            phone: d.phone,
            address: '', // Không có address từ API
            position: { positionId: 0, positionName: d.specialization },
            status: d.active ? "ACTIVATE" : "DEACTIVATED",
            startDate: '', // Không có startDate từ API
            imageUrl: '', // Không có imageUrl từ API
          }));
          setEmployees(staffList);
          // Lấy các specialization duy nhất làm positions
          const uniqueSpecs = Array.from(new Set(res.data.map(d => d.specialization)));
          setPositions(uniqueSpecs.map((spec, idx) => ({ positionId: idx + 1, positionName: spec })));
        } else {
          setEmployees([]);
          setPositions([]);
          toast.error(res.message || "Không lấy được danh sách nhân viên");
        }
      })
      .catch(() => {
        setEmployees([]);
        setPositions([]);
        toast.error("Lỗi hệ thống hoặc mạng!");
      })
      .finally(() => setLoading(false));
  }, []);

  /* persist cols */
  useEffect(() => {
    localStorage.setItem(STORAGE_COLS_KEY, JSON.stringify(visibleCols));
  }, [visibleCols]);

  /* ---------- Derived lists ---------- */
  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? e.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [employees, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);


  /* ---------- Pagination ---------- */
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  /* ---------- Editing handlers ---------- */
  const startEdit = (staffId: number) => {
    const emp = employees.find(e => e.staffId === staffId);
    if (!emp) return;
    setEditMode(m => ({ ...m, [staffId]: true }));
    setEditingRows(r => ({ ...r, [staffId]: { ...emp } }));
    setEditingErrors(prev => ({ ...prev, [staffId]: {} }));
  };


  // Hủy chỉnh sửa
  const cancelEdit = (staffId: number) => {
    setEditMode(m => {
      const copy = { ...m }; delete copy[staffId]; return copy;
    });
    setEditingRows(r => {
      const copy = { ...r }; delete copy[staffId]; return copy;
    });
    setEditingErrors(r => {
      const copy = { ...r }; delete copy[staffId]; return copy;
    });

  };

  // Cập nhật giá trị khi chỉnh sửa
  const onEditChange = (staffId: number, field: keyof StaffUpdatePayload, value: unknown) => {
    setEditingRows(prev => ({ ...prev, [staffId]: { ...(prev[staffId] || {}), [field]: value } }));
    setEditingErrors(prev => ({ ...prev, [staffId]: { ...(prev[staffId] || {}), [field]: "" } }));
  };


  // Validate khi blur khỏi input
  const onEditBlur = (staffId: number, field: keyof Staff) => {
    const val = (editingRows[staffId] ? editingRows[staffId][field] : employees.find(e => e.staffId === staffId)?.[field]) ?? "";
    const err = validateField(String(field), String(val));
    setEditingErrors(prev => ({ ...prev, [staffId]: { ...(prev[staffId] || {}), [field]: err } }));
  };


  // stub upload function — replace with real upload (e.g., Cloudinary) as needed
  const uploadImageStub = async (file: File): Promise<string> => {
    await new Promise(r => setTimeout(r, 600));
    return URL.createObjectURL(file);
  };


  // Lưu thay đổi
  const saveEdit = async (staffId: number) => {
    const emp = employees.find(e => e.staffId === staffId);
    if (!emp) return;
    const edits = editingRows[staffId] || {};

    // Validate tất cả các trường bắt buộc trước khi lưu
    const fieldsToValidate: (keyof Staff)[] = ["name", "phone", "email", "address"];
    const errs: EditingErrors = {};
    let valid = true;
    for (const f of fieldsToValidate) {
      const val = (edits[f] ?? emp[f] ?? "") as string;
      const err = validateField(String(f), String(val));
      if (err) { errs[f] = err; valid = false; }
    }
    if (!edits.position && !emp.position) { errs.position = "Chọn chức vụ."; valid = false; }

    setEditingErrors(prev => ({ ...prev, [staffId]: errs }));
    if (!valid) { toast.error("Vui lòng sửa lỗi trước khi lưu."); return; }

    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi?")) return;

    // Mock save - thay thế bằng API call nếu có
    try {
      const updated: Staff = {
        ...emp,
        ...edits,
        position: edits.position === null ? undefined : (edits.position ?? emp.position)
      };

      if ("imageFile" in edits && edits.imageFile instanceof File) {
        const file = edits.imageFile as File;
        const url = await uploadImageStub(file);
        updated.imageUrl = url;
      }

      setEmployees(prev => prev.map(p => p.staffId === staffId ? updated : p));
      cancelEdit(staffId);
      toast.success("Lưu thông tin nhân viên thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lưu thất bại, thử lại.");
    }
  };

  /* ---------- Activate / Deactivate / Delete (mock with state updates) ---------- */
  const toggleDeactivate = (staffId: number) => {
    const emp = employees.find(e => e.staffId === staffId);
    if (!emp) return;
    if (!window.confirm(emp.status === "ACTIVATE" ? "Ngưng làm việc nhân viên này?" : "Kích hoạt nhân viên này?")) return;
    setEmployees(prev => prev.map(e => e.staffId === staffId ? { ...e, status: e.status === "ACTIVATE" ? "DEACTIVATED" : "ACTIVATE" } : e));
    toast.success("Cập nhật trạng thái thành công!");
  };


  // Xóa nhân viên
  const deleteEmployee = (staffId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    setEmployees(prev => prev.filter(p => p.staffId !== staffId));
    toast.success("Xóa nhân viên thành công!");
  };

  /* ---------- Export CSV ---------- */
  const exportVisibleCSV = () => {
    const rows: Array<Record<string, string | number | boolean | undefined>> = filtered.map(e => {
      const row: Record<string, string | number | boolean | undefined> = {};
      if (visibleCols.staffId) row.staffId = e.staffId;
      if (visibleCols.name) row.name = e.name;
      if (visibleCols.email) row.email = e.email;
      if (visibleCols.phone) row.phone = e.phone;
      if (visibleCols.position) row.position = e.position?.positionName ?? "";
      if (visibleCols.status) row.status = e.status;
      if (visibleCols.startDate) row.startDate = e.startDate ?? "";
      if (visibleCols.address) row.address = e.address ?? "";
      return row;
    });
    downloadCSV(rows, "employees_visible.csv");
  };

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
        <p className="mt-3 text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:pb-6 pb-40 h-[85vh] overflow-auto bg-white rounded-xl shadow">
      <ToastContainer limit={3} position="top-right" />

      <div className="flex items-center justify-end mb-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(v => v === "cards" ? "table" : "cards")}
            className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center gap-2"
            title="Chuyển view"
          >
            <FaColumns /> {viewMode === "cards" ? "Bảng" : "Thẻ"}
          </button>

          <div className="relative group">
            <button className="px-3 py-2 bg-green-500 text-white rounded-xl flex items-center gap-2">
              <FaFileCsv /> Xuất
            </button>
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow p-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={exportVisibleCSV} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Xuất CSV (view)</button>
              <button onClick={() => toast.info("Nếu có API, đây sẽ gọi export Excel server.")} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Yêu cầu Excel (server)</button>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Tìm theo tên..."
          className="border px-3 py-3 rounded-xl w-full sm:w-64 focus:outline-none"
        />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as "" | "ACTIVATE" | "DEACTIVATED"); setPage(1); }}
          className="border px-3 py-2 rounded-xl focus:outline-none">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVATE">Hoạt động</option>
          <option value="DEACTIVATED">Không hoạt động</option>
        </select>

        <div className="relative">
          <button
            className="px-3 py-2 bg-gray-100 rounded flex items-center gap-2"
            onClick={() => setShowColsDropdown((v) => !v)}
            type="button"
          >
            <FaColumns /> Cột ▾
          </button>
          {showColsDropdown && (
            <div id="cols-dropdown" className="absolute left-0 mt-2 w-56 bg-white border rounded shadow p-3 z-10">
              {Object.keys(visibleCols).map(k => (
                <label key={k} className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={visibleCols[k]} onChange={() => setVisibleCols(prev => ({ ...prev, [k]: !prev[k] }))} />
                  <span className="capitalize text-sm">{k}</span>
                </label>
              ))}
              <div className="flex gap-2 mt-2">
                <button onClick={() => setVisibleCols(Object.fromEntries(Object.keys(visibleCols).map(k => [k, true])))} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Hiện tất cả</button>
                <button onClick={() => setVisibleCols(Object.fromEntries(Object.keys(visibleCols).map(k => [k, false])))} className="px-2 py-1 bg-gray-200 rounded text-sm">Ẩn tất cả</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* view */}
      {viewMode === "cards" ? (
        <>
          {paginated.length === 0 ? (
            <div className="text-center text-gray-500 py-12">Không tìm thấy nhân viên.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map(emp => {
                const isEditing = !!editMode[emp.staffId];
                const editingStaff = editingRows[emp.staffId];
                const errors = editingErrors[emp.staffId];
                return (
                  <motion.div key={emp.staffId} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow p-4">
                    <div className="flex flex-col items-center">
                      {isEditing ? (
                        <>

                          <img src="/doctor.png" alt="" className="w-20 h-20 rounded-full shadow-md object-cover mb-2" />

                          <input className="w-full border rounded p-2 mb-2 text-sm" value={editingStaff?.name ?? emp.name} onChange={e => onEditChange(emp.staffId, "name", e.target.value)} onBlur={() => onEditBlur(emp.staffId, "name")} />
                          {errors?.name && <div className="text-red-500 text-xs w-full text-left">{errors.name}</div>}

                          <input className="w-full border rounded p-2 mb-2 text-sm" value={editingStaff?.email ?? emp.email} onChange={e => onEditChange(emp.staffId, "email", e.target.value)} onBlur={() => onEditBlur(emp.staffId, "email")} />
                          {errors?.email && <div className="text-red-500 text-xs w-full text-left">{errors.email}</div>}

                          <input className="w-full border rounded p-2 mb-2 text-sm" value={editingStaff?.phone ?? emp.phone} onChange={e => onEditChange(emp.staffId, "phone", e.target.value)} onBlur={() => onEditBlur(emp.staffId, "phone")} />
                          {errors?.phone && <div className="text-red-500 text-xs w-full text-left">{errors.phone}</div>}

                          <select className="w-full border rounded p-2 mb-2 text-sm" value={editingStaff?.position?.positionId ?? emp.position?.positionId ?? ""} onChange={e => onEditChange(emp.staffId, "position", positions.find(p => p.positionId === Number(e.target.value)))}>
                            <option value="">Chọn chức vụ</option>
                            {positions.map(p => <option key={p.positionId} value={p.positionId}>{p.positionName}</option>)}
                          </select>
                          {errors?.position && <div className="text-red-500 text-xs w-full text-left">{errors.position}</div>}
                        </>
                      ) : (
                        <>
                          <img src="/doctor.png" alt="" className="w-20 h-20 rounded-full shadow-md object-cover mb-2" />
                          <h3 className="font-semibold">{emp.name}</h3>
                          {visibleCols.email && <div className="text-sm text-gray-500">Email: {emp.email}</div>}
                          {visibleCols.phone && <div className="text-sm text-gray-500">SĐT: {emp.phone}</div>}
                          {visibleCols.position && <div className="text-sm text-gray-500">Chức vụ: {emp.position?.positionName}</div>}
                          {visibleCols.startDate && <div className="text-sm text-gray-400">Ngày vào: {emp.startDate}</div>}
                          {visibleCols.address && <div className="text-sm text-gray-400 truncate w-full text-center">{emp.address}</div>}
                        </>
                      )}

                      <div className="mt-3 w-full flex items-center justify-between">
                        <div className={`px-2 py-1 rounded text-xs ${emp.status === "ACTIVATE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {emp.status === "ACTIVATE" ? "Đang làm việc" : "Đã nghỉ"}
                        </div>

                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(emp.staffId)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Lưu</button>
                              <button onClick={() => cancelEdit(emp.staffId)} className="px-3 py-1 bg-gray-300 rounded text-sm">Hủy</button>
                            </>
                          ) : (
                            <>
                              <button title="Sửa" onClick={() => startEdit(emp.staffId)} className="p-2 bg-blue-200 rounded text-white"><FaEdit /></button>
                              <button title={emp.status === "ACTIVATE" ? "Ngừng" : "Kích hoạt"} onClick={() => toggleDeactivate(emp.staffId)} className="p-2 bg-orange-200 rounded text-white"><FaUserAlt /></button>
                              <button title="Xóa" onClick={() => deleteEmployee(emp.staffId)} className="p-2 bg-red-300 rounded text-white"><FaTrash /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        // Table view
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {visibleCols.staffId && <th className="p-2 text-left">Mã</th>}
                {visibleCols.name && <th className="p-2 text-left">Họ & Tên</th>}
                {visibleCols.email && <th className="p-2 text-left">Email</th>}
                {visibleCols.phone && <th className="p-2 text-left">SĐT</th>}
                {visibleCols.position && <th className="p-2 text-left">Chức vụ</th>}
                {visibleCols.startDate && <th className="p-2 text-left">Ngày vào</th>}
                {visibleCols.address && <th className="p-2 text-left">Địa chỉ</th>}
                {visibleCols.status && <th className="p-2 text-left">Trạng thái</th>}
                <th className="p-2 text-center">Xử lý</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(emp => (
                <tr key={emp.staffId} className="border-t hover:bg-gray-50">
                  {visibleCols.staffId && <td className="p-2">{emp.staffId}</td>}
                  {visibleCols.name && <td className="p-2">{emp.name}</td>}
                  {visibleCols.email && <td className="p-2">{emp.email}</td>}
                  {visibleCols.phone && <td className="p-2">{emp.phone}</td>}
                  {visibleCols.position && <td className="p-2"><span className="text-sm bg-purple-100 text-purple-600  p-2 px-4 rounded-full">{emp.position?.positionName}</span></td>}
                  {visibleCols.startDate && <td className="p-2">{emp.startDate}</td>}
                  {visibleCols.address && <td className="p-2">{emp.address}</td>}
                  {visibleCols.status && <td className="p-2">{emp.status}</td>}
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(emp.staffId)} className="px-2 py-1 bg-blue-200 rounded text-white"><FaEdit /></button>
                      <button onClick={() => toggleDeactivate(emp.staffId)} className="px-2 py-1 bg-orange-200 rounded text-white">{emp.status === "ACTIVATE" ? "Ngừng" : "Kích hoạt"}</button>
                      <button onClick={() => deleteEmployee(emp.staffId)} className="px-2 py-1 bg-red-300 rounded text-white"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4">
        <button className="px-2 py-1 rounded border mr-2" onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeftIcon className="h-4 w-4" /></button>
        <span className="px-3 py-1 bg-gray-100 rounded">Trang {page} / {totalPages}</span>
        <button className="px-2 py-1 rounded border ml-2" onClick={() => setPage(p => Math.min(totalPages, p + 1))}><ChevronRightIcon className="h-4 w-4" /></button>
      </div>
    </div>
  );
}