import React from "react";
import { Route, Switch } from "react-router-dom";
import Routecardetail from "../components/Cars/Cardetail/Routecardetail";
import { AddtionalDetails } from "../components/AddtionalDetails/AddtionalDetails";
import Routecarnumber from "../components/Cars/Carnumber/Routecarnumber";
import Routeexpiry from "../components/Cars/Expirydate/Routeexpiry";
import Routepolicy from "../components/Cars/Lastpolicy/Routepolicy";
import Routepincode from "../components/Cars/Pincode/Routepincode";
import Routeuseofcar from "../components/Cars/Useofcar/Routeuseofcar";
import { DifferentPlanOptions } from "../components/PlanOptions/DiffPlanOptions";
import { CustomPolicyBuilder } from "../components/PlanOptions/CustomPolicyBuilder";
import Routeyear from "../components/Cars/Year/Routeyear";
import Routemonth from "../components/Cars/Month/Routemonth";
import Routecartype from "../components/Cars/Cartype/Routecartype";
import { AdditionalCovers } from "../components/PlanOptions/AdditionalCovers";
import { FinalDetails } from "../components/FinalDetails/FinalDetails";
import Home from "../components/homepage/Home";
import Paysuccessfull from "../components/Paysuccessfull/Paysuccessfull";
import { CardPayment } from "../components/payment/CardPayment";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import MainLayout from "../components/Layout/MainLayout";
import RouteBikePincode from "../components/Bikes/Pincode/Routepincode";
import RouteUseofbike from "../components/Bikes/Useofbike/Routeuseofbike";
import RouteBikeNumber from "../components/Bikes/BikeNumber/RouteBikeNumber";
import RouteBikeDetails from "../components/Bikes/BikeDetails/RouteBikeDetails";
import RouteBikeExpiry from "../components/Bikes/BikeExpiry/RouteBikeExpiry";
import RouteBikePlans from "../components/Bikes/Plans/RouteBikePlans";
import RouteBikeCustomPolicy from "../components/Bikes/CustomPolicy/RouteBikeCustomPolicy";
import RouteBikeAdditionalDetails from "../components/Bikes/AdditionalDetails/RouteBikeAdditionalDetails";
import RouteHealthPlans from "../components/Health/Plans/RouteHealthPlans";
import RouteHealthAdditionalDetails from "../components/Health/AdditionalDetails/RouteHealthAdditionalDetails";
import RouteHealthProfile from "../components/Health/Profile/RouteHealthProfile";
import RouteHealthMedicalInfo from "../components/Health/MedicalInfo/RouteHealthMedicalInfo";
import HealthCustomPlan from '../components/Health/CustomPlan/HealthCustomPlan';
import VehicleDetails from '../components/VehicleDetails/VehicleDetails';
import About from '../components/About/About';
import ClaimsRoutes from '../components/Claims/ClaimsRoutes';

// Public route with layout
const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <MainLayout>
        <Component {...props} />
      </MainLayout>
    )}
  />
);

function Routes() {
  return (
    <Switch>
      {/* Public Routes */}
      <PublicRoute path="/" exact component={Home} />
      <PublicRoute path="/about" exact component={About} />

      {/* Authentication Routes */}
      <PublicRoute path="/login" exact component={Login} />
      <PublicRoute path="/register" exact component={Register} />

      {/* Dashboard Routes */}
      <PublicRoute path="/dashboard" exact component={Dashboard} />

      {/* Vehicle Details Route */}
      <PublicRoute path="/vehicle-details" exact component={VehicleDetails} />

      {/* Car Routes */}
      <PublicRoute path="/cars/useofcar" exact component={Routeuseofcar} />
      <PublicRoute path="/cars/pincode" exact component={Routepincode} />
      <PublicRoute path="/cars/carnumber" exact component={Routecarnumber} />
      <PublicRoute path="/cars/year" exact component={Routeyear} />
      <PublicRoute path="/cars/month" exact component={Routemonth} />
      <PublicRoute path="/cars/cartype" exact component={Routecartype} />
      <PublicRoute path="/cars/expiry" exact component={Routeexpiry} />
      <PublicRoute path="/cars/policy" exact component={Routepolicy} />
      <PublicRoute path="/cars/cardetail" exact component={Routecardetail} />

      {/* Plan Routes */}
      <PublicRoute path="/plans" exact component={DifferentPlanOptions} />
      <PublicRoute path="/custom-policy" exact component={CustomPolicyBuilder} />
      <PublicRoute path="/additionalCovers" exact component={AdditionalCovers} />
      <PublicRoute path="/addtional-details" exact component={AddtionalDetails} />
      <PublicRoute path="/final-details" exact component={FinalDetails} />
      <PublicRoute path="/cardPayment" exact component={CardPayment} />
      <PublicRoute path="/successfull" exact component={Paysuccessfull} />
      
      {/* Bike Routes */}
      <PublicRoute path="/bikes/pincode" exact component={RouteBikePincode} />
      <PublicRoute path="/bikes/bikenumber" exact component={RouteBikeNumber} />
      <PublicRoute path="/bikes/useofbike" exact component={RouteUseofbike} />
      <PublicRoute path="/bikes/bikedetails" exact component={RouteBikeDetails} />
      <PublicRoute path="/bikes/bikeexpiry" exact component={RouteBikeExpiry} />
      <PublicRoute path="/bikes/plans" exact component={RouteBikePlans} />
      <PublicRoute path="/bikes/custom-policy" exact component={RouteBikeCustomPolicy} />
      <PublicRoute path="/bikes/additional-details" exact component={RouteBikeAdditionalDetails} />
      
      {/* Health Routes */}
      <PublicRoute path="/health/profile" exact component={RouteHealthProfile} />
      <PublicRoute path="/health/medical-info" exact component={RouteHealthMedicalInfo} />
      <PublicRoute path="/health/plans" exact component={RouteHealthPlans} />
      <PublicRoute path="/health/additional-details" exact component={RouteHealthAdditionalDetails} />
      <PublicRoute path="/health/custom-plan" exact component={HealthCustomPlan} />
      
      {/* Claims Routes */}
      <PublicRoute path="/claims" component={ClaimsRoutes} />
      
      {/* 404 Route */}
      <PublicRoute path="*" component={() => <h1>404: Page not found</h1>} />
    </Switch>
  );
}

export default Routes;
