import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import PredictForm from "./PredictForm";
import Report from "./Report";
import PastData from "./PastData";
import ForgotPassword from "./ForgotPassword";

function App() {
	return (
		<div>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/predict' element={<PredictForm />} />
				<Route path='/report' element={<Report />} />
				<Route path='/pastdata' element={<PastData />} />
				<Route path='/forgot' element={<ForgotPassword />} />
			</Routes>
		</div>
	);
}

export default App;
