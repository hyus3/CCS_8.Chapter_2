import {Avatar} from "@mui/material";

function ProfileIcon() {
    const img = "https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.1200.jpg"
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