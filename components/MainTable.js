import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const MainTable = (props) => {
const { _id, name } = props.obj;

const DELETE = () => {
	axios
	.delete(
"http://localhost:4000/students/delete-student/" + _id)
	.then((res) => {
		if (res.status === 200) {
		alert("Student successfully deleted");
		window.location.reload();
		} else Promise.reject();
	})
	.catch((err) => alert("Something went wrong"));
};

return (
	<tr>
	<td>{name}</td>
	{/* <td>{email}</td>
	<td>{rollno}</td> */}
	<td>
		<Link className="edit-link"
		to={"/edit-department/" + _id}>
		Edit
		</Link>
		<Button onClick={DELETE}
		size="sm" variant="danger">
		Delete
		</Button>
	</td>
	</tr>
);
};

export default MainTable;
