import { useState } from "react";

const useDashboard = () => {
    const [count, setCount] = useState(0);

    return {
        count,
        setCount
    }
}

export default useDashboard;