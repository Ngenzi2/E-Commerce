import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  ArrowForward,
  LocalShipping,
  Security,
  Replay,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/axios'
import { useCart } from '../hooks/contexts/CartContexts';
import { useWishlist } from '../hooks/contexts/WishlistContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ limit: 8, skip: 0 });
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      // Handle both array of strings and array of objects
      const categoryData = Array.isArray(response.data) ? response.data : response.data.slice(0, 6);
      const categoryNames = categoryData.map(cat => typeof cat === 'string' ? cat : cat.name || cat).slice(0, 6);
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show notification or feedback
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const services = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: <Replay sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#f8f9fa',
          py: { xs: 6, md: 10 },
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#1a1a1a',
                  fontSize: { xs: '2rem', md: '2.8rem' },
                }}
              >
                Your Online Shopping Hub
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Discover thousands of products from top brands. Shop with confidence and enjoy fast shipping, easy returns, and 24/7 customer support.
              </Typography>

              {/* Search Box */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 1,
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={handleSearch}
                          sx={{
                            textTransform: 'none',
                            color: 'white',
                            backgroundColor: theme.palette.primary.main,
                            px: 2,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          Search
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1.5,
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Shop All Products
                </Button>
                <Button
                  component={Link}
                  to="/products"
                  variant="outlined"
                  size="large"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1.5,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: '#f0f7ff',
                    },
                  }}
                >
                  Browse Categories
                </Button>
              </Stack>
            </Grid>

            {/* Hero Image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Shopping"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {service.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#1a1a1a',
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#999',
                    fontWeight: 400,
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      {categories.length > 0 && (
        <Box sx={{ backgroundColor: '#f8f9fa', py: 6, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: '#1a1a1a',
              }}
            >
              Shop by Category
            </Typography>
            <Grid container spacing={2}>
              {categories.map((category, index) => (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
                  <Card
                    component={Link}
                    to={`/products?category=${category}`}
                    sx={{
                      textDecoration: 'none',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        transform: 'translateY(-4px)',
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        fontSize: '1.8rem',
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {category.charAt(0).toUpperCase()}
                    </Box>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: '#1a1a1a',
                        textTransform: 'capitalize',
                      }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            Featured Products
          </Typography>
          <Button
            component={Link}
            to="/products"
            sx={{
              textTransform: 'none',
              color: theme.palette.primary.main,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            endIcon={<ArrowForward />}
          >
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
              <Card
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                {/* Product Image */}
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    height: 250,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.thumbnail || 'https://via.placeholder.com/250x250?text=No+Image'}
                    alt={product.title}
                    sx={{
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      transform: hoveredProductId === product.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />

                  {/* Wishlist Button */}
                  <IconButton
                    onClick={() => handleWishlistToggle(product)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isInWishlist(product.id) ? (
                      <Favorite sx={{ color: theme.palette.error.main }} />
                    ) : (
                      <FavoriteBorder sx={{ color: '#999' }} />
                    )}
                  </IconButton>

                  {/* Discount Badge */}
                  {product.discountPercentage > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: theme.palette.error.main,
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      -{product.discountPercentage}%
                    </Box>
                  )}
                </Box>

                {/* Product Info */}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#999',
                      fontSize: '0.85rem',
                      mb: 0.5,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {product.category}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: '#1a1a1a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.8em',
                    }}
                  >
                    {product.title}
                  </Typography>

                  {/* Rating */}
                  {product.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#ffc107',
                          mr: 0.5,
                        }}
                      >
                        ★ {product.rating.toFixed(1)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#999',
                          fontSize: '0.85rem',
                        }}
                      >
                        ({product.reviews?.length || Math.floor(Math.random() * 100)} reviews)
                      </Typography>
                    </Box>
                  )}

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                    </Typography>
                    {product.discountPercentage > 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#999',
                          textDecoration: 'line-through',
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                {/* Add to Cart Button */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleAddToCart(product)}
                    startIcon={<ShoppingCart />}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Ready to Start Shopping?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: '1.05rem',
            }}
          >
            Browse our complete collection and find exactly what you're looking for.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              textTransform: 'none',
              fontSize: '1rem',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            endIcon={<ArrowForward />}
          >
            Shop Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;