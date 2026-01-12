import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Dashboard,
  Person,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/contexts/AuthContext';
import { useCart } from '../../hooks/contexts/CartContexts';
import { useWishlist } from '../../hooks/contexts/WishlistContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: { xs: 'none', md: 'block' },
            }}
          >
            E-Commerce Store
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              color="inherit"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/products" onClick={handleClose}>
                Products
              </MenuItem>
              <MenuItem component={Link} to="/cart" onClick={handleClose}>
                Cart ({getCartCount()})
              </MenuItem>
              <MenuItem component={Link} to="/wishlist" onClick={handleClose}>
                Wishlist ({wishlist.length})
              </MenuItem>
              {isAuthenticated && (
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                  Dashboard
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: { xs: 'block', md: 'none' },
            }}
          >
            E-Store
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              component={Link}
              to="/products"
              color="inherit"
              sx={{ mx: 1 }}
            >
              Products
            </Button>
            
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              size="large"
            >
              <Badge badgeContent={getCartCount()} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            
            <IconButton
              component={Link}
              to="/wishlist"
              color="inherit"
              size="large"
            >
              <Badge badgeContent={wishlist.length} color="secondary">
                <Favorite />
              </Badge>
            </IconButton>
            
            {isAuthenticated ? (
              <>
                <IconButton
                  component={Link}
                  to="/dashboard"
                  color="inherit"
                  size="large"
                >
                  <Dashboard />
                </IconButton>
                
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  size="large"
                >
                  <Person />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    {user?.firstName} {user?.lastName}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;