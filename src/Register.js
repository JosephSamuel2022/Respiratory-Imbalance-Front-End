import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import "./App.css";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale, faFemale } from "@fortawesome/free-solid-svg-icons";

function Register() {
	const navigate = useNavigate();
	const [gender, setGender] = useState("male");
	const today = new Date();
	const defaultDate = new Date(
		today.getFullYear() - 20,
		today.getMonth(),
		today.getDate()
	);

	const [dateOfBirth, setDateOfBirth] = useState(defaultDate);
	const [pid, setPid] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const [pidError, setPidError] = useState(false);
	const [nameError, setNameError] = useState(false);

	const [passwordError, setPasswordError] = useState(false);
	const [patientError, setPatientError] = useState(false);
	const datePickerRef = useRef(null);
	const [termsAgreed, setTermsAgreed] = useState(false);

	const handleRegister = async () => {
		// Prepare the data to be sent to the API
		if (!pid || !name || !password) {
			if (!pid) setPidError(true);
			if (!name) setNameError(true);
			if (!dateOfBirth) setDateOfBirthError(true);
			if (!password) setPasswordError(true);
			if (!termsAgreed) setTermsError(true);
			return;
		}

		if (termsAgreed) {
			const data = {
				pid: pid,
				dob: dateOfBirth,
				gender: gender,
				password: password,
				name: name,
			};

			try {
				setPatientError(false);
				const response = await axios.post(
					"https://respiratory-backend.onrender.com/api/signup",
					data
				);
				const html = response.data;
				const root = parse(html);
				const answerElement = root.querySelector("#result-data");
				const extractedAnswer = answerElement.text;

				if (extractedAnswer === "no") setPatientError(true);
				else navigate("/");
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	function handleSwitchToLogin() {
		navigate("/");
	}
	function handleGenderChange(e) {
		setGender(e.target.value);
	}

	function handleDateChange(date) {
		setDateOfBirth(date);
	}

	function handlePidChange(e) {
		setPid(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setPidError(true);
		} else {
			setPidError(false);
		}
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setPasswordError(true);
		} else {
			setPasswordError(false);
		}
	}

	function handleNameChange(e) {
		setName(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setNameError(true);
		} else {
			setNameError(false);
		}
	}

	function toggleDatePicker() {
		if (datePickerRef.current) {
			datePickerRef.current.setOpen(true);
		}
	}
	const handlePidBlur = () => {
		if (!pid) setPidError(true);
		else setPidError(false);
	};

	const handleNameBlur = () => {
		if (!name) setNameError(true);
		else setNameError(false);
	};

	const handlePasswordBlur = () => {
		if (!password) setPasswordError(true);
		else setPasswordError(false);
	};

	function hasErrors() {
		return !!nameError || !!pidError || !!passwordError;
	}

	return (
		<MDBContainer fluid>
			<MDBRow>
				<MDBCol sm='6'>
					<div className='d-flex flex-row logo-containerr'>
						<img src='/images/docicon.jpg' className='img-fluid me-3' />
						<span className='h1 fw-bold mb-0'>
							Respiratory Imbalance Predictor
						</span>
					</div>

					<div className='d-flex flex-column justify-content-center align-items-center login-containerr'>
						<h3
							className='fw-normal mb-3 ps-5 pb-3'
							style={{ letterSpacing: "1px" }}>
							Register
						</h3>

						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='id-card-alt me-3' size='lg' />
							<MDBInput
								label='Patient ID'
								id='form0'
								type='text'
								size='lg'
								onChange={handlePidChange}
								onBlur={handlePidBlur}
							/>

							{pidError && <div className='error-text'>*</div>}
						</div>
						<div className='d-flex flex-row align-items-center mb-4 w-50'>
							<MDBIcon fas icon='user me-3' size='lg' />
							<MDBInput
								label='Patient Name'
								id='form2'
								type='text'
								size='lg'
								onChange={handleNameChange}
								onBlur={handleNameBlur}
							/>
							{nameError && <div className='error-text'>*</div>}
						</div>
						<div className='mb-4'>
							<FontAwesomeIcon icon={faMale} size='lg' className='me-2' />
							<MDBRadio
								inline
								label='Male'
								value='male'
								checked={gender === "male"}
								onChange={handleGenderChange}
							/>
							<FontAwesomeIcon icon={faFemale} size='lg' className='me-2' />
							<MDBRadio
								inline
								label='Female'
								value='female'
								checked={gender === "female"}
								onChange={handleGenderChange}
							/>
						</div>

						<div className='form-outline datepicker mb-4 w-50'>
							<div className='d-flex align-items-center'>
								<MDBIcon far icon='calendar-alt me-3' size='lg' />
								<MDBInput
									label='Date of Birth'
									id='form1'
									type='text'
									size='lg'
									value={
										dateOfBirth
											? dateOfBirth.toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
											  })
											: ""
									}
									onClick={toggleDatePicker}
									readOnly
								/>
							</div>

							<DatePicker
								ref={datePickerRef}
								className='form-control d-none'
								selected={dateOfBirth}
								onChange={handleDateChange}
								dateFormat='dd-MM-yyyy'
								showYearDropdown
								scrollableYearDropdown
								yearDropdownItemNumber={100}
								customDropdownStyles={{
									dropdown: {
										top: "unset",
										bottom: "100%",
										transform: "translateY(-8px)",
										position: "absolute",
									},
									yearDropdown: {
										maxHeight: "100px",
										overflowY: "auto",
									},
								}}
								maxDate={new Date(2023, 11, 31)}
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
								onBlur={handlePasswordBlur}
							/>
							{passwordError && <div className='error-text'>*</div>}
						</div>

						<div className='mb-2'>
							<MDBCheckbox
								name='flexCheck'
								value=''
								id='flexCheckDefault'
								label='I agree all statements in Terms of service'
								checked={termsAgreed}
								onChange={() => setTermsAgreed(!termsAgreed)}
								disabled={!pid || !name || !password}
							/>
						</div>
						{patientError && (
							<div className='error-text'>Patient ID already registered</div>
						)}
						<MDBBtn
							className='mb-4'
							size='lg'
							onClick={handleRegister}
							disabled={!termsAgreed || hasErrors()}>
							Register
						</MDBBtn>
						<p className='ms-5'>
							Already have an account?{" "}
							<a href='/' className='link-info' onClick={handleSwitchToLogin}>
								Login here
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

export default Register;
