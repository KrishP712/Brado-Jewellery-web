import Example from "./components/Example";
import useUser from "./useUser";

const User = () => {
    const { } = useUser();

    return <div>
        <Example />
    </div>;
};

export default User;
