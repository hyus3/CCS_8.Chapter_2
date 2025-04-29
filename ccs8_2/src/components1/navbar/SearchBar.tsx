import SearchIcon from '@mui/icons-material/Search';
import {InputAdornment, TextField} from "@mui/material";

function SearchBar() {
    return (
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