import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  TablePagination,
  TextField,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  Sync as SyncIcon,
  CloudOff as CloudOffIcon,
} from '@mui/icons-material';
import { useProduct } from './ProductContext'; // Adjust path as needed

const ProductTable = () => {
  // Use ProductContext for state management
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    searchProducts,
    getProductById,
    syncLocalProducts,
    clearError,
  } = useProduct();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [searchMode, setSearchMode] = useState('local'); // 'local' or 'api'
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle API search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() && searchMode === 'api') {
        handleApiSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchMode]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleView = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        const success = await deleteProduct(selectedProduct.id);
        if (success) {
          showSnackbar('Product deleted successfully!', 'success');
        } else {
          showSnackbar('Product deleted locally (API failed)', 'warning');
        }
      } catch (error) {
        showSnackbar('Error deleting product', 'error');
      }
    }
    handleMenuClose();
  };

  const handleApiSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = async () => {
    await fetchProducts();
    showSnackbar('Products refreshed from API', 'success');
  };

  const handleSyncLocalProducts = async () => {
    await syncLocalProducts();
    showSnackbar('Local products synced with API', 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    if (error) clearError();
  };

  // Determine which products to display
  const displayProducts = searchTerm.trim() && searchMode === 'api' 
    ? searchResults 
    : products;

  // Filter locally if in local search mode
  const filteredProducts = searchTerm.trim() && searchMode === 'local'
    ? displayProducts.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : displayProducts;

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchModeChange = (event) => {
    setSearchMode(event.target.checked ? 'api' : 'local');
    setPage(0);
    if (!event.target.checked) {
      setSearchResults([]);
    }
  };

  if (loading && products.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading products...</Typography>
      </Box>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add your first product using the "Add Product" button
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh from API
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with search and controls */}
      <Paper sx={{ mb: 3, p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products by name, brand, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
          
          <Tooltip title="Refresh products from API">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sync local products with API">
            <IconButton onClick={handleSyncLocalProducts} color="secondary">
              <SyncIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={searchMode === 'api'}
                onChange={handleSearchModeChange}
                size="small"
              />
            }
            label="API Search"
          />
          
          <Typography variant="body2" color="text.secondary">
            {searchMode === 'api' ? 'Searching across API and local products' : 'Searching local products only'}
          </Typography>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Loading Overlay for table operations */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && products.length > 0}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Product Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Product</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Price</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Stock</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Rating</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Discount</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Category</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow
                key={product.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {product.thumbnail ? (
                      <Box
                        component="img"
                        src={product.thumbnail}
                        alt={product.title}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                        }}
                      >
                        <ImageIcon color="action" />
                      </Box>
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {product.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.brand}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ${product.price}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={product.stock || 'N/A'}
                    size="small"
                    color={product.stock > 10 ? 'success' : product.stock === 0 ? 'default' : 'warning'}
                    variant={product.stock === 0 ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                      {product.rating || 'N/A'}
                    </Typography>
                    {product.rating && <Box sx={{ color: 'warning.main' }}>★</Box>}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {product.discountPercentage > 0 ? (
                    <Chip
                      label={`${product.discountPercentage}%`}
                      size="small"
                      color="error"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={product.category}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  {product.isLocal ? (
                    <Tooltip title="Local product - not synced with API">
                      <Chip
                        icon={<CloudOffIcon />}
                        label="Local"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </Tooltip>
                  ) : (
                    <Chip
                      label="Synced"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedProduct(product);
                          setViewDialogOpen(true);
                        }}
                        sx={{ color: '#1976d2' }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditDialogOpen(true);
                        }}
                        sx={{ color: '#f57c00' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, product)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />

      {/* Search Indicator */}
      {isSearching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Searching API...
          </Typography>
        </Box>
      )}

      {/* Product Menu */}
      {selectedProduct && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleView}>
            <ViewIcon fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Product
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete Product
          </MenuItem>
        </Menu>
      )}

      {/* View Product Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              Product Details
              {selectedProduct.isLocal && (
                <Chip
                  label="Local Product"
                  size="small"
                  color="warning"
                  sx={{ ml: 2 }}
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Box
                  component="img"
                  src={selectedProduct.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={selectedProduct.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'contain',
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedProduct.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedProduct.description || 'No description available'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Brand
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.brand || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.category}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">
                    ${selectedProduct.price}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Discount
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.discountPercentage || 0}%
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.rating || 'N/A'} ⭐
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Stock
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.stock || 'N/A'} units
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
                    {selectedProduct.id}
                    {selectedProduct.isLocal && ' (Local)'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setViewDialogOpen(false);
                  setEditDialogOpen(true);
                }}
              >
                Edit Product
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <EditProductForm
            product={selectedProduct}
            onClose={() => setEditDialogOpen(false)}
            onSave={async (updatedProduct) => {
              try {
                await updateProduct(selectedProduct.id, updatedProduct);
                showSnackbar('Product updated successfully!', 'success');
                setEditDialogOpen(false);
              } catch (error) {
                showSnackbar('Error updating product', 'error');
              }
            }}
          />
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Edit Product Form Component
const EditProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    brand: product.brand || '',
    price: product.price || '',
    stock: product.stock || '',
    rating: product.rating || '',
    discountPercentage: product.discountPercentage || '',
    category: product.category || '',
    description: product.description || '',
    thumbnail: product.thumbnail || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        Edit Product
        {product.isLocal && (
          <Chip
            label="Local Product"
            size="small"
            color="warning"
            sx={{ ml: 2 }}
          />
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
            />
            
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
            />
            
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
            />
            
            <TextField
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: 0.1, min: 0, max: 5 }}
            />
            
            <TextField
              label="Discount %"
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage}
              onChange={handleChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Box>
          
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          
          <TextField
            label="Image URL"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            fullWidth
            placeholder="https://example.com/image.jpg"
          />
          
          {formData.thumbnail && (
            <Box
              component="img"
              src={formData.thumbnail}
              alt="Preview"
              sx={{
                width: '100%',
                height: 150,
                objectFit: 'contain',
                borderRadius: 1,
                border: '1px solid #ccc',
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </form>
  );
};

export default ProductTable;