import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const API_URL = "http://localhost:8080/api/products";
const CATEGORY_API_URL = "http://localhost:8080/api/categories";

function ProductForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    sku: "",
    tradeMark: "",
    category: "",
    available: true,
  });

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");

  useEffect(() => {
    axios
      .get(CATEGORY_API_URL)
      .then((res) => {
        const parentCats = res.data.filter(
          (cat) => cat.parentCategory === null
        );
        setParentCategories(parentCats);
        setCategories(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);
    const children = categories.filter(
      (cat) => cat.parentCategory?.id === parentId
    );
    setChildCategories(children);
    setFormData({ ...formData, category: "" }); // Reset danh mục con
  };

  const addImage = () => {
    if (!imageUrl) return;
    setImages([
      ...images,
      { url: imageUrl, altText, primary: images.length === 0 },
    ]);
    setImageUrl("");
    setAltText("");
  };

  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      primary: i === index,
    }));
    setImages(updatedImages);
  };

  const uploadProductImages = async (productId) => {
    try {
      await Promise.all(
        images.map((image) =>
          axios.post(
            `http://localhost:8080/api/product-images/product/${productId}`,
            image
          )
        )
      );
      console.log("Tất cả hình ảnh đã được tải lên");
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, {
        ...formData,
        category: { id: formData.category },
      });

      const productId = res.data.id;
      if (productId && images.length > 0) {
        await uploadProductImages(productId);
      }

      // ✅ Hiển thị thông báo thành công
      toast.success("Thêm sản phẩm thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => {
        navigate("/products");
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);

      // ❌ Hiển thị thông báo lỗi
      toast.error("Thêm sản phẩm thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 3 }}>
      {/* Thêm ToastContainer vào đây */}
      <ToastContainer />

      <Typography variant="h5" gutterBottom>
        Thêm sản phẩm mới
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên sản phẩm"
          name="name"
          fullWidth
          required
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Mô tả"
          name="description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          label="Giá"
          name="price"
          type="number"
          fullWidth
          required
          margin="normal"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          label="Thương hiệu"
          name="tradeMark"
          fullWidth
          required
          margin="normal"
          value={formData.tradeMark}
          onChange={handleChange}
        />
        <TextField
          label="Số lượng trong kho"
          name="stockQuantity"
          type="number"
          fullWidth
          required
          margin="normal"
          value={formData.stockQuantity}
          onChange={handleChange}
        />
        <TextField
          label="SKU"
          name="sku"
          fullWidth
          required
          margin="normal"
          value={formData.sku}
          onChange={handleChange}
        />

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
            name="category"
            fullWidth
            required
            margin="normal"
            value={formData.category}
            onChange={handleChange}>
            <MenuItem value="">-- Chọn danh mục con --</MenuItem>
            {childCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* Input thêm ảnh */}
        <TextField
          label="URL hình ảnh"
          fullWidth
          margin="normal"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <TextField
          label="Mô tả ảnh"
          fullWidth
          margin="normal"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
        <Button variant="outlined" color="primary" onClick={addImage}>
          Thêm ảnh
        </Button>

        {images.map((image, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <img
              src={image.url}
              alt={image.altText}
              width={50}
              height={50}
              style={{ marginRight: 10 }}
            />
            <Button onClick={() => setPrimaryImage(index)}>
              {image.primary ? "Ảnh chính" : "Chọn làm ảnh chính"}
            </Button>
          </Box>
        ))}

        <Button type="submit" variant="contained" color="primary">
          Thêm sản phẩm
        </Button>
      </form>
    </Box>
  );
}

export default ProductForm;
