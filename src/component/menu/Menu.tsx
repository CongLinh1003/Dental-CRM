'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";

const menuItems = [
    { labelKey: "Home", path: "/" },
    { labelKey: "About", path: "/page/products" },
    {
        labelKey: "Services",
        path: "",
        submenuItems: [
            { labelKey: "cosmetic_porcelain_teeth", path: "/page/service-center/rang-su-tham-my" },
            { labelKey: "porcelain_veneer", path: "/page/service-center/dan-su-veneer" },
            { labelKey: "invisalign_orthodontics", path: "/page/service-center/chinh-nha-invisalign" },
            { labelKey: "single_implant", path: "/page/service-center/implant-don-le" },
            { labelKey: "full_arch_implant", path: "/page/service-center/implant-toan-ham" },
            { labelKey: "in_office_zoom_whitening", path: "/page/service-center/tay-trang-zoom" },
            { labelKey: "periodontal_treatment", path: "/page/service-center/dieu-tri-nha-chu" },
        ],
    },
    {
        labelKey: "Pricing",
        path: "",
        submenuItems: [
            { labelKey: "dental_exam_pricing", path: "/page/cart/bang-gia-kham-rang" },
            { labelKey: "veneer_porcelain_pricing", path: "/page/cart/bang-gia-veneer-rang-su" },
            { labelKey: "minor_surgery_pricing", path: "/page/cart/bang-gia-tieu-phau" },
            { labelKey: "orthodontic_pricing", path: "/page/cart/bang-gia-nieng-rang" },
            { labelKey: "children_dental_pricing", path: "/page/cart/bang-gia-rang-tre-em" },
            { labelKey: "implant_surgery_pricing", path: "/page/cart/bang-gia-phau-thuat-implant" },
            { labelKey: "fixed_removable_prosthetics_pricing", path: "/page/cart/bang-gia-phuc-hinh" },
        ],
    },
    { labelKey: "Contact", path: "/page/contact" },
];

const Menu: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const router = useRouter();
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsMenuOpen(false);
    };

    const handleMouseEnter = (label: string) => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
        }
        setActiveDropdown(label);
    };

    const handleMouseLeave = () => {
        dropdownTimerRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    const handleMobileClick = (item: typeof menuItems[0]) => {
        if (item.submenuItems) {
            setActiveDropdown(activeDropdown === item.labelKey ? null : item.labelKey);
        } else {
            handleNavigation(item.path);
        }
    };

    return (
        <div className="h-20 flex md:justify-center justify-between md:gap-60 items-center p-3 sticky top-0 z-50 text-gray-600 bg-white backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2 justify-center ml-3 cursor-pointer">
                <Link href="/page/home">
                    <div className="flex items-center gap-2 justify-center">
                        <Image
                            src="/LOGO/Logo_Horizontal_Light_1-1024x237.png.webp"
                            width={200}
                            height={42}
                            className="h-10"
                            alt="logo"
                            priority
                        />
                    </div>
                </Link>
            </div>

            {/* Menu trên Desktop (hiện từ màn hình md trở lên) */}
            <div className="hidden md:flex items-center justify-center gap-4 mr-10">
                {menuItems.map((item, i) => (
                    <div
                        key={item.labelKey}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.labelKey)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link href={item.path} className="h-full">
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: "100%" },
                                    animate: { opacity: 1, x: 0 },
                                    hover: { scale: 1.05 },
                                    tap: { scale: 0.9 },
                                }}
                                className="h-full font-bold text-lg px-4 py-1 rounded-lg relative overflow-hidden hover:text-white
                                hover:bg-gray-400/40 text-gray-400
                                bg-transparent transition-colors duration-200"
                                initial="hidden"
                                animate="animate"
                                whileHover="hover"
                                whileTap="tap"
                                custom={i}
                            >
                                {t(item.labelKey)}
                            </motion.div>
                        </Link>
                        
                        {/* Logic để hiển thị Dropdown */}
                        {item.submenuItems && activeDropdown === item.labelKey && (
                            <motion.div
                                onMouseEnter={() => handleMouseEnter(item.labelKey)}
                                className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-2 w-56 z-50 flex flex-col items-start"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.submenuItems.map((subItem) => (
                                    <Link href={subItem.path} key={subItem.labelKey}>
                                        <div className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer">
                                            {t(subItem.labelKey)}
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </div>
                ))}

                {/* Nút "Sản phẩm mới" */}
                <Link href="/suggestions">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        variants={{
                            hidden: { opacity: 0, x: "100%" },
                            visible: (i: number) => ({
                                opacity: 1,
                                x: 0,
                                transition: { delay: (i - 1) * 0.2 },
                            }),
                        }}
                        className="text-lg font-bold text-white py-1 px-2 rounded-lg w-40
                        bg-gradient-to-r from-pink-500 via-blue-700 to-blue-600 text-center
                        hover:from-blue-600 hover:via-pink-500 hover:to-pink-500
                        hover:bg-white transition-colors duration-300 cursor-pointer"
                        initial="hidden"
                        animate="visible"
                        custom={menuItems.length + 1}
                    >
                        {t("New Products")}
                    </motion.div>
                </Link>

                <LanguageSwitcher />
            </div>

            {/* Nút Hamburger cho Mobile (hiện trên màn hình md trở xuống) */}
            <div className="md:hidden mr-3">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: "100%" },
                            visible: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: "100%" },
                        }}
                        className="fixed top-20 left-0 w-full z-40 flex flex-col items-center justify-center space-y-8 md:hidden bg-black/80 h-[calc(100vh-80px)]"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {menuItems.map((item, i) => (
                            <div key={item.labelKey} className="w-full text-center">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-lg font-bold text-white py-2 w-full text-center hover:bg-white hover:text-black transition-colors duration-300"
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    onClick={() => handleMobileClick(item)}
                                >
                                    {t(item.labelKey)}
                                </motion.button>
                                
                                <AnimatePresence>
                                    {item.submenuItems && activeDropdown === item.labelKey && (
                                        <motion.div
                                            className="flex flex-col items-center w-full mt-2"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, type: "tween" }}
                                        >
                                            {item.submenuItems.map((subItem) => (
                                                <motion.div
                                                    key={subItem.labelKey}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-full"
                                                >
                                                    <Link href={subItem.path}>
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            className="text-sm font-light text-gray-300 py-2 w-full text-center hover:bg-gray-800 hover:text-white transition-colors duration-300"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {t(subItem.labelKey)}
                                                        </motion.button>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            variants={{
                                hidden: { opacity: 0, x: "100%" },
                                visible: (i: number) => ({
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: (i - 1) * 0.1 },
                                }),
                            }}
                            className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50
                            bg-gradient-to-r from-pink-500 via-blue-700 to-blue-600 text-center
                            hover:from-blue-600 hover:via-pink-500 hover:to-pink-500
                            hover:bg-white transition-colors duration-300 mb-10"
                            initial="hidden"
                            animate="visible"
                            custom={menuItems.length + 1}
                            onClick={() => {
                                handleNavigation("/suggestions");
                                setIsMenuOpen(false);
                            }}
                        >new
                            {t("New Products")}
                        </motion.button>

                        {/* Nút chuyển đổi ngôn ngữ cho Mobile */}
                        <div className="flex gap-2">
                            <button onClick={() => { changeLanguage('vi'); setIsMenuOpen(false); }} className={`text-sm font-bold p-2 rounded-md ${i18n.language === 'vi' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>VI</button>
                            <button onClick={() => { changeLanguage('en'); setIsMenuOpen(false); }} className={`text-sm font-bold p-2 rounded-md ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>EN</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Menu;