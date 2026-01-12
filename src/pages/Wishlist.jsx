import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AddShoppingCart,
  Favorite,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/contexts/WishlistContext';
import { useCart } from '../hooks/contexts/CartContexts';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Favorite sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Save items you love for later
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        My Wishlist
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        You have {wishlist.length} items in your wishlist
      </Alert>

      <Grid container spacing={3}>
        {wishlist.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: 8,
                },
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
                onClick={() => removeFromWishlist(product.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>

              <CardMedia
                component="img"
                height="200"
                image={product.thumbnail}
                alt={product.title}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.category}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
                {product.discountPercentage > 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ⭐ {product.rating} • {product.stock} in stock
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleMoveToCart(product)}
                  size="small"
                >
                  Move to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {wishlist.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              Total items: {wishlist.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  wishlist.forEach(product => addToCart(product));
                  alert('All items moved to cart!');
                }}
              >
                Move All to Cart
              </Button>
              <Button
                component={Link}
                to="/products"
                variant="contained"
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Wishlist;