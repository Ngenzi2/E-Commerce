import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/contexts/AuthContext';
import { productAPI } from '../api/axios';
import ProductTable from '../components/Dashboard/ProductTable';
import ProductForm from '../components/Dashboard/ProductForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ limit: 10 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (productData) => {
    try {
      // Note: DummyJSON doesn't actually create products, but returns a mock response
      const response = await productAPI.create(productData);
      setProducts([response.data, ...products]);
      showNotification('Product created successfully', 'success');
      setOpenForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
      showNotification('Error creating product', 'error');
    }
  };

  const handleUpdate = async (id, productData) => {
    try {
      // Note: DummyJSON doesn't actually update products, but returns a mock response
      const response = await productAPI.update(id, productData);
      setProducts(products.map(p => p.id === id ? response.data : p));
      showNotification('Product updated successfully', 'success');
      setEditingProduct(null);
      setOpenForm(false);
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification('Error updating product', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Note: DummyJSON doesn't actually delete products, but returns a mock response
      await productAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      showNotification('Product deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error deleting product', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingProduct(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome, {user?.firstName} {user?.lastName}
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Product Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
            >
              Add Product
            </Button>
          </Box>

          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>
      </Box>

      <ProductForm
        open={openForm}
        onClose={handleFormClose}
        onSubmit={editingProduct ? (data) => handleUpdate(editingProduct.id, data) : handleCreate}
        initialData={editingProduct}
        isEditing={!!editingProduct}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;