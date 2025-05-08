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
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { batchApi, productApi } from '../services/api';
import { useApp } from '../context/AppContext';
import { format, isAfter, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    number: '',
    caducation: '',
  });
  const { setLoading, setError } = useApp();

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await batchApi.getAll();
      setBatches(response.data);
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

  useEffect(() => {
    fetchBatches();
    fetchProducts();
  }, []);

  const handleOpen = (batch = null) => {
    if (batch) {
      setSelectedBatch(batch);
      setFormData({
        productId: batch.product.id,
        number: batch.number,
        caducation: format(new Date(batch.caducation), 'yyyy-MM-dd'),
      });
    } else {
      setSelectedBatch(null);
      setFormData({
        productId: '',
        number: '',
        caducation: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBatch(null);
    setFormData({
      productId: '',
      number: '',
      caducation: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedBatch) {
        await batchApi.update(selectedBatch._id, formData);
      } else {
        await batchApi.create(formData);
      }
      fetchBatches();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lote?')) {
      try {
        setLoading(true);
        await batchApi.delete(id);
        fetchBatches();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getBatchStatus = (caducation) => {
    const today = new Date();
    const caducationDate = new Date(caducation);
    const thirtyDaysFromNow = subDays(caducationDate, 30);

    if (isAfter(today, caducationDate)) {
      return { label: 'Caducado', color: 'error' };
    } else if (isAfter(today, thirtyDaysFromNow)) {
      return { label: 'Próximo a caducar', color: 'warning' };
    }
    return { label: 'Vigente', color: 'success' };
  };

  const filteredBatches = batches.filter(batch =>
    batch.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.number.toString().includes(searchTerm)
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Lotes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nuevo Lote
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
              <TableCell>Producto</TableCell>
              <TableCell>Número de Lote</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Fecha de Caducidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBatches.map((batch) => {
              const status = getBatchStatus(batch.caducation);
              return (
                <TableRow key={batch._id}>
                  <TableCell>{batch.product.name}</TableCell>
                  <TableCell>{batch.number}</TableCell>
                  <TableCell>{batch.stock}</TableCell>
                  <TableCell>
                    {format(new Date(batch.caducation), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={status.label} 
                      color={status.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(batch)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(batch._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedBatch ? 'Editar Lote' : 'Nuevo Lote'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Producto"
              fullWidth
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
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
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {selectedBatch ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Batches; 