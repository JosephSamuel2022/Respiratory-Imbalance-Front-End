import React, { useState } from "react";
import axios from "axios";
import { parse } from "node-html-parser";
import {
	MDBBtn,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBRadio,
	MDBInput,
	MDBIcon,
	MDBCheckbox,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale, faFemale } from "@fortawesome/free-solid-svg-icons";

import "./App.css";

function Login() {
	const navigate = useNavigate();
	const [patientError, setPatientError] = useState(false);
	function handleSwitchToRegister() {
		navigate("/register");
	}
	const [pid, setPid] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		// Prepare the data to be sent to the API
		const data = {
			pid: pid,
			password: password,
		};

		try {
			setPatientError(false);
			const response = await axios.post(
				"https://respiratory-backend.onrender.com/api/login",
				data
			);

			const html = response.data;
			const root = parse(html);
			const answerElement = root.querySelector("#result-data");
			const extractedAnswer = answerElement.text;
			console.log("Result Data:", extractedAnswer);
			if (extractedAnswer === "true") {
				// Navigate to the PredictForm component
				sessionStorage.setItem("patientId", pid);
				navigate("/predict");
			} else {
				setPatientError(true);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	function handlePidChange(e) {
		setPid(e.target.value);
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value);
	}

	return (
		<MDBContainer fluid>
			<MDBRow>
				<MDBCol sm='6'>
					<div className='d-flex flex-row logo-container'>
						<img src='/images/docicon.jpg' className='img-fluid me-3' />
						<span className='h1 fw-bold mb-0'>
							Respiratory Imbalance Predictor
						</span>
					</div>

					<div className='d-flex flex-column justify-content-center align-items-center h-custom-2  pt-4 login-container'>
						<h3
							className='fw-normal mb-3 ps-5 pb-3'
							style={{ letterSpacing: "1px" }}>
							Log in
						</h3>

						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='id-card-alt me-3' size='lg' />
							<MDBInput
								label='Patient ID'
								id='form0'
								type='text'
								size='lg'
								onChange={handlePidChange}
							/>
						</div>
						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='lock me-3' size='lg' />
							<MDBInput
								label='Password'
								id='form3'
								type='password'
								size='lg'
								onChange={handlePasswordChange}
							/>
						</div>
						{patientError && (
							<div className='error-text'>Invalid Patient Id or Password</div>
						)}
						<MDBBtn
							className='mb-4 mt-2'
							size='lg'
							onClick={handleLogin}
							disabled={!pid || !password}>
							Login
						</MDBBtn>
						<p className='small mb-5 pb-lg-3 d-flex justify-content-center'>
							<a
								className='text-muted'
								href='/forgot'
								onClick={() => {
									navigate("/forgot");
								}}>
								Forgot password?
							</a>
						</p>
						<p className='d-flex justify-content-center'>
							Don't have an account?{" "}
							<a
								href='/register'
								className='link-info'
								onClick={handleSwitchToRegister}>
								Register here
							</a>
						</p>
					</div>
				</MDBCol>
				<MDBCol sm='6' className='d-none d-sm-block px-0'>
					<img
						src='/images/maledoctor.png'
						alt='Login image'
						className='w-100'
						style={{ objectFit: "cover", objectPosition: "left" }}
					/>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
}

export default Login;
