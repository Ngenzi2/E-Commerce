import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  CardActions,
  Box,
  Rating,
  //mui/material
} from '@mui/material';
import {AddShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material';
import { useCart } from '../../hooks/contexts/CartContexts';
import {useWishlist } from '../../hooks/contexts/WishlistContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnail}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} readOnly precision={0.5} size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({product.rating})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          ${product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {product.description.slice(0, 60)}...
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddShoppingCart />}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
          <Button
            component={Link}
            to={`/products/${product.id}`}
            size="small"
            sx={{ ml: 1 }}
          >
            Details
          </Button>
        </Box>
        <IconButton onClick={handleWishlistClick} color={isWishlisted ? 'error' : 'default'}>
          {isWishlisted ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;