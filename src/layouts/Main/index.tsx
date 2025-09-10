import React, { useMemo } from 'react';
import classNames from 'classnames';
import { routes } from 'config';
import { Outlet, useLocation } from '@umijs/max';
import './index.less';

export const Main: React.FC = ({}) => {
    const { pathname } = useLocation();

    return (
        <main id="gm-layout-main" className={classNames('layout-main', {})}>
            <Outlet />
        </main>
    );
};
