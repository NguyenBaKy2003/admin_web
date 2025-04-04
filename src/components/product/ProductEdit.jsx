import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Paper,
  Chip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";

// API URLs
const API_URL = "https://backend.kadoma.vn/api";
const PRODUCTS_API = `${API_URL}/products`;
const CATEGORY_API = `${API_URL}/categories`;
const IMAGE_API = `${API_URL}/product-images`;

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState({
    id: "",
    sku: "",
    name: "",
    description: "",
    price: "",
    tradeMark: "",
    stockQuantity: "",
    categoryId: "",
    category: null,
    details: [],
    descriptions: [],
  });

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [originalImages, setOriginalImages] = useState([]);

  // New state for product descriptions
  const [newDescription, setNewDescription] = useState({ content: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        toast.info("Đang tải dữ liệu sản phẩm...", toastConfig);

        const [categoriesRes, productRes, imagesRes] = await Promise.all([
          axios.get(CATEGORY_API),
          axios.get(`${PRODUCTS_API}/${id}`),
          axios.get(`${IMAGE_API}/product/${id}`),
        ]);

        const fetchedCategories = categoriesRes.data;
        setCategories(fetchedCategories);
        setParentCategories(
          fetchedCategories.filter((cat) => !cat.parentCategory)
        );

        const productData = productRes.data;
        setProduct({
          ...productData,
          categoryId: productData.category?.id || "",
          details: productData.details || [],
          descriptions: productData.descriptions || [],
        });

        if (productData.category?.parentCategory) {
          setSelectedParent(productData.category.parentCategory.id);
          setChildCategories(
            fetchedCategories.filter(
              (cat) =>
                cat.parentCategory?.id ===
                productData.category.parentCategory.id
            )
          );
        }

        const fetchedImages = imagesRes.data;
        setImages(fetchedImages);
        setOriginalImages(fetchedImages.map((img) => ({ ...img })));

        toast.success("Dữ liệu sản phẩm đã được tải thành công!", toastConfig);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          "Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau!",
          toastConfig
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedParent) {
      setChildCategories(
        categories.filter((cat) => cat.parentCategory?.id === selectedParent)
      );
    } else {
      setChildCategories([]);
      setProduct((prev) => ({ ...prev, categoryId: "" }));
    }
  }, [selectedParent, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleParentChange = (e) => {
    setSelectedParent(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle product details
  const handleDetailChange = (index, field, value) => {
    setProduct((prev) => {
      const updatedDetails = [...prev.details];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value,
      };
      return { ...prev, details: updatedDetails };
    });
  };

  const addDetail = () => {
    setProduct((prev) => ({
      ...prev,
      details: [...prev.details, { attributeName: "", attributeValue: "" }],
    }));
    toast.info("Đã thêm trường thông số mới", toastConfig);
  };

  const removeDetail = (index) => {
    setProduct((prev) => {
      const updatedDetails = prev.details.filter((_, i) => i !== index);
      return { ...prev, details: updatedDetails };
    });
    toast.info("Đã xóa trường thông số", toastConfig);
  };

  // Handle product descriptions
  const handleDescriptionChange = (index, value) => {
    setProduct((prev) => {
      const updatedDescriptions = [...prev.descriptions];
      updatedDescriptions[index] = {
        ...updatedDescriptions[index],
        content: value,
      };
      return { ...prev, descriptions: updatedDescriptions };
    });
  };

  const addDescription = () => {
    if (!newDescription.content.trim()) {
      toast.warning("Nội dung mô tả không được để trống!", toastConfig);
      return;
    }

    setProduct((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, { ...newDescription }],
    }));

    setNewDescription({ content: "" });
    toast.success("Đã thêm mô tả mới thành công", toastConfig);
  };

  const removeDescription = (index) => {
    setProduct((prev) => {
      const updatedDescriptions = prev.descriptions.filter(
        (_, i) => i !== index
      );
      return { ...prev, descriptions: updatedDescriptions };
    });
    toast.info("Đã xóa mô tả", toastConfig);
  };

  const addImage = () => {
    if (!imageUrl.trim()) {
      toast.warning("URL hình ảnh không được để trống!", toastConfig);
      return;
    }

    // Check if URL is valid
    try {
      new URL(imageUrl);
    } catch (e) {
      toast.error("URL hình ảnh không hợp lệ!", toastConfig);
      return;
    }

    setImages((prevImages) => {
      const hasPrimary = prevImages.some((img) => img.primary);
      return [
        ...prevImages,
        {
          url: imageUrl,
          altText: altText || imageUrl.split("/").pop(),
          primary: !hasPrimary,
          isNew: true,
        },
      ];
    });

    setImageUrl("");
    setAltText("");
    toast.success("Đã thêm hình ảnh mới", toastConfig);
  };

  const setPrimaryImage = (index) => {
    setImages((prevImages) =>
      prevImages.map((img, i) => ({
        ...img,
        primary: i === index,
      }))
    );
    toast.info("Đã đặt làm hình ảnh chính", toastConfig);
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));

    if (imageToRemove.primary && images.length > 1) {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        if (newImages.length > 0) {
          newImages[0].primary = true;
        }
        return newImages;
      });
    }
    toast.info("Đã xóa hình ảnh", toastConfig);
  };

  const handleImageUpdates = async () => {
    try {
      toast.info("Đang cập nhật hình ảnh...", toastConfig);

      const currentImageIds = images
        .filter((img) => !img.isNew)
        .map((img) => img.id);
      const deletedImages = originalImages.filter(
        (img) => !currentImageIds.includes(img.id)
      );

      await Promise.all(
        deletedImages.map((image) => axios.delete(`${IMAGE_API}/${image.id}`))
      );

      await Promise.all(
        images
          .filter((img) => !img.isNew)
          .map((image) => axios.put(`${IMAGE_API}/${image.id}`, image))
      );

      await Promise.all(
        images
          .filter((img) => img.isNew)
          .map((image) =>
            axios.post(`${IMAGE_API}/product/${id}`, {
              url: image.url,
              altText: image.altText,
              primary: image.primary,
            })
          )
      );

      toast.success("Cập nhật hình ảnh thành công", toastConfig);
      return true;
    } catch (error) {
      console.error("Error updating images:", error);
      toast.error("Lỗi khi cập nhật hình ảnh!", toastConfig);
      throw new Error("Lỗi khi cập nhật hình ảnh!");
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!product.name) errors.push("Tên sản phẩm");
    if (!product.sku) errors.push("SKU");
    if (!product.price) errors.push("Giá");
    if (!product.stockQuantity) errors.push("Số lượng trong kho");

    if (errors.length > 0) {
      toast.error(
        `Vui lòng điền đầy đủ các trường bắt buộc: ${errors.join(", ")}`,
        toastConfig
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      toast.info("Đang cập nhật sản phẩm...", toastConfig);

      // Filter out empty details
      const filteredDetails = product.details.filter(
        (detail) => detail.attributeName.trim() && detail.attributeValue.trim()
      );

      await axios.put(`${PRODUCTS_API}/${id}`, {
        ...product,
        category: product.categoryId ? { id: product.categoryId } : null,
        details: filteredDetails,
      });

      if (images.length > 0 || originalImages.length > 0) {
        await handleImageUpdates();
      }

      toast.success("Cập nhật sản phẩm thành công!", {
        ...toastConfig,
        onClose: () => navigate("/admin/products"),
      });
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi cập nhật sản phẩm!";
      toast.error(errorMessage, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product.id) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 3,
        mb: 5,
      }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Chỉnh sửa sản phẩm
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="fullWidth">
          <Tab
            label="Thông tin cơ bản"
            icon={<DescriptionIcon />}
            iconPosition="start"
          />
          <Tab
            label="Thông số kỹ thuật"
            icon={<SettingsIcon />}
            iconPosition="start"
          />
          <Tab label="Hình ảnh" icon={<ImageIcon />} iconPosition="start" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {/* Basic Info Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="SKU"
                  name="sku"
                  fullWidth
                  required
                  margin="normal"
                  value={product.sku || ""}
                  onChange={handleChange}
                  error={!product.sku}
                  helperText={!product.sku ? "SKU là bắt buộc" : ""}
                />

                <TextField
                  label="Thương hiệu"
                  name="tradeMark"
                  fullWidth
                  margin="normal"
                  value={product.tradeMark || ""}
                  onChange={handleChange}
                />
              </Box>

              <TextField
                label="Tên sản phẩm"
                name="name"
                fullWidth
                required
                margin="normal"
                value={product.name || ""}
                onChange={handleChange}
                error={!product.name}
                helperText={!product.name ? "Tên sản phẩm là bắt buộc" : ""}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Giá"
                  name="price"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  value={product.price || ""}
                  onChange={handleChange}
                  error={!product.price}
                  helperText={!product.price ? "Giá là bắt buộc" : ""}
                  InputProps={{ inputProps: { min: 0 } }}
                />

                <TextField
                  label="Số lượng trong kho"
                  name="stockQuantity"
                  type="number"
                  fullWidth
                  required
                  margin="normal"
                  value={product.stockQuantity || ""}
                  onChange={handleChange}
                  error={!product.stockQuantity}
                  helperText={
                    !product.stockQuantity ? "Số lượng là bắt buộc" : ""
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>

              <TextField
                label="Mô tả ngắn"
                name="description"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={product.description || ""}
                onChange={handleChange}
              />

              {/* Category selection */}
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Phân loại sản phẩm
                </Typography>

                <TextField
                  select
                  label="Danh mục cha"
                  fullWidth
                  margin="normal"
                  value={selectedParent}
                  onChange={handleParentChange}>
                  <MenuItem value="">-- Chọn danh mục cha --</MenuItem>
                  {parentCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>

                {selectedParent && (
                  <TextField
                    select
                    label="Danh mục con"
                    name="categoryId"
                    fullWidth
                    margin="normal"
                    value={product.categoryId || ""}
                    onChange={handleChange}>
                    <MenuItem value="">-- Chọn danh mục con --</MenuItem>
                    {childCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Box>

              {/* Product Descriptions */}
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Mô tả chi tiết sản phẩm
                </Typography>

                {product.descriptions.map((desc, index) => (
                  <Box key={index} sx={{ mb: 2, position: "relative" }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      margin="dense"
                      value={desc.content || ""}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      placeholder="Nhập nội dung mô tả chi tiết..."
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeDescription(index)}
                      aria-label="Xóa mô tả"
                      sx={{ position: "absolute", top: 8, right: 8 }}>
                      <DeleteIcon />
                    </IconButton>
                    {desc.id && (
                      <Chip
                        label={`ID: ${desc.id}`}
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                ))}

                <Box
                  sx={{ display: "flex", gap: 2, alignItems: "start", mt: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Thêm mô tả mới"
                    value={newDescription.content}
                    onChange={(e) =>
                      setNewDescription({ content: e.target.value })
                    }
                    placeholder="Nhập nội dung mô tả chi tiết mới..."
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={addDescription}
                    sx={{ mt: 1 }}>
                    Thêm
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Technical Details Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Thông số kỹ thuật
              </Typography>

              {product.details.map((detail, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <TextField
                    label="Tên thuộc tính"
                    fullWidth
                    margin="dense"
                    value={detail.attributeName || ""}
                    onChange={(e) =>
                      handleDetailChange(index, "attributeName", e.target.value)
                    }
                  />
                  <TextField
                    label="Giá trị"
                    fullWidth
                    margin="dense"
                    value={detail.attributeValue || ""}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "attributeValue",
                        e.target.value
                      )
                    }
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeDetail(index)}
                    aria-label="Xóa thuộc tính">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addDetail}
                sx={{ mt: 1, mb: 2 }}>
                Thêm thuộc tính
              </Button>
            </Box>
          )}

          {/* Image Management Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Quản lý hình ảnh
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="URL hình ảnh"
                  fullWidth
                  margin="normal"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  error={imageUrl && !imageUrl.trim()}
                  helperText={
                    imageUrl && !imageUrl.trim()
                      ? "URL hình ảnh không được để trống"
                      : ""
                  }
                />
                <TextField
                  label="Mô tả ảnh"
                  fullWidth
                  margin="normal"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </Box>

              <Button
                variant="outlined"
                color="primary"
                onClick={addImage}
                sx={{ mb: 3 }}>
                Thêm ảnh
              </Button>

              {images.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 2,
                    mt: 2,
                  }}>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 1,
                        border: image.primary
                          ? "2px solid #1976d2"
                          : "1px solid #ddd",
                        borderRadius: 1,
                      }}>
                      <img
                        src={image.url}
                        alt={image.altText || "Product image"}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "contain",
                          marginBottom: "8px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150?text=Image+Error";
                          toast.warning(
                            `Lỗi tải hình ảnh: ${image.url}`,
                            toastConfig
                          );
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}>
                        <Button
                          size="small"
                          onClick={() => setPrimaryImage(index)}
                          color={image.primary ? "primary" : "inherit"}
                          variant={image.primary ? "contained" : "text"}
                          sx={{ mb: 1 }}>
                          {image.primary ? "Ảnh chính" : "Đặt làm ảnh chính"}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeImage(index)}>
                          Xóa
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                toast.info("Đã hủy thao tác chỉnh sửa", toastConfig);
                navigate("/products");
              }}
              variant="outlined">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Cập nhật sản phẩm"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default ProductEdit;
