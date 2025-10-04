import React, { useEffect, useState } from "react";
import {
  activateProduct,
  deactivateProduct,
  deleteProduct,
  exportProductsToExcel,
  getProducts,
  updateProduct,
} from "../../service/apiProduct";
import {
  ProductForm,
  ProductResponse,
} from "../../interface/Products_interface";
import ProductDetailModal from "../../components/products/ProductDetailModal"; // Import modal
import RenderNotFound from "../../components/notFound/renderNotFound";
import { Pagination } from "@mui/material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { getCategories } from "../../service/apiService";
import { Category } from "../../interface/ServiceSPA_interface";
import axios from "axios";
import { Package } from "lucide-react";
import CartProductModal from "../../components/products/CartProductModal";
import { FaFileExcel, FaLeaf } from "react-icons/fa";
import ProductStatus from "../../components/products/ProductStatus";

const pageSize = 8;
const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(""); // Lọc theo trạng thái
  const [priceFilter, setPriceFilter] = useState<string>(""); // Lọc theo khoảng giá

  useEffect(() => {
    setLoading(true);
    try {
      fetchProducts();
      fetchCategory();
    } catch (error: unknown) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      const now = new Date();
      const sortedProducts = response.sort(
        (a: ProductResponse, b: ProductResponse) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }
      );
      setProducts(
        sortedProducts.map((product: ProductResponse) => ({
          ...product,
          isNew:
            (now.getTime() - new Date(product.createdAt).getTime()) / 1000 < 60,
        }))
      );
    } catch (error: unknown) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleViewDetail = (product: ProductResponse) => {
    // Có thể không cần cập nhật lại ở đây nếu state products đã được cập nhật
    // setSelectedProduct(product);
    setSelectedProduct(products.find((p) => p.id === product.id) || null);
    setIsModalOpen(true);
  };

  const handleViewCart = (product: ProductResponse) => {
    setSelectedProduct(products.find((p) => p.id === product.id) || null);
    setIsCartModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false); // Đóng modal
  };

  const handleCloseCartModal = () => {
    setSelectedProduct(null);
    setIsCartModalOpen(false); // Đóng modal
  };

  // Lọc danh sách sản phẩm
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = statusFilter
      ? product.productStatus === statusFilter
      : true;

    const priceRanges: { [key: string]: (price: number) => boolean } = {
      low: (price) => price < 30000,
      "low-medium": (price) => price >= 30000 && price <= 100000,
      medium: (price) => price > 100000 && price <= 500000,
      "medium-high": (price) => price > 500000 && price <= 1000000,
      high: (price) => price > 1000000,
    };

    const matchesPrice = priceFilter
      ? (priceRanges[priceFilter]?.(product.price) ?? true)
      : true;

    return matchesSearch && matchesStatus && matchesPrice;
  });

  // Phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleChangePage = (_: unknown, value: number) => {
    setCurrentPage(value);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm không?")) return;

    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
        toast.warn("Không thể xóa do sản phẩm này đã được bán!");
        console.log(error.response?.data?.message);
      } else {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = async (productId: number, formData: FormData) => {
    try {
      const productForm: ProductForm = {
        nameProduct: formData.get("nameProduct") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        categoryId: Number(formData.get("categoryId")),
        quantity: Number(formData.get("quantity")),
      };
      const response = await updateProduct(productId, productForm);
      // Cập nhật state products với dữ liệu mới từ response
      setProducts(
        products.map((product) =>
          product.id === productId ? response : product
        )
      );
      toast.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Cập nhật sản phẩm thất bại!");
    }
  };

  // deactivate sản phẩm
  const handleDeactivateProduct = async (productId: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn ngưng làm việc sản phẩm này không?"
      )
    )
      return;

    if (
      products.find((p) => p.id === productId)?.productStatus === "INACTIVATE"
    ) {
      toast.warning("Sản phẩm này đã ngừng bán. Khong thể thực hiện thao tác");
      return;
    }

    try {
      await deactivateProduct(productId);
      // Cập nhật state products với dữ liệu mới từ response
      fetchProducts();
      toast.success("Ẩn sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể thực hiện thao tác!");
    }
  };

  // activate sản phẩm
  const handleActivateProduct = async (productId: number) => {
    try {
      await activateProduct(productId);
      // Cập nhật state products với dữ liệu mới từ response
      fetchProducts();
      toast.success("Cập nhật trạng thái sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể thực hiện thao tác!");
    }
  };

  // Xuất excel lịch hẹn
  const exportExcel = async () => {
    try {
      await exportProductsToExcel();
    } catch (error: unknown) {
      console.log("====================================");
      console.log("Lỗi khi xuat excel", error);
      console.log("====================================");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-y-4">
        <div className="relative h-[100px] w-[100px]">
          <div className="animate-spin rounded-full h-[90px] w-[90px] border-t-2 border-l-2 border-teal-400 absolute"></div>
          <div className="animate-spin rounded-full h-[80px] w-[80px] border-t-2 border-r-2 border-purple-400 absolute top-1 left-1"></div>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-green-400 absolute top-2 left-2"></div>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-blue-400 absolute top-2 left-2"></div>
          <div className="animate-spin rounded-full h-[70px] w-[70px] border-b-2 border-red-400 absolute top-2 left-2"></div>
        </div>
        <div className="flex items-center">
          <FaLeaf className="animate-bounce text-green-400 text-xl mr-2" />
          <span className="text-gray-600 text-sm">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sm:mb-10 mb-20 sm:mt-0 mt-10 dark:text-black sm:p-6"
    >
      <ToastContainer />

      <h2 className="sm:text-2xl text-lg font-semibold mb-4 dark:text-white">
        Danh Sách Sản Phẩm 🦷
      </h2>
      <div className="flex items-center justify-end mb-3">
        <button
          className="flex items-center justify-center sm:gap-2 gap-1 bg-green-500 hover:bg-green-600 text-white sm:p-2 p-1 rounded-lg sm:w-[150px] w-[120px]"
          onClick={exportExcel}
        >
          <FaFileExcel size={20} /> Xuất excel
        </button>
      </div>
      {/* Tìm kiếm sản phẩm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-4 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="flex items-center text-sm justify-between mb-4">
        {/* Lọc theo trạng thái */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg shadow-md"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVATE">Đang hoạt động</option>
          <option value="INACTIVATE">Ngừng hoạt động</option>
        </select>

        {/* Lọc theo giá */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border p-2 rounded-lg shadow-md"
        >
          <option value="">Tất cả giá</option>
          <option value="low">Dưới 30,000</option>
          <option value="low-medium">30,000 - 100,000</option>
          <option value="medium">100,000 - 500,000</option>
          <option value="medium-high">500,000 - 1,000,000</option>
          <option value="high">Trên 1,000,000</option>
        </select>
      </div>

      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 gap-2">
          {currentProducts.map((product) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={product.id}
              className="relative bg-white  rounded-lg shadow-md p-4 hover:bg-blue-50"
            >
              {product.isNew && (
                <span className="absolute top-2 left-2 inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
                  New
                </span>
              )}

              <ProductStatus productStatus={product.productStatus} />
              <h3 className="sm:text-lg text-sm font-semibold mb-2 mt-4">
                {product.nameProduct}
              </h3>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.nameProduct}
                  className="w-full sm:h-[200px] h-[100px] object-cover  rounded-md mb-2"
                />
              )}
              <p className="text-blue-500 text-sm font-semibold mb-1">
                Giá: {product.price.toLocaleString()} VNĐ
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleViewDetail(product)}
                  className="hover:text-blue-500 text-gray-500 rounded-md text-sm"
                >
                  Xem chi tiết
                </button>
                {product.productStatus != "INACTIVATE" && (
                  <button
                    title="Xem đặt hàng"
                    onClick={() => handleViewCart(product)}
                    className="bg-blue-200 hover:bg-blue-400 hover:text-white text-gray-500 py-2 px-4 rounded-md text-sm"
                  >
                    <Package className="sm:w-5 sm:h-5 w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <RenderNotFound />
      )}

      {/* Phân trang */}
      {filteredProducts.length > pageSize && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(filteredProducts.length / pageSize)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </div>
      )}

      {/* Gọi component Modal và truyền props */}
      {isModalOpen && (
        <ProductDetailModal
          product={selectedProduct}
          categories={categories}
          onClose={handleCloseModal}
          handleDeleteProduct={handleDeleteProduct}
          onUpdate={handleUpdateProduct}
          handleDeactivateProduct={handleDeactivateProduct}
          handleActivateProduct={handleActivateProduct}
        />
      )}

      {isCartModalOpen && (
        <CartProductModal
          product={selectedProduct}
          onClose={handleCloseCartModal}
        />
      )}
    </motion.div>
  );
};

export default ProductList;
