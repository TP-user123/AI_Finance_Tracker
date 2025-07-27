import React from 'react';
import Navbar from '../Components/Navbar';
import DashboardCards from '../Components/DashboardCard';
import ChartSection from '../Components/ChartSection';
import CategorySummary from '../Components/CategorySummary';
import SpendingLimitCard from '../Components/SpendingLimitCard';
import ExpectedIncomeCard from '../Components/ExpectedIncomeCard';
import ChatToggle from '../Components/Ai/chatToggle';
const Dashboard = () => {
  return (
    <div className="flex-1 p-4">
      
      <h1 className="text-3xl font-bold mt-4 mb-3">Finance Overview</h1>
      
      <SpendingLimitCard />
      <DashboardCards />
      <ChartSection />
     <ChatToggle />
      <ExpectedIncomeCard />
      <CategorySummary />
    </div>
  );
};

export default Dashboard;