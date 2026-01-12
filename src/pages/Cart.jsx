import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Breadcrumbs,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  DeleteOutline,
  ShoppingBag,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/contexts/CartContexts';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';

const Cart = () => {
  const { cart, clearCart, getCartCount } = useCart();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here');
  };

  const handleClearCart = () => {
    clearCart();
    setClearDialogOpen(false);
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            py: 8,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.875rem' }}
          size="small"
        >
          Home
        </Button>
        <Typography color="text.primary" variant="body2">Shopping Cart</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
          <Chip
            label={`${getCartCount()} ${getCartCount() === 1 ? 'item' : 'items'}`}
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Review your items and proceed to checkout
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
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
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Cart Items
              </Typography>
              {cart.length > 0 && (
                <Button
                  startIcon={<DeleteOutline />}
                  onClick={() => setClearDialogOpen(true)}
                  color="error"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.875rem',
                    borderRadius: 2,
                    px: 2,
                  }}
                >
                  Clear Cart
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </Box>

            {/* Continue Shopping - moved inside Paper */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                component={Link}
                to="/products"
                startIcon={<ArrowBack />}
                variant="outlined"
                size="medium"
                fullWidth
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.25,
                  fontWeight: 500,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box 
            sx={{ 
              position: { lg: 'sticky' }, 
              top: 20,
              height: { lg: 'fit-content', xs: 'auto' },
            }}
          >
            <CartSummary onCheckout={handleCheckout} />
          </Box>
        </Grid>
      </Grid>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Clear Shopping Cart?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setClearDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClearCart}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;