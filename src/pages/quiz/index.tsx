import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../../components/layout';

const QuizLayout = () => {
    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-4">
                <Outlet />
            </div>
        </Layout>
    );
};

export default QuizLayout;
