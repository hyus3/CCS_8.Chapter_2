import {Avatar} from "@mui/material";

type prop = {
    loggedIn:boolean
}

function ProfileIcon(props: prop) {
    const img = props.loggedIn
        ? "https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.1200.jpg"
        : "/broken-image.jpg"

    return (
        <>
            <Avatar
                src={img}
                sx={{
                    width: "100%",
                    height: "100%"
                }}
            />
        </>
    )
}

export default ProfileIcon