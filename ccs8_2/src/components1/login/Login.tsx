import {Button} from "@mui/material";

type prop = {
    loggedin: boolean
    setLoggedin: (value: boolean) => void;
}
function Login(props: prop) {
    const handleLogout = () => {
        props.setLoggedin(false); // this updates App's state
    };
    return (
        <>
            <Button onClick={handleLogout}>logout</Button>
        </>
    )
}

export default Login