import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button,
    TextField,
    InputAdornment,
    Chip,
    Dialog,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Badge,
    Avatar,
    Tooltip,
    Fade
} from '@mui/material';
import { 
    Search as SearchIcon,
    Add as AddIcon,
    Star as StarIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingCartIcon,
    Dashboard as DashboardIcon,
    FilterList as FilterListIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/contexts/AuthContext';
import { useProduct } from '../hooks/contexts/ProductContext';
import ProductForm from '../components/Dashboard/ProductForm';

const Dashboard = () => {
    const { user } = useAuth();
    const { 
        userProducts, 
        allProducts, 
        loading, 
        createProduct, 
        deleteProduct, 
        updateProduct 
    } = useProduct();
    
    const [openForm, setOpenForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');

    const getFilteredProducts = () => {
        let productsToShow = viewMode === 'my' ? userProducts : allProducts;
        
        if (searchTerm.trim()) {
            productsToShow = productsToShow.filter(product =>
                product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply sorting
        return productsToShow.sort((a, b) => {
            let aVal = a[sortField] || '';
            let bVal = b[sortField] || '';
            
            if (sortField === 'price' || sortField === 'rating' || sortField === 'stock') {
                aVal = Number(aVal) || 0;
                bVal = Number(bVal) || 0;
            }
            
            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    };

    const filteredProducts = getFilteredProducts();

    const handleAddProduct = () => {
        setEditingProduct(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await createProduct(productData);
            }
            handleCloseForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setOpenForm(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading && allProducts.length === 0) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '80vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <DashboardIcon sx={{ fontSize: 60, color: '#e0e0e0' }} />
                <Typography color="text.secondary">Loading products...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            bgcolor: 'background.default',
            px: { xs: 2, md: 4 },
            py: 3
        }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        mb: 1
                    }}>
                        Product Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back, {user?.firstName || user?.username || 'User'}! Manage your products efficiently.
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddProduct}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                    }}
                >
                    Add Product
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        bgcolor: '#e8f4fd',
                        border: '1px solid #e0f2fe'
                    }}>
                        <Typography variant="h3" sx={{ 
                            fontWeight: 800,
                            color: '#0369a1',
                            mb: 1
                        }}>
                            {allProducts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Products
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        bgcolor: '#f0f9ff',
                        border: '1px solid #e0f2fe'
                    }}>
                        <Typography variant="h3" sx={{ 
                            fontWeight: 800,
                            color: '#0ea5e9',
                            mb: 1
                        }}>
                            {userProducts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            My Products
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={0} sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                    }}>
                        <Typography variant="h3" sx={{ 
                            fontWeight: 800,
                            color: '#64748b',
                            mb: 1
                        }}>
                            {filteredProducts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Currently Showing
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Controls */}
            <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
            }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search products by name, brand, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                            variant="outlined"
                            size="medium"
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2,
                            justifyContent: { xs: 'flex-start', md: 'flex-end' }
                        }}>
                            <Button
                                variant={viewMode === 'all' ? 'contained' : 'outlined'}
                                onClick={() => setViewMode('all')}
                                startIcon={<DashboardIcon />}
                                sx={{ 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: viewMode === 'all' ? 600 : 400
                                }}
                            >
                                All Products
                            </Button>
                            <Badge badgeContent={userProducts.length} color="primary">
                                <Button
                                    variant={viewMode === 'my' ? 'contained' : 'outlined'}
                                    onClick={() => setViewMode('my')}
                                    startIcon={<FilterListIcon />}
                                    sx={{ 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: viewMode === 'my' ? 600 : 400
                                    }}
                                >
                                    My Products
                                </Button>
                            </Badge>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Product Table */}
            {filteredProducts.length > 0 ? (
                <Fade in={true} timeout={500}>
                    <Paper elevation={0} sx={{ 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}>
                        <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                            <Table stickyHeader size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            py: 2
                                        }}>
                                            Product
                                        </TableCell>
                                        <TableCell sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }} onClick={() => handleSort('category')}>
                                                Category
                                                {sortField === 'category' && (
                                                    sortDirection === 'asc' ? 
                                                        <ArrowUpwardIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                                                        <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }} onClick={() => handleSort('brand')}>
                                                Brand
                                                {sortField === 'brand' && (
                                                    sortDirection === 'asc' ? 
                                                        <ArrowUpwardIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                                                        <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                cursor: 'pointer'
                                            }} onClick={() => handleSort('price')}>
                                                Price
                                                {sortField === 'price' && (
                                                    sortDirection === 'asc' ? 
                                                        <ArrowUpwardIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                                                        <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }} onClick={() => handleSort('rating')}>
                                                Rating
                                                {sortField === 'rating' && (
                                                    sortDirection === 'asc' ? 
                                                        <ArrowUpwardIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                                                        <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }} onClick={() => handleSort('stock')}>
                                                Stock
                                                {sortField === 'stock' && (
                                                    sortDirection === 'asc' ? 
                                                        <ArrowUpwardIcon sx={{ fontSize: 16, ml: 0.5 }} /> : 
                                                        <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ 
                                            bgcolor: '#f8fafc',
                                            fontWeight: 700,
                                            fontSize: '0.875rem'
                                        }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((product) => (
                                        <TableRow 
                                            key={product.id}
                                            hover
                                            sx={{ 
                                                '&:hover': { bgcolor: '#f8fafc' },
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <TableCell sx={{ py: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar 
                                                        src={product.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                                        alt={product.title}
                                                        variant="rounded"
                                                        sx={{ 
                                                            width: 56, 
                                                            height: 56,
                                                            borderRadius: 2,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                            {product.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                            {product.description?.substring(0, 60)}...
                                                        </Typography>
                                                        {product.isLocal && (
                                                            <Chip 
                                                                label="Local" 
                                                                size="small" 
                                                                sx={{ 
                                                                    mt: 0.5,
                                                                    fontSize: '0.65rem',
                                                                    height: 20,
                                                                    bgcolor: '#fef3c7',
                                                                    color: '#92400e'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={product.category} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: '#e0f2fe',
                                                        color: '#0369a1',
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {product.brand}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="subtitle1" sx={{ 
                                                    fontWeight: 700,
                                                    color: '#1e40af'
                                                }}>
                                                    ${product.price}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center',
                                                    bgcolor: '#f8fafc',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2
                                                }}>
                                                    <StarIcon sx={{ 
                                                        color: '#f59e0b', 
                                                        fontSize: 16, 
                                                        mr: 0.5 
                                                    }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {product.rating || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center',
                                                    bgcolor: product.stock > 10 ? '#dcfce7' : '#fee2e2',
                                                    color: product.stock > 10 ? '#166534' : '#991b1b',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    fontWeight: 600
                                                }}>
                                                    {product.stock || 0}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    {/* ALWAYS SHOW EDIT BUTTON FOR ALL PRODUCTS */}
                                                    <Tooltip title="Edit">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleEditProduct(product)}
                                                            sx={{ 
                                                                bgcolor: '#e0f2fe',
                                                                color: '#0369a1',
                                                                '&:hover': { bgcolor: '#bae6fd' }
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    
                                                    {/* ALWAYS SHOW DELETE BUTTON FOR ALL PRODUCTS */}
                                                    <Tooltip title="Delete">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            sx={{ 
                                                                bgcolor: '#fee2e2',
                                                                color: '#dc2626',
                                                                '&:hover': { bgcolor: '#fecaca' }
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    
                                                    {/* OPTIONAL: Also keep the Add to Cart button for other users' products if needed */}
                                                    {!(product.userId === user?.id || product.isLocal) && (
                                                        <Tooltip title="Add to Cart">
                                                            <IconButton 
                                                                size="small"
                                                                sx={{ 
                                                                    bgcolor: '#dbeafe',
                                                                    color: '#1d4ed8',
                                                                    '&:hover': { bgcolor: '#bfdbfe' }
                                                                }}
                                                            >
                                                                <ShoppingCartIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredProducts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ 
                                borderTop: '1px solid',
                                borderColor: 'divider'
                            }}
                        />
                    </Paper>
                </Fade>
            ) : (
                <Paper elevation={0} sx={{ 
                    p: 8, 
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.default'
                }}>
                    <DashboardIcon sx={{ 
                        fontSize: 80, 
                        color: 'grey.300', 
                        mb: 3 
                    }} />
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        {searchTerm ? 'No matching products' : 'No products yet'}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        {searchTerm 
                            ? 'Try adjusting your search or filter to find what you\'re looking for'
                            : 'Start building your inventory by adding your first product'
                        }
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddProduct}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.2,
                            fontWeight: 600
                        }}
                    >
                        Add Your First Product
                    </Button>
                </Paper>
            )}

            {/* Product Form Dialog */}
            <Dialog 
                open={openForm} 
                onClose={handleCloseForm} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <ProductForm
                    open={openForm}
                    onClose={handleCloseForm}
                    onSubmit={handleSaveProduct}
                    initialData={editingProduct}
                    isEditing={!!editingProduct}
                />
            </Dialog>
        </Box>
    );
};

export default Dashboard;