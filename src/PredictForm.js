import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./PredictForm.css";
import axios from "axios";
import { parse } from "node-html-parser";
import { useNavigate } from "react-router-dom";

const PredictForm = () => {
	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		dehydration: 0,
		medicineOverdose: 0,
		acidious: 0,
		cold: 0,
		cough: 0,
		type: 0,
		temperature: 100,
		heartRate: 120,
		pulseRate: 120,
		bpsys: 115,
		bpdia: 75,
		respiratoryRate: 32,
		oxygenSaturation: 0.9,
		pH: 7,
	});

	useEffect(() => {
		const patientId = sessionStorage.getItem("patientId");
		if (!patientId) {
			navigate("/");
		}
	}, [navigate]);

	const handleLogout = () => {
		// Clear patient ID from sessionStorage
		sessionStorage.removeItem("patientId");
		// Navigate back to login page
		navigate("/");
	};

	const [showOptions, setShowOptions] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
	};

	const handleSwitchChange = (e) => {
		const { name, checked } = e.target;
		setInputs({ ...inputs, [name]: checked ? 1 : 0 });
	};

	const handleSliderChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: parseFloat(value) });
	};

	const handlePredictClick = async () => {
		try {
			const patientId = sessionStorage.getItem("patientId");
			const requestData = {
				...inputs,
				patientId: patientId, // Add the patientId to the requestData
			};
			const response = await axios.post(
				"https://respiratory-backend.onrender.com/api/predict",
				requestData
			);

			const html = response.data;
			const root = parse(html);
			const answerElement = root.querySelector("#result-data");
			const extractedAnswer = answerElement.text;
			console.log("Respiratory Imbalance :", extractedAnswer);
			// const patientId = sessionStorage.getItem("patientId");
			// sessionStorage.setItem("patientId", patientId);
			const imgElement = root.querySelector("#plot1");
			const extractedImageData = imgElement.getAttribute("src");

			const imgElement2 = root.querySelector("#plot2");
			const extractedImageData2 = imgElement2.getAttribute("src");

			const imgElement3 = root.querySelector("#plot3");
			const extractedImageData3 = imgElement3.getAttribute("src");

			const imgElement4 = root.querySelector("#plot4");
			const extractedImageData4 = imgElement4.getAttribute("src");

			const imgElement5 = root.querySelector("#plot5");
			const extractedImageData5 = imgElement5.getAttribute("src");

			const imgElement6 = root.querySelector("#plot6");
			const extractedImageData6 = imgElement6.getAttribute("src");

			const imgElement7 = root.querySelector("#plot7");
			const extractedImageData7 = imgElement7.getAttribute("src");

			const imgElement8 = root.querySelector("#plot8");
			const extractedImageData8 = imgElement8.getAttribute("src");

			navigate("/report", {
				state: {
					result: extractedAnswer,
					image: extractedImageData,
					image2: extractedImageData2,
					image3: extractedImageData3,
					image4: extractedImageData4,
					image5: extractedImageData5,
					image6: extractedImageData6,
					image7: extractedImageData7,
					image8: extractedImageData8,
				},
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleAnalyze = async () => {
		try {
			const patientId = sessionStorage.getItem("patientId");
			const requestData = {
				patientId: patientId, // Add the patientId to the requestData
			};
			const response = await axios.post(
				"https://respiratory-backend.onrender.com/api/pastdata",
				requestData
			);

			const html = response.data;
			const root = parse(html);

			const imgElement3 = root.querySelector("#plot3");
			const extractedImageData3 = imgElement3.getAttribute("src");

			const imgElement4 = root.querySelector("#plot4");
			const extractedImageData4 = imgElement4.getAttribute("src");

			const imgElement5 = root.querySelector("#plot5");
			const extractedImageData5 = imgElement5.getAttribute("src");

			const imgElement6 = root.querySelector("#plot6");
			const extractedImageData6 = imgElement6.getAttribute("src");

			const imgElement7 = root.querySelector("#plot7");
			const extractedImageData7 = imgElement7.getAttribute("src");

			const imgElement8 = root.querySelector("#plot8");
			const extractedImageData8 = imgElement8.getAttribute("src");

			const imgElement9 = root.querySelector("#plot9");
			const extractedImageData9 = imgElement9.getAttribute("src");

			navigate("/pastdata", {
				state: {
					image3: extractedImageData3,
					image4: extractedImageData4,
					image5: extractedImageData5,
					image6: extractedImageData6,
					image7: extractedImageData7,
					image8: extractedImageData8,
					image9: extractedImageData9,
				},
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleProfileIconClick = () => {
		setShowOptions((prevShowOptions) => !prevShowOptions);
	};

	return (
		<div
			className='predict-form-wrapper'
			style={{
				background: "linear-gradient(#e66465, #9198e5)",
			}}>
			<div className='header-container'>
				<img src='/images/docicon.jpg' />
				<h1 className='header'>Respiratory Imbalance Predictor</h1>
			</div>
			<div className='profile-icon' onClick={handleProfileIconClick}>
				<img src='/images/profileicon.jpg' alt='Profile Icon' />
			</div>
			{showOptions && (
				<div
					className='profile-options-overlay'
					onClick={() => setShowOptions(false)}>
					<div className='profile-options'>
						<button className='analyze-btn' onClick={handleAnalyze}>
							<FontAwesomeIcon icon={faChartLine} className='icon' />
							Analyze Patient's Past Data
						</button>
						<button className='logout-btn' onClick={handleLogout}>
							<FontAwesomeIcon icon={faSignOutAlt} className='icon' />
							Sign out
						</button>
					</div>
				</div>
			)}
			<div className='predict-form-container'>
				<h2 className='heading'>Please provide the following values</h2>
				<div className='switch-container'>
					<span style={{ fontWeight: "bold" }}>Dehydration</span>
					<label className='switch-rectangle'>
						<input
							type='checkbox'
							name='dehydration'
							onChange={handleSwitchChange}
							checked={inputs.dehydration === 1}
						/>
						<span
							className={`slider rectangle ${
								inputs.dehydration === 1 ? "on" : "off"
							}`}></span>
						<span
							className={`switch-text ${
								inputs.dehydration === 1 ? "on" : "off"
							}`}>
							{inputs.dehydration === 1 ? "Yes" : "No"}
						</span>
					</label>
				</div>

				<div className='switch-container'>
					<span style={{ fontWeight: "bold" }}>Medicine Overdose</span>
					<label className='switch-rectangle'>
						<input
							type='checkbox'
							name='medicineOverdose'
							onChange={handleSwitchChange}
							checked={inputs.medicineOverdose === 1}
						/>
						<span
							className={`slider rectangle ${
								inputs.medicineOverdose === 1 ? "on" : "off"
							}`}></span>
						<span
							className={`switch-text ${
								inputs.medicineOverdose === 1 ? "on" : "off"
							}`}>
							{inputs.medicineOverdose === 1 ? "Yes" : "No"}
						</span>
					</label>
				</div>

				<div className='switch-container'>
					<span style={{ fontWeight: "bold" }}>Acidious</span>
					<label className='switch-rectangle'>
						<input
							type='checkbox'
							name='acidious'
							onChange={handleSwitchChange}
							checked={inputs.acidious === 1}
						/>
						<span
							className={`slider rectangle ${
								inputs.acidious === 1 ? "on" : "off"
							}`}></span>
						<span
							className={`switch-text ${inputs.acidious === 1 ? "on" : "off"}`}>
							{inputs.acidious === 1 ? "Yes" : "No"}
						</span>
					</label>
				</div>

				<div className='switch-container'>
					<span style={{ fontWeight: "bold" }}>Cold</span>
					<label className='switch-rectangle'>
						<input
							type='checkbox'
							name='cold'
							onChange={handleSwitchChange}
							checked={inputs.cold === 1}
						/>
						<span
							className={`slider rectangle ${
								inputs.cold === 1 ? "on" : "off"
							}`}></span>
						<span className={`switch-text ${inputs.cold === 1 ? "on" : "off"}`}>
							{inputs.cold === 1 ? "Yes" : "No"}
						</span>
					</label>
				</div>

				<div className='switch-container'>
					<span style={{ fontWeight: "bold" }}>Cough</span>
					<label className='switch-rectangle'>
						<input
							type='checkbox'
							name='cough'
							onChange={handleSwitchChange}
							checked={inputs.cough === 1}
						/>
						<span
							className={`slider rectangle ${
								inputs.cough === 1 ? "on" : "off"
							}`}></span>
						<span
							className={`switch-text ${inputs.cough === 1 ? "on" : "off"}`}>
							{inputs.cough === 1 ? "Yes" : "No"}
						</span>
					</label>
				</div>

				<div className='dropdown-container'>
					<span style={{ fontWeight: "bold" }}>Type</span>
					<div className='custom-dropdown'>
						<select
							name='type'
							value={inputs.type}
							onChange={handleInputChange}>
							<option value='0'>Type 0</option>
							<option value='1'>Type 1</option>
							<option value='2'>Type 2</option>
							<option value='3'>Type 3</option>
							<option value='4'>Type 4</option>
							<option value='5'>Type 5</option>
						</select>
					</div>
				</div>
				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>Temperature </span>
					<input
						type='range'
						name='temperature'
						min='95'
						max='105'
						value={inputs.temperature}
						onChange={handleSliderChange}
					/>

					{inputs.temperature}
				</div>
				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>Heart Rate</span>
					<input
						type='range'
						name='heartRate'
						min='40'
						max='200'
						value={inputs.heartRate}
						onChange={handleSliderChange}
					/>
					{inputs.heartRate}
				</div>
				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>Pulse Rate</span>
					<input
						type='range'
						name='pulseRate'
						min='40'
						max='200'
						value={inputs.pulseRate}
						onChange={handleSliderChange}
					/>
					{inputs.pulseRate}
				</div>

				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>BPSYS</span>
					<input
						type='range'
						name='bpsys'
						min='90'
						max='140'
						value={inputs.bpsys}
						onChange={handleSliderChange}
						id='bpsysSlider'
						className='slider-input'
					/>
					{inputs.bpsys}
				</div>
				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>BPDIA</span>
					<input
						type='range'
						name='bpdia'
						min='40'
						max='110'
						value={inputs.bpdia}
						onChange={handleSliderChange}
						id='bpdiaSlider'
						className='slider-input'
					/>
					{inputs.bpdia}
				</div>

				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}> Respiratory Rate</span>
					<input
						type='range'
						name='respiratoryRate'
						min='5'
						max='60'
						value={inputs.respiratoryRate}
						onChange={handleSliderChange}
						id='respiratoryRateSlider'
						className='slider-input'
					/>
					{inputs.respiratoryRate}
				</div>

				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>Oxygen Saturation</span>
					<input
						type='range'
						name='oxygenSaturation'
						min='0.8'
						max='1'
						step='0.01'
						value={inputs.oxygenSaturation}
						onChange={handleSliderChange}
						id='oxygenSaturationSlider'
						className='slider-input'
					/>
					{inputs.oxygenSaturation}
				</div>

				<div className='slider-container'>
					<span style={{ fontWeight: "bold" }}>pH</span>
					<input
						type='range'
						name='pH'
						min='0'
						max='14'
						value={inputs.pH}
						onChange={handleSliderChange}
						id='pHSlider'
						className='slider-input'
					/>
					{inputs.pH}
				</div>

				<div className='predict-btn-container'>
					<button className='predict-btn' onClick={handlePredictClick}>
						Predict
					</button>
				</div>
			</div>
		</div>
	);
};

export default PredictForm;
