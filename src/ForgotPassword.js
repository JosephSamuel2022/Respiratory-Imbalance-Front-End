import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { parse } from "node-html-parser";
import "react-datepicker/dist/react-datepicker.css";
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

function ForgotPassword() {
	const navigate = useNavigate();
	const [pid, setPid] = useState("");
	const today = new Date();
	const defaultDate = new Date(
		today.getFullYear() - 20,
		today.getMonth(),
		today.getDate()
	);

	const [dateOfBirth, setDateOfBirth] = useState(defaultDate);
	const [newPassword, setNewPassword] = useState("");
	const datePickerRef = useRef(null);
	const [notFoundError, setNotFoundError] = useState(false);

	const [pidError, setPidError] = useState(false);

	const [newPasswordError, setNewPasswordError] = useState(false);

	function handlePidChange(e) {
		setPid(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setPidError(true);
		} else {
			setPidError(false);
		}
	}

	function handleDateChange(date) {
		setDateOfBirth(date);
	}

	function handleNewPasswordChange(e) {
		setNewPassword(e.target.value);
		const inputValue = e.target.value.trim();
		if (inputValue === "") {
			setNewPasswordError(true);
		} else {
			setNewPasswordError(false);
		}
	}

	function handlePidBlur() {
		const inputValue = pid.trim();
		if (inputValue === "") {
			setPidError(true);
		} else {
			setPidError(false);
		}
	}

	function handleNewPasswordBlur() {
		const inputValue = newPassword.trim();
		if (inputValue === "") {
			setNewPasswordError(true);
		} else {
			setNewPasswordError(false);
		}
	}

	function toggleDatePicker() {
		if (datePickerRef.current) {
			datePickerRef.current.setOpen(true);
		}
	}

	const isConfirmButtonDisabled =
		!pid || !dateOfBirth || !newPassword || pidError || newPasswordError;

	const handleForgotPassword = async () => {
		const data = {
			patientId: pid,
			newPassword: newPassword,
			dob: dateOfBirth.toISOString(),
		};
		console.log(dateOfBirth);
		try {
			const response = await axios.post(
				"https://respiratory-backend.onrender.com/api/forgot",
				data
			);

			const html = response.data;
			const root = parse(html);
			const answerElement = root.querySelector("#resdiv");
			const extractedAnswer = answerElement.text;
			console.log(extractedAnswer);

			if (extractedAnswer === "yes") {
				navigate("/");
			} else {
				setNotFoundError(true);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

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

					<div className='d-flex flex-column justify-content-center align-items-center h-custom-2 pt-4 login-container'>
						<h3
							className='fw-normal mb-3 ps-5 pb-3'
							style={{ letterSpacing: "1px" }}>
							Reset Password
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
								label='New Password'
								id='form3'
								type='password'
								size='lg'
								onChange={handleNewPasswordChange}
								onBlur={handleNewPasswordBlur}
							/>
							{newPasswordError && <div className='error-text'>*</div>}
						</div>
						{notFoundError && (
							<div className='error-text'>
								Incorrect Patient ID or Date of Birth
							</div>
						)}

						<MDBBtn
							className='mb-4 mt-2'
							size='lg'
							onClick={handleForgotPassword}
							disabled={isConfirmButtonDisabled}>
							Confirm
						</MDBBtn>
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

export default ForgotPassword;
