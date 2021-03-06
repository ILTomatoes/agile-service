import React from 'react';
import {
  Page, Header, Content, Breadcrumb,
} from '@choerodon/boot';
import {
  Button, Icon, Spin,
} from 'choerodon-ui';
import Accumulation from '@/components/charts/accumulation';
import AccumulationSearch from '@/components/charts/accumulation/search';
import useAccumulationReport from '@/components/charts/accumulation/useAccumulationReport';
import pic from '@/assets/image/emptyChart.svg';
import { linkUrl } from '@/utils/to';
import LINK_URL from '@/constants/LINK_URL';
import NoDataComponent from '../Component/noData';
import SwithChart from '../Component/switchChart';

const AccumulationReport: React.FC = () => {
  const [searchProps, props, refresh] = useAccumulationReport();
  const renderContent = () => {
    const { loading, data } = props;
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
          <Spin />
        </div>
      );
    }
    if (!data.length) {
      return (
        <NoDataComponent title="问题" links={[{ name: '问题管理', link: '/agile/work-list/issue' }]} img={pic} />
      );
    }
    return (
      <div className="c7n-accumulation-report" style={{ flexGrow: 1, height: '100%' }}>
        <Accumulation {...props} />
      </div>
    );
  };

  return (
    <Page service={['choerodon.code.project.operation.chart.ps.choerodon.code.project.operation.chart.ps.cumulative_flow_diagram']}>
      <Header
        title="累积流量图"
        backPath={linkUrl(LINK_URL.report)}
      >
        <SwithChart
          // @ts-ignore
          current="accumulation"
        />
        <Button funcType="flat" onClick={() => refresh()}>
          <Icon type="refresh icon" />
          <span>刷新</span>
        </Button>
      </Header>
      <Breadcrumb title="累积流量图" />
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="c7n-accumulation-filter">
          <AccumulationSearch {...searchProps} />
        </div>
        {renderContent()}
      </Content>
    </Page>
  );
};
export default AccumulationReport;
