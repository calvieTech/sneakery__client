import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
import Button from "./Button";

function ImageUpload(props) {
	const filePickerRef = useRef();
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState();
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	const pickedImageHandler = (event) => {
		let pickedImage;
		let imageIsValid = isValid;
		if (event.target.files && event.target.files.length === 1) {
			pickedImage = event.target.files[0];
			setFile(pickedImage);
			setIsValid(true);
			imageIsValid = true;
		} else {
			setIsValid(false);
			imageIsValid = false;
		}
		props.onInput(props.id, pickedImage, imageIsValid);
	};

	const pickImageHandler = () => {
		filePickerRef.current.click();
	};

	return (
		<div className="form-control">
			<input
				id={props.id}
				ref={filePickerRef}
				type="file"
				name={props.name}
				style={{ display: "none" }}
				accept=".png,.jpg,.jpeg"
				onChange={pickedImageHandler}
			/>
			<div className={`image-upload ${props.center && "center"}`}>
				<div className="image-upload__preview">
					{!previewUrl && <p>Please upload an image</p>}
					{previewUrl && (
						<img
							src={previewUrl}
							alt="Preview"
						/>
					)}
				</div>
				<Button
					type="button"
					onClick={pickImageHandler}>
					UPLOAD IMAGE
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
}

export default ImageUpload;
