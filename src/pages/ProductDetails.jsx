import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Rating,
  Chip,
  Divider,
  IconButton,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  LocalShipping,
  Replay,
  Security,
} from '@mui/icons-material';
import { productAPI } from '../api/axios';
import { useCart } from '../hooks/contexts/CartContexts';
import { useWishlist } from '../hooks/contexts/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
      setSelectedImage(response.data.thumbnail);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showNotification(`Added ${quantity} ${product.title} to cart`, 'success');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showNotification('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showNotification('Added to wishlist', 'success');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center">
          <Typography>Loading product...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const features = [
    { icon: <LocalShipping />, label: 'Free Shipping', value: 'Available' },
    { icon: <Replay />, label: 'Returns', value: '30 Days Return' },
    { icon: <Security />, label: 'Warranty', value: '1 Year' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              component="img"
              src={selectedImage}
              alt={product.title}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'contain',
                borderRadius: 2,
                mb: 2,
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: selectedImage === image ? '2px solid' : '1px solid',
                    borderColor: selectedImage === image ? 'primary.main' : 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                ({product.rating} • {product.reviews?.length || 0} reviews)
              </Typography>
              <Chip
                label={product.brand}
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
              Category: {product.category}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary" gutterBottom>
                ${product.price}
              </Typography>
              {product.discountPercentage > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </Typography>
                  <Chip
                    label={`Save ${product.discountPercentage}%`}
                    color="error"
                    size="small"
                  />
                </Box>
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Features */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.label}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {feature.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                color={product.stock > 10 ? 'success.main' : 'warning.main'}
              >
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </Typography>
            </Box>

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <Typography variant="body1">Quantity:</Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100 }}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Max: {product.stock}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                sx={{ flex: 1, minWidth: 200 }}
              >
                Add to Cart
              </Button>
              <IconButton
                size="large"
                onClick={handleWishlistToggle}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                {isWishlisted ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
              <Button
                variant="outlined"
                size="large"
                sx={{ flex: 1, minWidth: 200 }}
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Additional Details */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Product Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>Brand:</strong> {product.brand}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Stock:</strong> {product.stock} units available
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>SKU:</strong> {product.id}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Dimensions:</strong> {product.dimensions?.width || 'N/A'} x{' '}
                  {product.dimensions?.height || 'N/A'} x{' '}
                  {product.dimensions?.depth || 'N/A'}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Weight:</strong> {product.weight || 'N/A'}g
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails;