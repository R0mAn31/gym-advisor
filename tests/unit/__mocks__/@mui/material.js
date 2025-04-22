/**
 * Mock for @mui/material
 */

const MockComponent = ({ children, ...props }) => children;

// Create all Material UI component mocks
const components = [
  'Container',
  'Typography',
  'TextField',
  'Button',
  'Link',
  'Grid',
  'Paper',
  'CircularProgress',
  'Box',
  'Card',
  'CardContent',
  'CardActions',
  'CardMedia',
  'Avatar',
  'IconButton',
  'Divider',
  'Alert',
  'Snackbar',
  'Dialog',
  'DialogTitle',
  'DialogContent',
  'DialogActions',
  'FormControl',
  'InputLabel',
  'Select',
  'MenuItem',
  'Checkbox',
  'FormControlLabel',
  'List',
  'ListItem',
  'ListItemText',
  'ListItemIcon',
  'Drawer',
  'AppBar',
  'Toolbar',
  'Menu',
  'Badge',
  'Tabs',
  'Tab',
  'Breadcrumbs',
];

const materialUIMock = {};

// Create mock for each component
components.forEach(component => {
  materialUIMock[component] = MockComponent;
});

module.exports = materialUIMock; 