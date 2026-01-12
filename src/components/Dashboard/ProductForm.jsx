import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Box,
  IconButton,
  Divider,
  Paper,
  Alert,
  Collapse,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  AddPhotoAlternate,
  Error as ErrorIcon 
} from '@mui/icons-material';

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
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');
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

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

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
    let isValid = true;
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    if (!isValid) {
      setFormError('Please fix the errors in the form');
    } else {
      setFormError('');
    }
    
    return isValid;
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
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
      if (formError && !error) {
        // Clear form error if this field is now valid
        const hasOtherErrors = Object.keys(errors).some(
          key => key !== name && errors[key]
        );
        if (!hasOtherErrors) {
          setFormError('');
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateField = (fieldName, value) => {
    const trimmedValue = String(value).trim();
    
    switch (fieldName) {
      case 'title':
        if (!trimmedValue) return 'Title is required';
        if (trimmedValue.length < 3) return 'Title must be at least 3 characters';
        if (trimmedValue.length > 100) return 'Title must be less than 100 characters';
        return '';
      
      case 'description':
        if (!trimmedValue) return 'Description is required';
        if (trimmedValue.length < 10) return 'Description must be at least 10 characters';
        if (trimmedValue.length > 500) return 'Description must be less than 500 characters';
        return '';
      
      case 'price':
        if (!trimmedValue) return 'Price is required';
        const price = parseFloat(trimmedValue);
        if (isNaN(price)) return 'Price must be a valid number';
        if (price < 0) return 'Price cannot be negative';
        if (price > 999999) return 'Price is too high';
        return '';
      
      case 'discountPercentage':
        if (trimmedValue) {
          const discount = parseFloat(trimmedValue);
          if (isNaN(discount)) return 'Discount must be a valid number';
          if (discount < 0 || discount > 100) return 'Discount must be between 0 and 100';
        }
        return '';
      
      case 'stock':
        if (!trimmedValue) return 'Stock is required';
        const stock = parseInt(trimmedValue);
        if (isNaN(stock)) return 'Stock must be a valid number';
        if (stock < 0) return 'Stock cannot be negative';
        return '';
      
      case 'rating':
        if (trimmedValue) {
          const rating = parseFloat(trimmedValue);
          if (isNaN(rating)) return 'Rating must be a valid number';
          if (rating < 0 || rating > 5) return 'Rating must be between 0 and 5';
        }
        return '';
      
      case 'category':
        if (!trimmedValue) return 'Category is required';
        return '';
      
      case 'brand':
        if (!trimmedValue) return 'Brand is required';
        return '';
      
      case 'thumbnail':
        if (!trimmedValue) return 'Image URL is required';
        try {
          new URL(trimmedValue);
        } catch {
          return 'Please enter a valid URL';
        }
        return '';
      
      default:
        return '';
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    if (touched.thumbnail && !errors.thumbnail) {
      setErrors(prev => ({ 
        ...prev, 
        thumbnail: 'Image failed to load. Please check the URL.' 
      }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        bgcolor: '#1976d2',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        py: 2.5,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Box>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Collapse in={!!formError}>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              icon={<ErrorIcon />}
              onClose={() => setFormError('')}
            >
              {formError}
            </Alert>
          </Collapse>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Image Section */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: '#333' }}>
                Product Image
              </Typography>
              <Paper
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  p: 3,
                  bgcolor: '#f5f5f5',
                  border: getFieldError('thumbnail') ? '2px solid #d32f2f' : '2px dashed #1976d2',
                  borderRadius: 1.5,
                }}
              >
                {formData.thumbnail ? (
                  <Box
                    component="img"
                    src={formData.thumbnail}
                    alt="Product thumbnail"
                    onError={handleImageError}
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '2px solid #1976d2',
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <AddPhotoAlternate sx={{ fontSize: 48, color: '#1976d2', opacity: 0.6, mb: 1 }} />
                    <Typography variant="caption" color="textSecondary">
                      Enter image URL below
                    </Typography>
                  </Box>
                )}
              </Paper>
              <TextField
                fullWidth
                name="thumbnail"
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!getFieldError('thumbnail')}
                helperText={getFieldError('thumbnail')}
                size="small"
                sx={{ mt: 1.5 }}
                InputProps={{
                  endAdornment: getFieldError('thumbnail') && (
                    <ErrorIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
                  ),
                }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Basic Information */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: '#333' }}>
                Basic Information
              </Typography>
              <TextField
                fullWidth
                name="title"
                label="Product Title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!getFieldError('title')}
                helperText={getFieldError('title')}
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: getFieldError('title') && (
                    <ErrorIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
                  ),
                }}
              />

              <TextField
                fullWidth
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!getFieldError('description')}
                helperText={getFieldError('description')}
                multiline
                rows={3}
                size="small"
                InputProps={{
                  endAdornment: getFieldError('description') && (
                    <ErrorIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
                  ),
                }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Classification */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: '#333' }}>
                Classification
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <FormControl fullWidth size="small" error={!!getFieldError('category')}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                  {getFieldError('category') && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorIcon sx={{ fontSize: 16 }} />
                      {getFieldError('category')}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth size="small" error={!!getFieldError('brand')}>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Brand"
                  >
                    <MenuItem value="">
                      <em>Select Brand</em>
                    </MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                  {getFieldError('brand') && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorIcon sx={{ fontSize: 16 }} />
                      {getFieldError('brand')}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Pricing */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: '#333' }}>
                Pricing
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField
                  fullWidth
                  name="price"
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError('price')}
                  helperText={getFieldError('price')}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: '$',
                    endAdornment: getFieldError('price') && (
                      <ErrorIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="discountPercentage"
                  label="Discount (%)"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError('discountPercentage')}
                  helperText={getFieldError('discountPercentage')}
                  size="small"
                  inputProps={{ min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: '%',
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Inventory & Rating */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: '#333' }}>
                Inventory & Rating
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField
                  fullWidth
                  name="stock"
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError('stock')}
                  helperText={getFieldError('stock')}
                  size="small"
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: getFieldError('stock') && (
                      <ErrorIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="rating"
                  label="Rating (0-5)"
                  type="number"
                  value={formData.rating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!getFieldError('rating')}
                  helperText={getFieldError('rating')}
                  size="small"
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1, bgcolor: '#fafafa', position: 'sticky', bottom: 0 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              bgcolor: '#1976d2',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#1565c0' },
              '&:disabled': { bgcolor: '#b0bec5' }
            }}
            disabled={Object.keys(errors).some(key => errors[key]) || !formData.title || !formData.description || !formData.price || !formData.stock || !formData.category || !formData.brand || !formData.thumbnail}
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;