import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit3, Trash2, Ban, UserX } from "lucide-react";
import { FaFileCsv, FaLock } from "react-icons/fa";

/**
 * StaffAccountsAdmin.tsx
 * - TailwindCSS-only UI
 * - Fully self-contained admin UI to manage staff/customer accounts
 * - Mock data by default; easy to plug-in real API functions
 *
 * Features:
 * - Card / Table view toggle
 * - Search, status filter, role filter
 * - Column show/hide (persist to localStorage)
 * - Pagination (client-side)
 * - Inline edit modal (with validation)
 * - Upload avatar (preview, stub upload)
 * - Activate / Deactivate / Block / Unblock / Delete
 * - Bulk actions (select multiple -> export / block / delete)
 * - Export CSV (visible cols or selected rows)
 * - Role-based admin controls (isAdmin variable)
 */

// ---------------- Types ----------------
type AccountStatus = "ACTIVATE" | "DEACTIVATED" | "BLOCKED";

type Role = "admin" | "staff" | "user";

type Account = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  status: AccountStatus;
  createdAt: string; // ISO
  avatar?: string;
};

// Loại bỏ 'any' bằng cách định nghĩa các kiểu cụ thể
type EditableAccount = Omit<Account, "id" | "createdAt" | "status" | "role"> & {
  id: number;
  _file?: File;
  name: string;
  email: string;
};

type EditingErrors = {
  [K in keyof EditableAccount]?: string;
};

// ---------------- Config ----------------
const PAGE_SIZE = 8;

const MOCK_ACCOUNTS: Account[] = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: ["An", "Bình", "Cường", "Dũng", "Em", "Hân"][i % 6] + " " + (i + 1),
  email: `user${i + 1}@example.com`,
  phone: `0${(900000000 + i).toString().slice(1)}`,
  address: `Đường ${i + 1}, Quận ${(i % 10) + 1}`,
  role: i % 7 === 0 ? "admin" : i % 3 === 0 ? "staff" : "user",
  status: i % 11 === 0 ? "BLOCKED" : i % 5 === 0 ? "DEACTIVATED" : "ACTIVATE",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
}));

// ---------------- Helpers ----------------
function downloadCSV(rows: Record<string, unknown>[], filename = "export.csv") {
  if (!rows.length) {
    toast.info("Không có dữ liệu để xuất.");
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Cải tiến: validateAccount nhận EditableAccount hoặc Partial<Account>
function validateAccount(a: Partial<EditableAccount>): EditingErrors {
  const errors: EditingErrors = {};
  if (!a.name || !String(a.name).trim()) errors.name = "Tên không được để trống";
  if (!a.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(a.email))) errors.email = "Email không hợp lệ";
  if (a.phone && !/^0\d{9}$/.test(String(a.phone))) errors.phone = "SĐT phải bắt đầu 0 và có 10 chữ số";
  return errors;
}

// Upload stub (replace with real Cloudinary upload or API)
async function uploadAvatarStub(file: File): Promise<string> {
  await new Promise(r => setTimeout(r, 600));
  return URL.createObjectURL(file);
}

// ---------------- Component ----------------
export default function StaffAccountsAdmin() {
  // data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI
  const [view, setView] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | AccountStatus>("");
  const [roleFilter, setRoleFilter] = useState<"" | Role>("");
  const [page, setPage] = useState(1);

  // selection + bulk
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  // edit modal
  const [editing, setEditing] = useState<EditableAccount | null>(null);
  const [editingErrors, setEditingErrors] = useState<EditingErrors>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [isAdmin] = useState<boolean>(true); // toggle to demo role-based controls

  // load mock
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setAccounts(MOCK_ACCOUNTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // derived
  const filtered = useMemo(() => {
    return accounts.filter(a => {
      const bySearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
      const byStatus = statusFilter ? a.status === statusFilter : true;
      const byRole = roleFilter ? a.role === roleFilter : true;
      return bySearch && byStatus && byRole;
    });
  }, [accounts, search, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  // selection helpers
  const toggleSelect = (id: number) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const selectAllPage = (on: boolean) => {
    const slice = pageItems.reduce<Record<number, boolean>>((acc, it) => ({ ...acc, [it.id]: on }), {});
    setSelected(prev => ({ ...prev, ...slice }));
  };

  // actions
  const openEdit = (acct: Account) => { setEditing({ ...acct }); setPreview(acct.avatar ?? null); setEditingErrors({}); };
  const closeEdit = () => { setEditing(null); setPreview(null); setEditingErrors({}); };

  const handleAvatarChange = (file?: File) => {
    if (!file) return;
    if (file.size > 2_000_000) { toast.error("Ảnh quá lớn (max 2MB)"); return; }
    const tmp = URL.createObjectURL(file);
    setPreview(tmp);
    setEditing(prev => ({ ...(prev as EditableAccount ?? {}), _file: file, avatar: tmp }));
  };

  const saveEditing = async () => {
    if (!editing || editing.id == null) return;
    const errors = validateAccount(editing);
    if (Object.keys(errors).length) { setEditingErrors(errors); toast.error("Có lỗi dữ liệu"); return; }

    try {
      // upload if has file
      const file = editing._file;
      let avatarUrl = editing.avatar;
      if (file) avatarUrl = await uploadAvatarStub(file);

      const updatedAccount: Omit<EditableAccount, '_file'> = { ...editing, avatar: avatarUrl };

      setAccounts(prev => prev.map(a => a.id === editing.id ? { ...a, ...updatedAccount } : a));
      toast.success("Lưu thành công");
      closeEdit();
    } catch (err) {
      console.error(err); toast.error("Lưu thất bại");
    }
  };

  const toggleStatus = (id: number) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "ACTIVATE" ? "DEACTIVATED" : "ACTIVATE" } : a));
    toast.success("Cập nhật trạng thái");
  };

  const blockAccount = (id: number) => {
    if (!isAdmin) { toast.error("Không có quyền"); return; }
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: "BLOCKED" } : a));
    toast.success("Khóa tài khoản");
  };

  const deleteAccount = (id: number) => {
    if (!isAdmin) { toast.error("Không có quyền"); return; }
    if (!window.confirm("Xác nhận xóa tài khoản?")) return;
    setAccounts(prev => prev.filter(a => a.id !== id));
    toast.success("Đã xóa");
  };

  // bulk
  const bulkDeleteSelected = () => {
    const ids = Object.keys(selected).filter(k => selected[Number(k)]).map(k => Number(k));
    if (!ids.length) { toast.info("Chưa chọn bản ghi"); return; }
    if (!window.confirm(`Xóa ${ids.length} tài khoản đã chọn?`)) return;
    setAccounts(prev => prev.filter(a => !ids.includes(a.id)));
    setSelected({}); toast.success("Xóa hàng loạt thành công");
  };

  const bulkExportSelected = () => {
    const ids = Object.keys(selected).filter(k => selected[Number(k)]).map(k => Number(k));
    const rows = accounts.filter(a => ids.includes(a.id)).map(a => ({ id: a.id, name: a.name, email: a.email, role: a.role, status: a.status }));
    downloadCSV(rows, "selected_accounts.csv");
  };

  // export visible
  const exportVisible = () => {
    const rows = filtered.map(a => ({ id: a.id, name: a.name, email: a.email, role: a.role, status: a.status }));
    downloadCSV(rows, "accounts_visible.csv");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <ToastContainer />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Quản lý tài khoản</h1>
        <div className="flex gap-2">
          <button onClick={() => setView(v => v === "cards" ? "table" : "cards")} className="px-3 py-2 bg-gray-100 rounded">{view === "cards" ? "Bảng" : "Thẻ"}</button>
          <div className="relative">
            <button onClick={exportVisible} className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2"><FaFileCsv /> Xuất</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input className="border rounded px-3 py-2 w-full sm:w-64" placeholder="Tìm tên hoặc email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="border rounded px-3 py-2" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as AccountStatus | ""); setPage(1); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVATE">Hoạt động</option>
          <option value="DEACTIVATED">Ngừng</option>
          <option value="BLOCKED">Bị khóa</option>
        </select>
        <select className="border rounded px-3 py-2" value={roleFilter} onChange={e => { setRoleFilter(e.target.value as Role | ""); setPage(1); }}>
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="user">User</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => selectAllPage(true)} className="px-2 py-1 bg-gray-100 rounded">Chọn trang</button>
          <button onClick={() => selectAllPage(false)} className="px-2 py-1 bg-gray-100 rounded">Bỏ chọn trang</button>
          <button onClick={bulkExportSelected} className="px-2 py-1 bg-indigo-500 text-white rounded">Xuất chọn</button>
          <button onClick={bulkDeleteSelected} className="px-2 py-1 bg-red-500 text-white rounded">Xóa chọn</button>
        </div>
      </div>

      {/* Main view */}
      {view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pageItems.map(a => (
            <div key={a.id} className="bg-white rounded shadow p-4">
              <div className="flex items-center gap-3">
                <img src={a.avatar} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{a.name}</div>
                      <div className="text-xs text-gray-500">{a.email}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded text-white" style={{ background: a.status === "ACTIVATE" ? "#059669" : a.status === "BLOCKED" ? "#EF4444" : "#F97316" }}>{a.status}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{a.role}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={!!selected[a.id]} onChange={() => toggleSelect(a.id)} />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(a)} className="px-2 py-1 bg-blue-200 rounded"><Edit3 /></button>
                  {isAdmin && <button onClick={() => blockAccount(a.id)} className="px-2 py-1 bg-orange-200 rounded"><Ban /></button>}
                  <button onClick={() => toggleStatus(a.id)} className="px-2 py-1 bg-yellow-200 rounded"><UserX /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2"><input type="checkbox" onChange={(e) => selectAllPage(e.target.checked)} /></th>
                <th className="p-2">Mã</th>
                <th className="p-2">Tên</th>
                <th className="p-2">Email</th>
                <th className="p-2">Vai trò</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Ngày tạo</th>
                <th className="p-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(a => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-2"><input type="checkbox" checked={!!selected[a.id]} onChange={() => toggleSelect(a.id)} /></td>
                  <td className="p-2">{a.id}</td>
                  <td className="p-2 flex items-center gap-2"><img src={a.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />{a.name}</td>
                  <td className="p-2">{a.email}</td>
                  <td className="p-2">{a.role}</td>
                  <td className="p-2">{a.status}</td>
                  <td className="p-2">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(a)} className="px-2 py-1 bg-blue-200 rounded"><Edit3 /></button>
                      {isAdmin && <button onClick={() => blockAccount(a.id)} className="px-2 py-1 bg-orange-200 rounded"><Ban /></button>}
                      <button onClick={() => deleteAccount(a.id)} className="px-2 py-1 bg-red-200 rounded"><Trash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
        <div className="px-3 py-1 bg-gray-100 rounded">{page} / {totalPages}</div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded">Next</button>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-lg p-4 w-full max-w-md" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h3 className="text-lg font-semibold mb-3">Chỉnh sửa tài khoản</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs">Họ & tên</label>
                  <input className={`w-full border rounded px-3 py-2 ${editingErrors.name ? 'border-red-500' : ''}`} value={editing.name ?? ''} onChange={e => setEditing(prev => ({
                    ...(prev as EditableAccount),
                    name: e.target.value
                  }))} />
                  {editingErrors.name && <div className="text-red-500 text-xs">{editingErrors.name}</div>}
                </div>
                <div>
                  <label className="text-xs">Email</label>
                  <input className={`w-full border rounded px-3 py-2 ${editingErrors.email ? 'border-red-500' : ''}`} value={editing.email ?? ''} onChange={e => setEditing(prev => ({
                    ...(prev as EditableAccount),
                    email: e.target.value
                  }))} />
                  {editingErrors.email && <div className="text-red-500 text-xs">{editingErrors.email}</div>}
                </div>
                <div>
                  <label className="text-xs">SĐT</label>
                  <input className={`w-full border rounded px-3 py-2 ${editingErrors.phone ? 'border-red-500' : ''}`} value={editing.phone ?? ''} onChange={e => setEditing(prev => ({
                    ...(prev as EditableAccount),
                    phone: e.target.value
                  }))} />
                  {editingErrors.phone && <div className="text-red-500 text-xs">{editingErrors.phone}</div>}
                </div>
                <div>
                  <label className="text-xs">Avatar</label>
                  <div className="flex items-center gap-3">
                    <img src={preview ?? editing.avatar} alt="preview" className="w-12 h-12 rounded-full object-cover" />
                    <input type="file" accept="image/*" onChange={e => handleAvatarChange(e.target.files?.[0] ?? undefined)} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={closeEdit} className="px-3 py-2 bg-gray-200 rounded">Hủy</button>
                  <button onClick={saveEditing} className="px-3 py-2 bg-indigo-600 text-white rounded flex items-center gap-2"><FaLock /> Lưu</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}