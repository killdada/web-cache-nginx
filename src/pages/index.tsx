import { Link } from 'umi';

import styles from './index.less';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>首页</h1>
      <div>
      <Link to="/a">a页面</Link>
      </div>
      <div>
        <Link to="/b">b页面</Link>
      </div>
    </div>
  );
}
