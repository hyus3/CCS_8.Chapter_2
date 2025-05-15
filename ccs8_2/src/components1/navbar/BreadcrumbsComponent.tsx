// src/components/BreadcrumbsComponent.tsx
import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface BreadcrumbItem {
    label: string;
    path?: string;
    state?: any;
}

interface BreadcrumbsComponentProps {
    items: BreadcrumbItem[];
}

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = ({ items }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
            marginBottom: '1rem',
            fontFamily: 'Helvetica',
            '& .MuiBreadcrumbs-li': {
            fontSize: '0.9rem',
                },
            }}
        >
        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return isLast ? (
                    <Typography
                        key={item.label}
                color="#cd3234"
            sx={{ fontSize: '0.9rem', fontWeight: 500 }}
        >
            {item.label}
            </Typography>
        ) : (
                <Link
                    key={item.label}
            underline="hover"
            color="#6e4e33"
            onClick={() => item.path && navigate(item.path, { state: item.state })}
            sx={{ cursor: 'pointer', fontSize: '0.9rem' }}
        >
            {item.label}
            </Link>
        );
        })}
        </Breadcrumbs>
    );
};

export default BreadcrumbsComponent;