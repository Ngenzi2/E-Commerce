import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useCart } from '../hooks/contexts/CartContexts';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <Container maxWidth="md">
        <Box textAlign="center" sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 16 }}
                        />
                        <Typography variant="body1">{item.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${item.price}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          sx={{ width: 60, mx: 1 }}
                          inputProps={{ style: { textAlign: 'center' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeFromCart(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} to="/products" variant="outlined">
              Continue Shopping
            </Button>
            <Button onClick={clearCart} variant="outlined" color="error">
              Clear Cart
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${getCartTotal().toFixed(2)}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>$0.00</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>$0.00</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${getCartTotal().toFixed(2)}</Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => alert('Checkout functionality would be implemented here')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;