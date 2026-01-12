import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Collapse,
  Paper,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

const ProductFilters = ({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  order,
  onOrderChange,
  brands = [],
  selectedBrands,
  onBrandChange,
}) => {
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    brands: true,
    sort: false,
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (event, newValue) => {
    onPriceChange(newValue);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newCategories);
  };

  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onBrandChange(newBrands);
  };

  const clearFilters = () => {
    onCategoryChange([]);
    onPriceChange([0, 1000]);
    onBrandChange([]);
    onSortChange('title');
    onOrderChange('asc');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Filters</Typography>
        <Button
          size="small"
          onClick={clearFilters}
          sx={{ ml: 'auto' }}
        >
          Clear All
        </Button>
      </Box>

      {/* Sort Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: 1,
          }}
          onClick={() => toggleSection('sort')}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Sort By
          </Typography>
          {expanded.sort ? <ExpandLess /> : <ExpandMore />}
        </Box>
        
        <Collapse in={expanded.sort}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Sort Field</InputLabel>
            <Select
              value={sortBy}
              label="Sort Field"
              onChange={(e) => onSortChange(e.target.value)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="discountPercentage">Discount</MenuItem>
            </Select>
          </FormControl>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={order}
              onChange={(e) => onOrderChange(e.target.value)}
              sx={{ flexDirection: 'row', gap: 2 }}
            >
              <FormControlLabel
                value="asc"
                control={<Radio size="small" />}
                label="Ascending"
              />
              <FormControlLabel
                value="desc"
                control={<Radio size="small" />}
                label="Descending"
              />
            </RadioGroup>
          </FormControl>
        </Collapse>
      </Box>

      {/* Price Filter */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: 1,
          }}
          onClick={() => toggleSection('price')}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Price Range
          </Typography>
          {expanded.price ? <ExpandLess /> : <ExpandMore />}
        </Box>
        
        <Collapse in={expanded.price}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
              sx={{ mt: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">
                ${priceRange[0]}
              </Typography>
              <Typography variant="body2">
                ${priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Categories Filter */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: 1,
          }}
          onClick={() => toggleSection('categories')}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            Categories
          </Typography>
          {expanded.categories ? <ExpandLess /> : <ExpandMore />}
        </Box>
        
        <Collapse in={expanded.categories}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories.slice(0, 8).map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                }
                label={
                  <Typography variant="body2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                }
              />
            ))}
          </Box>
        </Collapse>
      </Box>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              mb: 1,
            }}
            onClick={() => toggleSection('brands')}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Brands
            </Typography>
            {expanded.brands ? <ExpandLess /> : <ExpandMore />}
          </Box>
          
          <Collapse in={expanded.brands}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {brand}
                    </Typography>
                  }
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                onDelete={() => handleCategoryToggle(category)}
              />
            ))}
            {selectedBrands.map((brand) => (
              <Chip
                key={brand}
                label={brand}
                size="small"
                onDelete={() => handleBrandToggle(brand)}
              />
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Chip
                label={`$${priceRange[0]} - $${priceRange[1]}`}
                size="small"
                onDelete={() => onPriceChange([0, 2000])}
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ProductFilters;
