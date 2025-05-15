import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useNavigate } from 'react-router-dom';
import {Button, Box, Typography} from '@mui/material';
import BreadcrumbsComponent from "../navbar/BreadcrumbsComponent";

const Sitemap: React.FC = () => {
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Sitemap' },
    ];

    const navigateTo = (path: string, state?: any) => {
        navigate(path, { state });
    };

    const NodeButton = ({ label, path, state }: { label: string; path: string; state?: any }) => (
        <Button
            variant="contained"
            onClick={() => navigateTo(path, state)}
            sx={{
                backgroundColor: '#cd3234',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#b02b2d' },
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                fontFamily: 'Helvetica',
                textTransform: 'none',
                fontSize: '0.9rem',
            }}
        >
            {label}
        </Button>
    );

    return (
        <Box
            sx={{
                padding: '60px 1rem',
                margin: '0 auto',
                maxWidth: '1200px',
                fontFamily: 'Helvetica',
                minHeight: '100vh',
                backgroundColor: '#eeeae4',
            }}
        >
            <BreadcrumbsComponent items={breadcrumbItems} />
            <Box sx={{ mb: 4 }}>
                <Typography variant='h5' sx={{color: '#cd3234', fontWeight: 'bold'}}>Sitemap</Typography>
                <Typography variant='h3' sx={{color: '#000000', fontWeight: 'semi-bold'}}>Navigational map of the site</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tree
                    lineHeight= {'40px'}
                    lineWidth={'2px'}
                    label={
                        <NodeButton label="Home" path="/" />
                    }
                >
                    <TreeNode
                        label={
                            <NodeButton label="Search by Name" path="/search" state={{ query: 'Coffee shops in Dumaguete' }} />
                        }
                    >
                        <TreeNode
                            label={
                                <NodeButton label="Cafe Info" path="/cafe/:placeId" />
                            }
                        />
                    </TreeNode>
                    <TreeNode
                        label={
                            <NodeButton label="Explore" path="/explore" />
                        }
                    >
                        <TreeNode
                            label={
                                <NodeButton label="Cafe Info" path="/cafe/:placeId" />
                            }
                        />
                    </TreeNode>
                    <TreeNode
                        label={
                            <NodeButton label="Search by Preference" path="/mapview" state={{ tags: [] }} />
                        }
                    ><TreeNode
                        label={
                            <NodeButton label="Cafe Info" path="/cafe/:placeId" />
                        }
                    /></TreeNode>
                    <TreeNode
                        label={
                            <NodeButton label="Coffee Profiles" path="/coffeeprofiles" />
                        }
                    />
                    <TreeNode
                        label={
                            <NodeButton label="Contact Us" path="/contactus" />
                        }
                    />
                    <TreeNode
                        label={
                            <NodeButton label="FAQ" path="/faq" />
                        }
                    />
                    <TreeNode
                        label={
                            <NodeButton label="About Us" path="/aboutus" />
                        }
                    />
                    <TreeNode
                        label={
                            <NodeButton label="Profile" path="/profile" />
                        }
                    >
                        <TreeNode
                            label={
                                <NodeButton label="Cafe Info" path="/cafe/:placeId" />
                            }
                        />
                    </TreeNode>
                    <TreeNode
                        label={
                            <NodeButton label="Login" path="/login" />
                        }
                    />
                </Tree>
            </Box>
        </Box>
    );
};

export default Sitemap;