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
  Chip,
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
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: 'text.primary', mb: 3 }}>
        <ShoppingCart fontSize="medium" />
        Order Summary
      </Typography>

      {showItems && cart.length > 0 && (
        <List dense sx={{ mb: 1.5 }}>
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

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Cost Breakdown */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Subtotal ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${getCartTotal().toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: 'text.primary' }}>
              <LocalShipping fontSize="small" />
              Shipping
            </Typography>
            <Typography variant="body1" color={shippingCost === 0 ? 'success.main' : 'text.primary'} sx={{ fontWeight: 600 }}>
              {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Tax (8%)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              ${tax.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Total
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ${total.toFixed(2)}
            </Typography>
          </Box>

          {shippingCost === 0 && getCartTotal() < 50 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'success.light',
                borderRadius: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'success.main',
              }}
            >
              <Typography variant="body2" color="success.dark" sx={{ fontWeight: 500 }}>
                🎉 Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Checkout Button */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Payment />}
            onClick={onCheckout}
            disabled={cart.length === 0}
            sx={{
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Proceed to Checkout
          </Button>

          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mb: 3 }}>
            🔒 Secure checkout • You won't be charged yet
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Payment Methods */}
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5, fontWeight: 500 }}>
          We accept:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['Visa', 'MasterCard', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
            <Chip
              key={method}
              label={method}
              size="small"
              sx={{
                borderRadius: 1.5,
                bgcolor: 'action.hover',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CartSummary;
