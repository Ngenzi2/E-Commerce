import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useCart } from '../../hooks/contexts/CartContexts';
import { useWishlist } from '../../hooks/contexts/WishlistContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value, 10);
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleMoveToWishlist = () => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
      removeFromCart(item.id);
    }
  };

  const isWishlisted = isInWishlist(item.id);

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mb: 1.5,
        bgcolor: 'background.paper',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Product Image */}
        <Box
          component={Link}
          to={`/products/${item.id}`}
          sx={{
            width: 100,
            height: 100,
            borderRadius: 2,
            overflow: 'hidden',
            flexShrink: 0,
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src={item.thumbnail}
            alt={item.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography
              component={Link}
              to={`/products/${item.id}`}
              variant="subtitle1"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {item.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={isWishlisted ? "Remove from wishlist" : "Move to wishlist"}>
                <IconButton
                  size="small"
                  onClick={handleMoveToWishlist}
                  color={isWishlisted ? "error" : "default"}
                >
                  <FavoriteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Remove from cart">
                <IconButton
                  size="small"
                  onClick={() => removeFromCart(item.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            {item.brand} • {item.category}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Rating:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {item.rating} ⭐
              </Typography>
            </Box>
            {item.discountPercentage > 0 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.5,
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                }}
              >
                {item.discountPercentage}% OFF
              </Box>
            )}
          </Box>

          {/* Quantity and Price Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Tooltip title="Decrease quantity">
                  <IconButton
                    size="small"
                    onClick={handleDecrement}
                    sx={{ borderRadius: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  inputProps={{
                    min: 1,
                    style: {
                      width: 60,
                      textAlign: 'center',
                      border: 'none',
                      padding: '8px',
                    },
                  }}
                  variant="standard"
                  sx={{
                    '& .MuiInput-root': {
                      '&:before, &:after': {
                        display: 'none',
                      },
                    },
                  }}
                />
                
                <Tooltip title="Increase quantity">
                  <IconButton
                    size="small"
                    onClick={handleIncrement}
                    sx={{ borderRadius: 0 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Max: {item.stock}
              </Typography>
            </Box>

            {/* Price Summary */}
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" color="primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
                {item.discountPercentage > 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    ${(item.price * (1 + item.discountPercentage / 100) * item.quantity).toFixed(2)}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                ${item.price} each
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stock Warning */}
      {item.stock <= 5 && item.stock > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: 'warning.light',
            color: 'warning.contrastText',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption">
            ⚠️ Only {item.stock} left in stock!
          </Typography>
        </Box>
      )}

      {item.stock === 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption">
            ⚠️ Out of stock
          </Typography>
          <Button
            size="small"
            onClick={() => removeFromCart(item.id)}
            sx={{ ml: 2 }}
          >
            Remove
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CartItem;