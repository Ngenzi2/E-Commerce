import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ShoppingCart, LocalShipping, Payment } from '@mui/icons-material';
import { useCart } from '../../hooks/contexts/CartContexts';

const CartSummary = ({ onCheckout, showItems = false }) => {
  const { cart, getCartTotal, getCartCount } = useCart();

  const shippingCost = getCartTotal() > 50 ? 0 : 5.99;
  const tax = getCartTotal() * 0.08; // 8% tax
  const total = getCartTotal() + shippingCost + tax;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCart fontSize="small" />
        Order Summary
      </Typography>

      {showItems && cart.length > 0 && (
        <List dense sx={{ mb: 2 }}>
          {cart.map((item) => (
            <ListItem key={item.id} disableGutters>
              <ListItemText
                primary={item.title}
                secondary={`Qty: ${item.quantity}`}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
              <Typography variant="body2">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Subtotal ({getCartCount()} items)</Typography>
          <Typography variant="body2">${getCartTotal().toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocalShipping fontSize="small" />
            Shipping
          </Typography>
          <Typography variant="body2" color={shippingCost === 0 ? 'success.main' : 'text.primary'}>
            {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Tax (8%)</Typography>
          <Typography variant="body2">${tax.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" color="primary">
            ${total.toFixed(2)}
          </Typography>
        </Box>

        {shippingCost === 0 && getCartTotal() < 50 && (
          <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
            Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Payment />}
          onClick={onCheckout}
          disabled={cart.length === 0}
          sx={{ mb: 2 }}
        >
          Proceed to Checkout
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          You won't be charged yet
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          We accept:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['Visa', 'MasterCard', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
            <Box
              key={method}
              sx={{
                px: 1,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="caption">{method}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CartSummary;
