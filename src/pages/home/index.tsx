import React from 'react';
import './index.less';

interface HomeProps {
    style?: React.CSSProperties;
    className?: string;
}

export const Home: React.FC<HomeProps> = () => {
    return <section className="page-home font-family relative">home</section>;
};

export default Home;
