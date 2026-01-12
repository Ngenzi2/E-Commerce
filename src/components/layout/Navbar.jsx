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
  Divider,
  Tooltip,
  Avatar,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Dashboard,
  Person,
  Menu as MenuIcon,
  Logout,
  Store,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/contexts/AuthContext';
import { useCart } from '../../hooks/contexts/CartContexts';
import { useWishlist } from '../../hooks/contexts/WishlistContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1, minHeight: { xs: 56, md: 70 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: { xs: 1, md: 4 },
            }}
          >
            <Store sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              E-Commerce Store
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                display: { xs: 'block', sm: 'none' },
              }}
            >
              E-Store
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              component={Link}
              to="/products"
              sx={{
                color: isActive('/products') ? 'primary.main' : 'text.secondary',
                fontWeight: isActive('/products') ? 600 : 400,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 2,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                },
              }}
            >
              Products
            </Button>
          </Box>

          {/* Right Side Actions - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Cart">
              <IconButton
                component={Link}
                to="/cart"
                sx={{
                  color: isActive('/cart') ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                  },
                }}
              >
                <Badge badgeContent={getCartCount()} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Wishlist">
              <IconButton
                component={Link}
                to="/wishlist"
                sx={{
                  color: isActive('/wishlist') ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                  },
                }}
              >
                <Badge badgeContent={wishlist.length} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Tooltip title="Dashboard">
                  <IconButton
                    component={Link}
                    to="/dashboard"
                    sx={{
                      color: isActive('/dashboard') ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Dashboard />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Account">
                  <IconButton
                    onClick={handleUserMenu}
                    sx={{
                      ml: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderRadius: 2,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    component={Link}
                    to="/dashboard"
                    onClick={handleClose}
                    sx={{ py: 1.5 }}
                  >
                    <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                    <Logout sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  ml: 2,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            {isAuthenticated && (
              <Badge badgeContent={getCartCount()} color="error">
                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{ color: 'text.secondary' }}
                >
                  <ShoppingCart />
                </IconButton>
              </Badge>
            )}
            <IconButton
              onClick={handleMobileMenu}
              sx={{ color: 'text.secondary' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 250,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
              },
            }}
          >
            {isAuthenticated && (
              <>
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user?.firstName} {user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
              </>
            )}
            <MenuItem component={Link} to="/products" onClick={handleClose}>
              Products
            </MenuItem>
            {!isAuthenticated && (
              <MenuItem component={Link} to="/cart" onClick={handleClose}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Cart</span>
                  {getCartCount() > 0 && (
                    <Chip label={getCartCount()} size="small" color="error" />
                  )}
                </Box>
              </MenuItem>
            )}
            {!isAuthenticated && (
              <MenuItem component={Link} to="/wishlist" onClick={handleClose}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <Chip label={wishlist.length} size="small" color="error" />
                  )}
                </Box>
              </MenuItem>
            )}
            {isAuthenticated && (
              <>
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                  <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                  Dashboard
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Logout sx={{ mr: 2, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Divider />
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleClose}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Login
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;