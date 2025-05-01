import NavBtn from "./NavBtn";
import {Box} from "@mui/material";
import SearchBar from "./SearchBar";
import ProfileIcon from "./ProfileIcon";
import Hamburger from "./Hamburger";
import {useLocation} from "react-router-dom";
import {useState} from "react";

type props = {
    path:string[];
    loggedIn:boolean
    setLoggedin: (value: boolean) => void;
}

function NavBar(prop: props) {
    const btns = ["home", "blue", "green", "home"]
    const path = prop.path
    const location = useLocation()
    const [state, setState] = useState(false)

    return (
        <Box sx={{
            direction: "row",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "10vh",
        }}>
            <Box
                sx={{
                    display: {xs: "flex", sm: "none"},
                    justifyContent: "center",
                    width: "10vw"
                }}
            >
                <Hamburger />
            </Box>
            <Box
                sx={{
                    direction: "row",
                    width: "50%",
                    display: {xs: "none", sm: "flex"},
                    justifyContent: "space-between"
                }}>
                {btns.map((btn, index) =>
                    <NavBtn
                        name={btn}
                        path={'/' + path[index]}
                        onClick={() => setState(state => !state)}
                    />
                )}
            </Box>

            <Box
                sx={{
                    width: {xs: "40vw" ,sm: "30vw"},
                    display: "flex",
                    justifyItems: "center",
                    alignItems: "center"
                }}
            >
                <SearchBar
                    path={location.pathname}
                    state={state}
                />
            </Box>
            <Box
                sx={{
                    width: {xs: "10vw", sm: "5vw"},
                    height: {xs: "10vw", sm: "5vw"}
                }}
            >
                <ProfileIcon loggedIn={prop.loggedIn}/>
            </Box>
        </Box>

    )
}

export default NavBar