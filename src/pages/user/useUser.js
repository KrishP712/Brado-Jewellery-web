import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getUserLists } from "../../redux/slices/userSlice";

const useUser = () => {
    const dispatch = useDispatch();
    const { users, user } = useSelector((state) => state.user);

    useEffect(() => {
        // dispatch(getUserLists());
    }, []);


    return {

    }
}

export default useUser;