import React from "react";
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

} from '@mui/material';
import {AddShoppingCart, FavoriteBorder } from '@mui/icons-material';
import { useCart } from '../../hooks/contexts/CartContexts';
import { useWishlist } from '../../hooks/contexts/WishlistContext';
import { Link } from 'react-router-dom';