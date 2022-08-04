import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import Page from '../../components/Page';
import Icon from '../../../src/assets/Images/icon.png';
import {
  PAYMENTDETAILSANDVARIATIONS,
  RECEIPTSANDDEDUCTION,
} from '../../constant/FieldConstant';
import { PAYMENTDETAILSANDVARIATIONSMSG } from '../../constant/MessageConstant';
import underConstruction from '../../../src/assets/Images/UnderConstruction.png';
import ViewOtherDeduction from './otherDeduction/ViewOtherDeduction';


const ViewReceiptsAndDeductions = ({residentId}) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Page title="">
          <div className="head mt-3">
            <img src={Icon} className="icon" />
            {RECEIPTSANDDEDUCTION}
          </div>
          <hr className="headerBorder" />
          <div
            style={{ height: '350px' }}
            className="d-flex align-items-center justify-content-around "
          >
            <img src={underConstruction} alt="#" />
          </div>
        </Page>
      )}
    </>
  );
};

export default ViewReceiptsAndDeductions;
