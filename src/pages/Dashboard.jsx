import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/contexts/AuthContext';
import { useProduct } from '../hooks/contexts/ProductContext';
import ProductForm from '../components/Dashboard/ProductForm';

const Dashboard = () => {
  const { user } = useAuth();
  const { products, setProducts } = useProduct();
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProduct = () => {
    setEditingProduct(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (product) => {
    const productWithUserId = { ...product, userId: user?.id };
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? { ...product, userId: user?.id } : p));
    } else {
      setProducts([...products, { ...productWithUserId, id: Date.now() }]);
    }
    handleCloseForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleDeleteProduct = (id) => {
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete && productToDelete.userId === user?.id) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const userProducts = products.filter(p => p.userId === user?.id);
  const filteredProducts = userProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f8f9fa',
      p: 3
    }}>
      {/* Welcome Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: '#1a1a1a',
          mb: 1
        }}>
          Welcome back, {user?.firstName || user?.username || 'User'}!
        </Typography>
        <Typography sx={{ 
          color: '#666',
          fontSize: '1rem'
        }}>
          Manage your products and inventory efficiently.
        </Typography>
      </Box>

      {/* Products Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 0.5
          }}>
            Products
          </Typography>
          <Typography sx={{ 
            color: '#666',
            fontSize: '0.875rem'
          }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ 
              width: 280,
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                '& fieldset': {
                  borderColor: '#d0d0d0',
                },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
              py: 1,
              backgroundColor: '#1976d2',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                backgroundColor: '#1565c0',
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Product List Table */}
      <Box sx={{ 
        bgcolor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Table Header */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
          gap: 2,
          p: 2,
          borderBottom: '2px solid #f0f0f0',
          bgcolor: '#fafafa'
        }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333' }}>
            Product
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333' }}>
            Category
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333' }}>
            Price
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333' }}>
            Stock
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333' }}>
            Rating
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333', textAlign: 'center' }}>
            Actions
          </Typography>
        </Box>

        {/* Product Rows */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Box
              key={product.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
                gap: 2,
                p: 2,
                borderBottom: index === filteredProducts.length - 1 ? 'none' : '1px solid #f0f0f0',
                alignItems: 'center',
                '&:hover': {
                  bgcolor: '#f8f9fa'
                }
              }}
            >
              {/* Product Column */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={product.thumbnail}
                  variant="rounded"
                  sx={{ 
                    width: 40, 
                    height: 40,
                    borderRadius: '6px',
                    bgcolor: '#f0f0f0',
                    border: '1px solid #e0e0e0'
                  }}
                />
                <Box>
                  <Typography sx={{ 
                    fontWeight: 500, 
                    fontSize: '0.875rem',
                    color: '#1a1a1a',
                    lineHeight: 1.2
                  }}>
                    {product.title}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem',
                    color: '#666',
                    lineHeight: 1.2
                  }}>
                    {product.brand}
                  </Typography>
                </Box>
              </Box>

              {/* Category Column */}
              <Chip 
                label={product.category} 
                size="small"
                sx={{ 
                  bgcolor: '#e8f5e9',
                  color: '#2e7d32',
                  borderRadius: '4px',
                  width: 'fit-content',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  height: 24
                }}
              />

              {/* Price Column */}
              <Typography sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1a1a1a'
              }}>
                ${product.price.toFixed(2)}
              </Typography>

              {/* Stock Column */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: product.stock > 20 ? '#4caf50' : 
                                   product.stock > 10 ? '#ff9800' : '#f44336'
                  }}
                />
                <Typography sx={{ 
                  fontSize: '0.875rem',
                  color: '#1a1a1a'
                }}>
                  {product.stock}
                </Typography>
              </Box>

              {/* Rating Column */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon sx={{ 
                  color: '#ffb400', 
                  fontSize: 16 
                }} />
                <Typography sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {product.rating || '0.0'}
                </Typography>
              </Box>

              {/* Actions Column */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => handleEditProduct(product)}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    color: '#1976d2',
                    minWidth: 'auto',
                    px: 1
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDeleteProduct(product.id)}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    color: '#d32f2f',
                    minWidth: 'auto',
                    px: 1
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ 
            py: 10, 
            textAlign: 'center',
            color: '#666'
          }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%',
              bgcolor: '#f0f0f0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <AddIcon sx={{ color: '#999', fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
              No products yet
            </Typography>
            <Typography sx={{ mb: 3, color: '#666' }}>
              Start by adding your first product to the inventory
            </Typography>
            <Button 
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              sx={{
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1.2
              }}
            >
              Add First Product
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <ProductForm
          open={openForm}
          onClose={handleCloseForm}
          onSubmit={handleSaveProduct}
          initialData={editingProduct}
          isEditing={!!editingProduct}
        />
      </Dialog>
    </Box>
  );
};

export default Dashboard;