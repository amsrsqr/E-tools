import ViewLiquidity from "./views/Master/Liquidity/ViewLiquidity";
import ViewDapDacChargesAndReciepts from "./views/Master/dapDacChargesAndReceipts/ViewDapDacChargesAndReceipts";

import React from "react";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./views/Master/Dashboard/Dashboard";
import ViewBondDeductionType from "./views/Master/bondDeductionType/ViewBondDeductionType";
import ViewResidentLetter from "./views/Master/residentLetter/ViewResidentLetter";

import ViewAuthorisation from "./views/Setting/authorisation/ViewAuthorisation";
import LayoutWithoutSideMenu from "./layouts/LayoutWithoutSideMenu";
import ViewPreferences from "./views/Setting/Preferences/Preferences";
import ViewResident from "./views/Master/registerResident/ViewResident";
import ViewFeeAndCharges from "./views/Master/feeAndCharges/ViewFeesAndCharges";
import ViewTagsDirectory from "./views/Master/tagsDirectory/ViewTagsDirectory";

import ViewResidentRepresentative from "./views/Master/residentRepresentative/ViewResidentRepresentative";
import ViewDocumentType from "./views/Master/documentType/ViewDocumentType";
import ViewTransferredFacilities from "./views/Master/transferredFacilities/ViewTransferredFacilities";
import ViewRepresentativeCategory from "./views/Master/representativeCategory/ViewRepresentativeCategory";
import ViewAdditionalServices from "./views/Master/additionalServices/ViewAdditionalServices";
import ResidentNavigationBar from "./views/Master/ResidentNavigationStepbar";
import AddResident from "./views/Resident/AddResident";
import ViewPaymentDetails from "./views/Register/ViewPaymentDetails";

import ViewAdditionalPeriodRules from "./views/Register/ReceiptsDeduction/ViewAdditionalPeriodRules";
import EndOfPeriod from "./views/Master/endOfPeriod/EndOfPeriod";
import Reports from "./views/reports/Reports";
import ViewPrudentialDashboard from "./views/PrudentialRequirement/ViewPrudentialDashboard";
import ViewNotesAndLinks from "./views/PrudentialRequirement/NotesAndLinks/ViewNotesAndLinks";
import ViewPrudentialTab from "./views/PrudentialRequirement/PrudentialRequirements/ViewPrudentialTab";
// import ViewListDocumentLogo from "./views/Facility/documentAndLogo/ViewListDocumentLogo";
import ViewFacilitiesList from "./views/Facility/viewFacilitiesList";

// const esaBasePath = "eSAWeb/";
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: `eRADWeb/viewResident`,
        element: <ViewResident />,
      },
      { path: `eRADWeb/endOfPeriod`, element: <EndOfPeriod /> },
      { path: `eRADWeb/reports`, element: <Reports /> },
      { path: `eRADWeb/facility`, element: <ViewFacilitiesList /> },

      {
        path: `eRADWeb/ViewAdditionalPeriodRules`,
        element: <ViewAdditionalPeriodRules />,
      },
      { path: `eRADWeb/liquidity`, element: <ViewLiquidity /> },
      {
        path: `eRADWeb/residentrepresentative`,
        element: <ViewResidentRepresentative />,
      },
      { path: `eRADWeb/deductiontype`, element: <ViewBondDeductionType /> },
      { path: "eRADWeb/residentletter", element: <ViewResidentLetter /> },
      {
        path: `eRADWeb/dapDacChargesAndReceipts`,
        element: <ViewDapDacChargesAndReciepts />,
      },
      { path: "eRADWeb/authorisation", element: <ViewAuthorisation /> },
      { path: "eRADWeb/preferences", element: <ViewPreferences /> },
      { path: "eRADWeb/feeAndCharges", element: <ViewFeeAndCharges /> },
      { path: "eRADWeb/tagsDirectory", element: <ViewTagsDirectory /> },
      { path: "eRADWeb/documenttypes", element: <ViewDocumentType /> },
      {
        path: "eRADWeb/transferredfacilities",
        element: <ViewTransferredFacilities />,
      },
      {
        path: "eRADWeb/representativecategory",
        element: <ViewRepresentativeCategory />,
      },
      {
        path: "eRADWeb/additionalservices",
        element: <ViewAdditionalServices />,
      },
      {
        path: "eRADWeb/prudentialdashboard",
        element: <ViewPrudentialDashboard />,
      },
      {
        path: "eRADWeb/notesandlinks",
        element: <ViewNotesAndLinks />,
      },
      {
        path: "eRADWeb/prudentialtabs",
        element: <ViewPrudentialTab />,
      },
      {
        path: "eRADWeb/navbar",
        element: <ResidentNavigationBar />,
      },
      { path: "eRADWeb/addResident", element: <AddResident /> },
      { path: "/:email", element: <Dashboard /> },
      { path: `eRADWeb/paymentdetails`, element: <ViewPaymentDetails /> },
      { path: "/", element: <ViewResident /> },
      { path: "*", element: <ViewResident /> },
    ],
  },
  {
    path: "/",
    element: <LayoutWithoutSideMenu />,
    children: [{ path: "/", element: <LayoutWithoutSideMenu /> }],
  },
];

export default routes;
