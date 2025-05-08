import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Batches from './pages/Batches';
import Inputs from './pages/Inputs';
import Outputs from './pages/Outputs';
import theme from './theme';

// Página temporal para prueba
const DashboardPage = () => <div>Dashboard Content</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/batches" element={<Batches />} />
              <Route path="/inputs" element={<Inputs />} />
              <Route path="/outputs" element={<Outputs />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App; 