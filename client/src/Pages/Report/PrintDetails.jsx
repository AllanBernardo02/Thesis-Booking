import moment from "moment";
import React from "react";
import "./printdetails.css";

const PrintDetails = ({ selectedBooking }) => {
  return (
    <div className="p-5">
      <div className="d-flex justify-content-between">
        <img
          width="100px"
          src="https://d3hmu1js3tz3r1.cloudfront.net/p/py9LPp/2016-08-21-884StarMedicalClinic-Jacksonville.jpg"
          alt=""
        />
        <div className="text-center">
          <h6 className="mb-0">STARWHEAL MEDICAL CLINIC</h6>
          <h6 className="mb-0">APPOINTMENT DETAILS</h6>
          <h6>AGUINALDO, SAN ANTONIO, PARANAQUE, 1700 METRO MANILA</h6>
        </div>
        <img
          width="100px"
          src="https://d3hmu1js3tz3r1.cloudfront.net/p/py9LPp/2016-08-21-884StarMedicalClinic-Jacksonville.jpg"
          alt=""
        />
      </div>
      {/* <div className="text-center">
        <p>
          <b>Appointment ID :</b> {selectedBooking?._id}
        </p>
        <p>
          <b>Doctor Name :</b> {selectedBooking?.doctorId?.firstname}{" "}
          {selectedBooking?.doctorId?.lastname}
        </p>
        <p>
                Date & Time :{" "}
                {moment(selectedBooking.date).format("DD-MM-YYYY")}{" "}
                {moment(selectedBooking.time).format("hh:mm a")}
              </p>
        <p>
          <b>Date :</b> {moment(selectedBooking?.date).format("DD-MM-YYYY")}{" "}
        </p>
        <p>
          <b>Time :</b> {selectedBooking?.time}
        </p>
        <p>
          <b>Status :</b> {selectedBooking?.status}
        </p>
        
      </div> */}

      {/* <table className="table table-striped mt-5">
        <tr className="text-center">
          <th>APPOINTMENT ID</th>
          <th>DOCTOR NAME</th>
          <th>DATE</th>
          <th>TIME</th>
          <th>STATUS</th>
        </tr>
        <tr className="text-center">
          <td>{selectedBooking?._id}</td>
          <td>
            {selectedBooking?.doctorId?.firstname}{" "}
            {selectedBooking?.doctorId?.lastname}
          </td>
          <td>{moment(selectedBooking?.date).format("DD-MM-YYYY")} </td>
          <td>{selectedBooking?.time}</td>
          <td>{selectedBooking?.status}</td>
        </tr>
      </table> */}

      <div className="details text-center mt-5">
        <div className="details-name">
          <p>
            <b>APPOINTMENT ID</b>
          </p>
          <p>
            <b>DOCTOR NAME</b>
          </p>
          <p>
            <b>DATE</b>
          </p>
          <p>
            <b>TIME</b>
          </p>
          <p>
            <b>STATUS</b>
          </p>
        </div>
        <div className="details-details">
          <p>{selectedBooking?._id}</p>
          <p>
            {selectedBooking?.doctorId?.firstname}{" "}
            {selectedBooking?.doctorId?.lastname}
          </p>
          <p>{moment(selectedBooking?.date).format("DD-MM-YYYY")}</p>
          <p>{selectedBooking?.time}</p>
          <p>{selectedBooking?.status}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintDetails;
