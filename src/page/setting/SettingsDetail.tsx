import { useEffect, useState } from "react";
import { Sun, Moon, ChevronLeft } from "lucide-react"; // Icon từ lucide-react (có thể đổi sang MUI)
import { useTranslation } from "react-i18next";

const SettingsDetail: React.FC = () => {

  // Quản lý ngôn ngữ (có thể mở rộng trong tương lai)
  const { i18n } = useTranslation();
  const [hasMounted, setHasMounted] = useState(false);

  // Quản lý trạng thái theme (light/dark)
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  // Khi theme thay đổi -> cập nhật class của <html> và lưu vào localStorage
  useEffect(() => {

    setHasMounted(true);
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  if (!hasMounted) {
    return (
      <div className="flex gap-2">
        <button
          className={`text-sm font-bold p-2 rounded-md bg-blue-500 text-white`}
        >
          VI
        </button>
        <button
          className={`text-sm font-bold p-2 rounded-md bg-gray-200 text-gray-800`}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center  bg-white dark:bg-gray-800 p-9" style={
      {
        borderRadius: '10px',
        height: '100vh',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }
    }>
      <p className="absolute top-10 left-5 cursor-pointer w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300/80 flex items-center justify-center">
        <ChevronLeft onClick={() => window.history.back()} />
      </p>
      <h1 className="font-semibold sm:text-4xl text-2xl text-gray-900 dark:text-white border-b pb-2 w-full text-center">
        Cài đặt
      </h1>

      <div className="sm:w-3/4 w-full mt-5 space-y-6 p-4 border rounded-lg shadow-md">
        {/* Ngôn ngữ */}
        <div>
          <p className="sm:text-lg text-sm font-medium text-gray-700 dark:text-gray-200">Ngôn ngữ</p>
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="border-2 sm:text-lg text-sm border-gray-300 rounded-md w-full p-2 mt-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Chế độ */}
        <div>
          <p className="sm:text-lg text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Chế độ</p>
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-2 p-2 rounded-lg sm:text-lg text-sm transition ${theme === "light"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                }`}
              onClick={() => setTheme("light")}
            >
              <Sun className="sm:w-5 sm:h-5 w-4 h-4" />
              Light
            </button>

            <button
              className={`flex items-center gap-2 p-2 rounded-lg sm:text-lg text-sm transition ${theme === "dark"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                }`}
              onClick={() => setTheme("dark")}
            >
              <Moon className="sm:w-5 sm:h-5 w-4 h-4" />
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDetail;
