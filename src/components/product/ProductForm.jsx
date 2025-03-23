import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Divider,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

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

  const [productDetails, setProductDetails] = useState([]);
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const [productDescriptions, setProductDescriptions] = useState([]);
  const [descriptionText, setDescriptionText] = useState("");

  const addDescription = () => {
    if (descriptionText.trim() !== "") {
      setProductDescriptions([
        ...productDescriptions,
        { content: descriptionText },
      ]);
      setDescriptionText("");
    }
  };

  const removeDescription = (index) => {
    setProductDescriptions(productDescriptions.filter((_, i) => i !== index));
  };

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
    setFormData({ ...formData, category: "" });
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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addProductDetail = () => {
    if (attributeName && attributeValue) {
      setProductDetails([...productDetails, { attributeName, attributeValue }]);
      setAttributeName("");
      setAttributeValue("");
    }
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
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        category: { id: formData.category },
        details: productDetails,
        descriptions: productDescriptions,
      });

      const productId = res.data.id;
      if (productId && images.length > 0) {
        await uploadProductImages(productId);
      }

      toast.success("Thêm sản phẩm thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/products"), 3000);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Thêm sản phẩm thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 3, mb: 6 }}>
      <ToastContainer />

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          sx={{ mb: 3, fontWeight: 600 }}>
          Thêm sản phẩm mới
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 500 }}>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tên sản phẩm"
                name="name"
                fullWidth
                required
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Thương hiệu"
                name="tradeMark"
                fullWidth
                required
                variant="outlined"
                value={formData.tradeMark}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Giá"
                name="price"
                type="number"
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  endAdornment: <Typography variant="body2">VNĐ</Typography>,
                }}
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="SKU"
                name="sku"
                fullWidth
                required
                variant="outlined"
                value={formData.sku}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Số lượng trong kho"
                name="stockQuantity"
                type="number"
                fullWidth
                required
                variant="outlined"
                value={formData.stockQuantity}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.checked })
                    }
                    name="available"
                    color="primary"
                  />
                }
                label="Sẵn có để bán"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mô tả chính"
                name="description"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Categories */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 500, mt: 2 }}>
                Danh mục
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Danh mục cha"
                fullWidth
                variant="outlined"
                value={selectedParent}
                onChange={handleParentChange}>
                <MenuItem value="">-- Chọn danh mục cha --</MenuItem>
                {parentCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              {selectedParent && (
                <TextField
                  select
                  label="Danh mục con"
                  name="category"
                  fullWidth
                  required
                  variant="outlined"
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
            </Grid>

            {/* Additional Descriptions */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 500, mt: 2 }}>
                Mô tả bổ sung
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TextField
                  label="Nhập mô tả khác"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addDescription}
                  startIcon={<AddCircleIcon />}
                  sx={{ mt: 1, height: 56 }}>
                  Thêm
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                {productDescriptions.map((desc, index) => (
                  <Chip
                    key={index}
                    label={desc.content}
                    onDelete={() => removeDescription(index)}
                    color="primary"
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Product Attributes/Details */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 500, mt: 2 }}>
                Thuộc tính sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={5}>
              <TextField
                label="Tên thuộc tính"
                fullWidth
                variant="outlined"
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                label="Giá trị thuộc tính"
                fullWidth
                variant="outlined"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={addProductDetail}
                fullWidth
                startIcon={<AddCircleIcon />}
                sx={{ height: 56 }}>
                Thêm
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={1}>
                {productDetails.map((detail, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      <Typography variant="body2">
                        <strong>{detail.attributeName}:</strong>{" "}
                        {detail.attributeValue}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          setProductDetails(
                            productDetails.filter((_, i) => i !== index)
                          )
                        }>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Product Images */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 500, mt: 2 }}>
                Hình ảnh sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={5}>
              <TextField
                label="URL hình ảnh"
                fullWidth
                variant="outlined"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                label="Mô tả ảnh"
                fullWidth
                variant="outlined"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={addImage}
                fullWidth
                startIcon={<AddCircleIcon />}
                sx={{ height: 56 }}>
                Thêm
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card elevation={2}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={image.url}
                        alt={image.altText}
                        sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}>
                          <IconButton
                            color={image.primary ? "warning" : "default"}
                            onClick={() => setPrimaryImage(index)}
                            size="small"
                            title={
                              image.primary ? "Ảnh chính" : "Chọn làm ảnh chính"
                            }>
                            {image.primary ? <StarIcon /> : <StarBorderIcon />}
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => removeImage(index)}
                            size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                }}>
                Thêm sản phẩm
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default ProductForm;
