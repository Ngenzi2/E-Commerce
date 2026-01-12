import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, AddPhotoAlternate } from '@mui/icons-material';

const ProductForm = ({ open, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    rating: '',
    stock: '',
    brand: '',
    category: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [categories] = useState([
    'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries',
    'home-decoration', 'furniture', 'tops', 'womens-dresses',
    'womens-shoes', 'mens-shirts', 'mens-shoes', 'mens-watches',
    'womens-watches', 'womens-bags', 'womens-jewellery',
    'sunglasses', 'automotive', 'motorcycle', 'lighting'
  ]);

  const brands = [
    'Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus',
    'Dell', 'HP', 'Sony', 'LG', 'Google', 'Xiaomi',
    'OnePlus', 'Nokia', 'OPPO', 'Vivo', 'Realme',
    'Puma', 'Nike', 'Adidas', 'Reebok', 'Zara'
  ];

  useEffect(() => {
    const defaultFormData = {
      title: '',
      description: '',
      price: '',
      discountPercentage: '',
      rating: '',
      stock: '',
      brand: '',
      category: '',
      thumbnail: '',
    };

    const newFormData = initialData ? {
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price || '',
      discountPercentage: initialData.discountPercentage || '',
      rating: initialData.rating || '',
      stock: initialData.stock || '',
      brand: initialData.brand || '',
      category: initialData.category || '',
      thumbnail: initialData.thumbnail || '',
    } : defaultFormData;

    setFormData(newFormData);
    setErrors({});
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'Discount must be between 0 and 100';
    }
    if (!formData.rating || formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Stock must be non-negative';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.thumbnail.trim()) newErrors.thumbnail = 'Thumbnail URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Product Image */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                {formData.thumbnail ? (
                  <Box
                    component="img"
                    src={formData.thumbnail}
                    alt="Product thumbnail"
                    sx={{
                      width: 200,
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                    }}
                  >
                    <AddPhotoAlternate sx={{ fontSize: 48, color: 'action.active' }} />
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">
                  Product Thumbnail Preview
                </Typography>
              </Box>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                name="title"
                label="Product Title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
                margin="normal"
              />
              
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>

            {/* Pricing & Stock */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="price"
                label="Price ($)"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
                margin="normal"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
              
              <TextField
                fullWidth
                name="discountPercentage"
                label="Discount (%)"
                type="number"
                value={formData.discountPercentage}
                onChange={handleChange}
                error={!!errors.discountPercentage}
                helperText={errors.discountPercentage}
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>

            {/* Category & Brand */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category *"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={!!errors.brand}>
                <InputLabel>Brand *</InputLabel>
                <Select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  label="Brand *"
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
                {errors.brand && (
                  <Typography variant="caption" color="error">
                    {errors.brand}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Rating & Stock */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="rating"
                label="Rating (0-5)"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                error={!!errors.rating}
                helperText={errors.rating}
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 5, step: 0.1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="stock"
                label="Stock Quantity"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Thumbnail URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="thumbnail"
                label="Thumbnail Image URL"
                value={formData.thumbnail}
                onChange={handleChange}
                error={!!errors.thumbnail}
                helperText={errors.thumbnail || 'Enter a valid image URL'}
                required
                margin="normal"
              />
            </Grid>

            {/* Preview Note */}
            {formData.thumbnail && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Make sure the image URL is valid. You can use placeholder images from{' '}
                    <a 
                      href="https://picsum.photos" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
                      Picsum Photos
                    </a>{' '}
                    or similar services.
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;