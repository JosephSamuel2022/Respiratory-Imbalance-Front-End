import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { parse } from "node-html-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "./Report.css"; // Import the CSS file for Report component

const Report = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState(0);
	const [date, setDate] = useState("");

	const printReport = () => {
		window.print();
	};

	const getPatientDetails = async () => {
		// Prepare the data to be sent to the API
		const pid = sessionStorage.getItem("patientId");
		const data = {
			pid: pid,
		};

		try {
			const response = await axios.post(
				"https://respiratory-backend.onrender.com/api/info",
				data
			);

			const html = response.data;
			const root = parse(html);
			const nameElement = root.querySelector("#nameDiv");
			const name = nameElement.text;
			const genderElement = root.querySelector("#genderDiv");
			const gender = genderElement.text;
			const ageElement = root.querySelector("#ageDiv");
			const age = ageElement.text;
			const dateElement = root.querySelector("#dateDiv");
			const date = dateElement.text;
			setDate(date);
			setAge(age);
			setGender(gender);
			setName(name);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		const patientId = sessionStorage.getItem("patientId");
		if (!patientId) {
			navigate("/");
		} else {
			getPatientDetails();
		}
	}, [navigate]);

	// Retrieve the result and image data from location state
	const { image3, image4, image5, image6, image7, image8, image9 } =
		location.state || {};

	const pid = sessionStorage.getItem("patientId");
	return (
		<div className='report-container'>
			<div className='print-button-container'>
				<button className='print-button' onClick={printReport}>
					<FontAwesomeIcon icon={faPrint} className='print-icon' />
					PRINT
				</button>
			</div>
			<h2 className='report-heading'>PATIENT PAST DATA</h2>

			<p>
				<span className='patient-details-container'>PATIENT ID:</span>{" "}
				<span className='idetails'>{pid}</span>
			</p>
			<p>
				<span className='patient-details-container'>NAME:</span>{" "}
				<span className='idetails'>{name.toUpperCase()}</span>
			</p>
			<p>
				<span className='patient-details-container'>GENDER:</span>{" "}
				<span className='idetails'>{gender.toUpperCase()}</span>
			</p>
			<p>
				<span className='patient-details-container'>AGE:</span>{" "}
				<span className='idetails'>{age}</span>
			</p>
			<p>
				<span className='patient-details-container'>DATE:</span>{" "}
				<span className='idetails'>{date}</span>
			</p>

			<div className='report-image-container'>
				{image3 && <img src={image3} alt='My Plot3' className='report-image' />}
				{image4 && <img src={image4} alt='My Plot4' className='report-image' />}
				{image5 && <img src={image5} alt='My Plot5' className='report-image' />}
				{image6 && <img src={image6} alt='My Plot6' className='report-image' />}
				{image7 && <img src={image7} alt='My Plot7' className='report-image' />}
				{image8 && <img src={image8} alt='My Plot8' className='report-image' />}
				{image9 && <img src={image9} alt='My Plot9' className='report-image' />}
			</div>
		</div>
	);
};

export default Report;
