import NavBtn from "./NavBtn";
import {Box} from "@mui/material";
import SearchBar from "./SearchBar";
import ProfileIcon from "./ProfileIcon";
import Hamburger from "./Hamburger";

type props = {
    path:string[];
}

function NavBar(prop: props) {
    const btns = ["home", "blue", "green", "home"]
    const path = prop.path
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
                <SearchBar />
            </Box>
            <Box
                sx={{
                    width: {xs: "10vw", sm: "5vw"},
                    height: {xs: "10vw", sm: "5vw"}
                }}
            >
                <ProfileIcon />
            </Box>
        </Box>

    )
}

export default NavBar