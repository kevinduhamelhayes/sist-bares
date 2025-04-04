import React from 'react';
import RegisterClosure from '../components/RegisterClosure';
import SalesMetrics from '../components/SalesMetrics';
import './styles/reportsPage.css';

const ReportsPage = () => {
  return (
    <div className="reports-page-container">
      <h1>Reportes y Operaciones de Caja</h1>
      
      <div className="reports-sections">
        <div className="register-section">
          <RegisterClosure />
        </div>
        
        <div className="metrics-section">
          <SalesMetrics />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 