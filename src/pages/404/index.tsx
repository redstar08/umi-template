import { Button } from 'antd';
import { useIntl } from 'react-intl';
import { history } from '@umijs/max';
import { Image } from '@/components';
import './index.less';

const Error = () => {
    const intl = useIntl();

    return (
        <div className="page-error">
            <Image name="common-404" width={400} />
            <Button onClick={() => history.push('/')}>返回</Button>
        </div>
    );
};

export default Error;
