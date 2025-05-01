import SearchIcon from '@mui/icons-material/Search';
import {InputAdornment, TextField} from "@mui/material";

type prop = {
    path:any
    state:boolean
}
function SearchBar(props: prop) {
    return (
        props.path === "/"
            ? <></> :
        <>
            <TextField
                variant="outlined"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
                placeholder="Search"
                sx={{
                    width: "100%",
                }}
            />
        </>
    )
}

export default SearchBar