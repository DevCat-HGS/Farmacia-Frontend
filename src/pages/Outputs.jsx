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
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { outputApi, batchApi } from '../services/api';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Outputs = () => {
  const [outputs, setOutputs] = useState([]);
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formData, setFormData] = useState({
    batchId: '',
    quantity: '',
  });
  const { setLoading, setError } = useApp();

  const fetchOutputs = async () => {
    try {
      setLoading(true);
      const response = await outputApi.getAll();
      setOutputs(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await batchApi.getAll();
      setBatches(response.data.filter(batch => batch.stock > 0));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOutputs();
    fetchBatches();
  }, []);

  const handleBatchChange = (batchId) => {
    const batch = batches.find(b => b._id === batchId);
    setSelectedBatch(batch);
    setFormData({
      ...formData,
      batchId,
      quantity: '',
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setFormData({
      batchId: '',
      quantity: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      batchId: '',
      quantity: '',
    });
    setSelectedBatch(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await outputApi.create(formData);
      fetchOutputs();
      fetchBatches(); // Actualizar los lotes disponibles
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta salida?')) {
      try {
        setLoading(true);
        await outputApi.delete(id);
        fetchOutputs();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredOutputs = outputs.filter(output =>
    output.batch.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    output.batch.number.toString().includes(searchTerm)
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Salidas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Nueva Salida
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
            {filteredOutputs.map((output) => (
              <TableRow key={output._id}>
                <TableCell>
                  {format(new Date(output.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                </TableCell>
                <TableCell>{output.batch.product.name}</TableCell>
                <TableCell>{output.batch.number}</TableCell>
                <TableCell>{output.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(output._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Salida</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Lote"
              fullWidth
              value={formData.batchId}
              onChange={(e) => handleBatchChange(e.target.value)}
              required
            >
              {batches.map((batch) => (
                <MenuItem key={batch._id} value={batch._id}>
                  {`${batch.product.name} - Lote ${batch.number} (Stock: ${batch.stock})`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Cantidad"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              InputProps={{
                inputProps: { 
                  min: 1,
                  max: selectedBatch?.stock || 1
                }
              }}
            />
            {selectedBatch && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Stock disponible: {selectedBatch.stock} unidades
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={!selectedBatch || !formData.quantity || formData.quantity > selectedBatch.stock}
            >
              Crear
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Outputs; 