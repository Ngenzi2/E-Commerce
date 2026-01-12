import React, { useState, useEffect } from 'react';
import { Container, Paper, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog } from '@mui/material';
import { useAuth } from '../hooks/contexts/AuthContext';
import { useProduct } from '../hooks/contexts/ProductContext';
import ProductForm from '../components/Dashboard/ProductForm';
import ProductTable from '../components/Dashboard/ProductTable';

const Dashboard = () => {
  const { user } = useAuth();
  const { products, setProducts } = useProduct();
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now() }]);
    }
    handleCloseForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {user && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Welcome, {user.firstName || user.username}
          </Typography>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          sx={{ mb: 2 }}
        >
          Add New Product
        </Button>

        <ProductTable 
          products={products} 
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

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
    </Container>
  );
};

export default Dashboard;
