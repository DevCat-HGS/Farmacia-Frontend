import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { inputApi, productApi, batchApi } from '../services/api';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Inputs = () => {
  const [inputs, setInputs] = useState([]);
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    batchNumber: '',
    quantity: '',
    caducation: '',
  });
  const { setLoading, setError } = useApp();

  const fetchInputs = async () => {
    try {
      setLoading(true);
      const response = await inputApi.getAll();
      setInputs(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data.filter(product => product.active));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBatches = async (productId) => {
    if (!productId) {
      setBatches([]);
      return;
    }
    try {
      const response = await batchApi.getAll();
      setBatches(response.data.filter(batch => batch.product.id === productId));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchInputs();
    fetchProducts();
  }, []);

  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
    setFormData({
      ...formData,
      productId,
      batchNumber: '',
    });
    fetchBatches(productId);
  };

  const handleOpen = () => {
    setOpen(true);
    setFormData({
      productId: '',
      batchNumber: '',
      quantity: '',
      caducation: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      productId: '',
      batchNumber: '',
      quantity: '',
      caducation: '',
    });
    setSelectedProduct('');
    setBatches([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await inputApi.create(formData);
      fetchInputs();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        setLoading(true);
        await inputApi.delete(id);
        fetchInputs();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredInputs = inputs.filter(input =>
    input.batch.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    input.batch.number.toString().includes(searchTerm)
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Entradas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Nueva Entrada
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por producto o número de lote..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Lote</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInputs.map((input) => (
              <TableRow key={input._id}>
                <TableCell>
                  {format(new Date(input.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                </TableCell>
                <TableCell>{input.batch.product.name}</TableCell>
                <TableCell>{input.batch.number}</TableCell>
                <TableCell>{input.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(input._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Entrada</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Producto"
              fullWidth
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              required
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Número de Lote"
              type="number"
              fullWidth
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Cantidad"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
            {!batches.find(b => b.number === Number(formData.batchNumber)) && (
              <TextField
                margin="dense"
                label="Fecha de Caducidad"
                type="date"
                fullWidth
                value={formData.caducation}
                onChange={(e) => setFormData({ ...formData, caducation: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Crear
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Inputs; 