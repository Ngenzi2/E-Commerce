import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { productAPI } from '../api/axios';
import ProductCard from '../components/Products/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Unified effect for fetching products with smart debouncing
  useEffect(() => {
    // Only debounce when user is actively typing (searchQuery has value)
    // For category/sort changes or empty search, execute immediately
    const delay = searchQuery.trim() ? 500 : 0;

    const timer = setTimeout(() => {
      fetchProducts();
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy, order]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      let productsData = [];
      
      // Ensure category name is lowercase for API calls (DummyJSON API expects lowercase)
      const categorySlug = selectedCategory ? selectedCategory.toLowerCase() : '';
      
      // If both search and category are selected, fetch by category then filter by search
      if (searchQuery.trim() && categorySlug) {
        // Fetch products by category first (use lowercase slug)
        response = await productAPI.getByCategory(categorySlug);
        productsData = response.data?.products || response.data || [];
        
        // Filter products by search query (client-side filtering)
        const searchLower = searchQuery.trim().toLowerCase();
        productsData = productsData.filter(product => 
          product.title?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
        );
      } else if (searchQuery.trim()) {
        // Perform global search using the search API
        response = await productAPI.search(searchQuery.trim());
        productsData = response.data?.products || response.data || [];
        
        // If category is also selected, filter by category
        if (categorySlug) {
          productsData = productsData.filter(product => 
            product.category?.toLowerCase() === categorySlug
          );
        }
      } else if (categorySlug) {
        // Fetch products by category - API returns { products: [...] }
        // Use lowercase slug for API call
        response = await productAPI.getByCategory(categorySlug);
        productsData = response.data?.products || response.data || [];
      } else {
        // Fetch all products with sorting
        response = await productAPI.getAll({
          sortBy,
          order,
        });
        productsData = response.data?.products || response.data || [];
      }
      
      // Apply client-side sorting if needed (for category/search results)
      if ((searchQuery.trim() || selectedCategory) && sortBy) {
        productsData = [...productsData].sort((a, b) => {
          let aValue, bValue;
          
          switch (sortBy) {
            case 'price':
              aValue = a.price || 0;
              bValue = b.price || 0;
              break;
            case 'rating':
              aValue = a.rating || 0;
              bValue = b.rating || 0;
              break;
            case 'title':
            default:
              aValue = (a.title || '').toLowerCase();
              bValue = (b.title || '').toLowerCase();
              break;
          }
          
          if (order === 'asc') {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        });
      }
      
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      // Handle both array of strings and array of objects
      const categoryData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Don't clear category - allow searching within category
  };

  const handleCategoryClick = (category) => {
    const categoryName = typeof category === 'string' ? category : category.name || category.slug || '';
    // Store category in lowercase (as API expects lowercase)
    const categoryLower = categoryName.toLowerCase();
    const newCategory = categoryLower === selectedCategory ? '' : categoryLower;
    setSelectedCategory(newCategory);
    // Don't clear search - allow filtering search results by category
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Products
      </Typography>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              position: 'sticky',
              top: 20,
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Filter & Sort
            </Typography>

            {/* Search Section */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Search products"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Type to search globally..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 2 }}
              />
              {searchQuery && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {selectedCategory 
                    ? `Searching in ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}: "${searchQuery}"`
                    : `Searching for: "${searchQuery}"`
                  }
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Sort Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Sort By
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort Field</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort Field"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={order}
                  label="Order"
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Categories Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Categories
              </Typography>
              {selectedCategory && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Filtered: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
                    color="primary"
                    onDelete={() => handleCategoryClick(selectedCategory)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categories.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading categories...
                  </Typography>
                ) : (
                  categories.map((category) => {
                    const categoryName = typeof category === 'string' ? category : category.name || category.slug || '';
                    const categoryKey = typeof category === 'string' ? category : category.slug || category.name || '';
                    // Compare using lowercase since selectedCategory is stored in lowercase
                    const isSelected = selectedCategory === categoryName.toLowerCase();
                    return (
                      <Chip
                        key={categoryKey}
                        label={categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                        clickable
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => handleCategoryClick(categoryName)}
                        sx={{
                          justifyContent: 'flex-start',
                          height: 'auto',
                          py: 1,
                          fontWeight: isSelected ? 600 : 400,
                          '&:hover': {
                            backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                          },
                        }}
                      />
                    );
                  })
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <Typography variant="h6" color="text.secondary">
                Loading products...
              </Typography>
            </Box>
          ) : products.length === 0 ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              {selectedCategory && (
                <Typography variant="body2" color="text.secondary">
                  Try selecting a different category or clearing the filter
                </Typography>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;