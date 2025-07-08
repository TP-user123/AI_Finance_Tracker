import React from 'react';
import Navbar from '../Components/Navbar';
import DashboardCards from '../Components/DashboardCard';
import ChartSection from '../Components/ChartSection';
import CategorySummary from '../Components/CategorySummary';

const Dashboard = () => {
  return (
    <div className="flex-1 p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mt-4">Finance Overview</h1>
      <DashboardCards />
      <ChartSection />
      <CategorySummary />
    </div>
  );
};

export default Dashboard;