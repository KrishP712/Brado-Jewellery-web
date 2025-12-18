import useDashboard from "./useDashboard";

const Dashboard = () => {
    const { count, setCount } = useDashboard();

    return (
        <div>
              <h1>Dashboard</h1>
              <p>Count: {count}</p>
              <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    )
};

export default Dashboard;
