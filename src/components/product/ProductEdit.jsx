import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8080/api/products";
const CATEGORY_API = "http://localhost:8080/api/categories";
const IMAGE_API = "http://localhost:8080/api/product-images";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");

  const [product, setProduct] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    tradeMark: "",
    stockQuantity: "",
    categoryId: "",
  });

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");

  useEffect(() => {
    axios.get(CATEGORY_API).then((res) => {
      setCategories(res.data);
      setParentCategories(res.data.filter((cat) => !cat.parentCategory));
    });

    axios.get(`${API_URL}/${id}`).then((res) => {
      const productData = res.data;
      setProduct(productData);
      if (productData.category?.parentCategory) {
        setSelectedParent(productData.category.parentCategory.id);
      }
    });

    axios.get(`${IMAGE_API}/product/${id}`).then((res) => {
      setImages(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (selectedParent) {
      setChildCategories(
        categories.filter((cat) => cat.parentCategory?.id === selectedParent)
      );
    } else {
      setChildCategories([]);
    }
  }, [selectedParent, categories]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    setSelectedParent(e.target.value);
    setProduct({ ...product, categoryId: "" });
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;

    setImages((prevImages) => {
      const hasPrimary = prevImages.some((img) => img.primary);

      return [
        ...prevImages,
        {
          url: imageUrl,
          altText,
          primary: prevImages.length === 0 || !hasPrimary,
        },
      ];
    });

    setImageUrl("");
    setAltText("");
  };

  const setPrimaryImage = (index) => {
    setImages((prevImages) =>
      prevImages.map((img, i) => ({
        ...img,
        primary: i === index, // Ảnh được chọn trở thành ảnh chính
      }))
    );
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadProductImages = async () => {
    try {
      await Promise.all(
        images.map((image) => axios.post(`${IMAGE_API}/product/${id}`, image))
      );
      toast.success("Cập nhật hình ảnh thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật hình ảnh!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id}`, {
        ...product,
        category: { id: product.categoryId },
      });

      if (images.length > 0) {
        await uploadProductImages();
      }

      toast.success("Cập nhật sản phẩm thành công!");
      setTimeout(() => navigate("/products"), 2000);
    } catch (error) {
      toast.error("Lỗi khi cập nhật sản phẩm!");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <Typography variant="h5" gutterBottom>
        Chỉnh sửa sản phẩm
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="SKU"
          name="sku"
          fullWidth
          required
          margin="normal"
          value={product.sku}
          onChange={handleChange}
        />
        <TextField
          label="Tên sản phẩm"
          name="name"
          fullWidth
          required
          margin="normal"
          value={product.name}
          onChange={handleChange}
        />
        <TextField
          label="Mô tả"
          name="description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={product.description}
          onChange={handleChange}
        />
        <TextField
          label="Giá"
          name="price"
          type="number"
          fullWidth
          required
          margin="normal"
          value={product.price}
          onChange={handleChange}
        />
        <TextField
          label="Số lượng trong kho"
          name="stockQuantity"
          type="number"
          fullWidth
          required
          margin="normal"
          value={product.stockQuantity}
          onChange={handleChange}
        />
        <TextField
          label="Thương hiệu"
          name="tradeMark"
          fullWidth
          required
          margin="normal"
          value={product.tradeMark}
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
            name="categoryId"
            fullWidth
            required
            margin="normal"
            value={product.categoryId}
            onChange={handleChange}>
            <MenuItem value="">-- Chọn danh mục con --</MenuItem>
            {childCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}

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
            <Button color="error" onClick={() => removeImage(index)}>
              Xóa
            </Button>
          </Box>
        ))}

        <Button type="submit" variant="contained" color="primary">
          Cập nhật sản phẩm
        </Button>
      </form>
    </Box>
  );
}

export default ProductEdit;
