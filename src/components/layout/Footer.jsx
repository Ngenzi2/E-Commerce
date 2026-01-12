import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              E-Commerce Store
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your one-stop destination for all your shopping needs. 
              We provide high-quality products with excellent customer service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <IconButton color="primary">
                <Facebook />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
              <IconButton color="primary">
                <Instagram />
              </IconButton>
              <IconButton color="primary">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/products" color="text.secondary">
                Products
              </MuiLink>
              <MuiLink component={Link} to="/cart" color="text.secondary">
                Cart
              </MuiLink>
              <MuiLink component={Link} to="/wishlist" color="text.secondary">
                Wishlist
              </MuiLink>
              <MuiLink component={Link} to="/login" color="text.secondary">
                Account
              </MuiLink>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/products?category=smartphones" color="text.secondary">
                Smartphones
              </MuiLink>
              <MuiLink component={Link} to="/products?category=laptops" color="text.secondary">
                Laptops
              </MuiLink>
              <MuiLink component={Link} to="/products?category=fragrances" color="text.secondary">
                Fragrances
              </MuiLink>
              <MuiLink component={Link} to="/products?category=skincare" color="text.secondary">
                Skincare
              </MuiLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="action" />
                <Typography variant="body2" color="text.secondary">
                  123 Street, City, Country
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="action" />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="action" />
                <Typography variant="body2" color="text.secondary">
                  support@ecommerce.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} E-Commerce Store. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink component={Link} to="/privacy" color="text.secondary" variant="body2">
              Privacy Policy
            </MuiLink>
            <MuiLink component={Link} to="/terms" color="text.secondary" variant="body2">
              Terms of Service
            </MuiLink>
            <MuiLink component={Link} to="/return" color="text.secondary" variant="body2">
              Return Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;