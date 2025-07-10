import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
];

function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                FullStackTask 🚀
            </Typography>
            <List>
                {navItems.map(({ label, href }) => (
                    <ListItem key={label} disablePadding>
                        <ListItemButton component="a" href={href} sx={{ textAlign: "center" }}>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open navigation menu"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => (window.location.href = "/")}
                    >
                        FullStackTask 🚀
                    </Typography>
                    {!isMobile && (
                        <Box>
                            {navItems.map(({ label, href }) => (
                                <Button
                                    key={label}
                                    color="inherit"
                                    href={href}
                                    sx={{ textTransform: "none", fontWeight: "medium" }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Header;