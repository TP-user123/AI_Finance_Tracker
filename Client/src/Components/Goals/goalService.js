import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// helper to get headers with token
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// Get all goals for the user
export const getGoals = async () => {
  const res = await axios.get(`${apiUrl}/api/goals`, authHeaders());
  return res.data.data; // backend returns { success: true, data: goal[] }
};

// Create a new goal
export const createGoal = async (goalData) => {
  const res = await axios.post(`${apiUrl}/api/goals`, goalData, authHeaders());
  return res.data.data;
};

// Update an existing goal
export const updateGoal = async (id, goalData) => {
  const res = await axios.put(`${apiUrl}/api/goals/${id}`, goalData, authHeaders());
  return res.data.data;
};

// Delete a goal
export const deleteGoal = async (id) => {
  const res = await axios.delete(`${apiUrl}/api/goals/${id}`, authHeaders());
  return res.data;
};

// Mark goal as complete
export const markGoalComplete = async (id) => {
  const res = await axios.patch(
    `${apiUrl}/api/goals/${id}/complete`,
    { status: "completed" },
    authHeaders()
  );
  return res.data.data;
};
