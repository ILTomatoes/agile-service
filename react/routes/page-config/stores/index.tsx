import React, { createContext, useState, useContext } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import IsProgramContext from '@/hooks/useIsProgrom';
import { getApplyType } from '@/utils/common';

interface Context {

}
const PageConfigContext = createContext({} as Context);
export function usePageConfigContext() {
  return useContext(PageConfigContext);
}
// @ts-ignore
export const PageConfigProvider: React.FC<Context> = injectIntl(inject('AppState')(
  (props) => {
    const [reLoad, setReLoad] = useState(false);
    const [pageDetailItem, setPageDetailItem] = useState({});
    const [pageDetailVisible, setPageDetailVisible] = useState(false);
    const [objectDetailItem, setObjectDetailItem] = useState({
      schemeCode: 'agile_issue',
    });
    const value = {
      // @ts-ignore
      ...props,
      pageDetailItem,
      setPageDetailItem,
      pageDetailVisible,
      setPageDetailVisible,
      objectDetailItem,
      setObjectDetailItem,
      reLoad,
      setReLoad,
    };
    return (
      <IsProgramContext.Provider value={{ isProgram: getApplyType() === 'program' }}>
        <PageConfigContext.Provider value={value}>

          {// @ts-ignore
            props.children
          }
        </PageConfigContext.Provider>
      </IsProgramContext.Provider>
    );
  },
));
export default PageConfigProvider;
