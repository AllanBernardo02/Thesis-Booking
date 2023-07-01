import React from "react";

const FemaleReport = ({ female }) => {
  return (
    // <div>
    //   <h1>PrintAppointment</h1>
    //   {todayAppointment?.map((appointment) => (
    //     <h2>{appointment?.patientId?.firstname}</h2>
    //   ))}
    // </div>
    <div>
      <div className="d-flex justify-content-between m-3">
        <div>
          {" "}
          <img
            width="100px"
            src="https://d3hmu1js3tz3r1.cloudfront.net/p/py9LPp/2016-08-21-884StarMedicalClinic-Jacksonville.jpg"
            alt=""
          />
        </div>
        <div className="text-center">
          <h6 className="mb-0">STARWHEAL MEDICAL CLINIC</h6>
          <h6 className="mb-0">APPOINTMENT DETAILS</h6>
          <h6>AGUINALDO, SAN ANTONIO, PARANAQUE, 1700 METRO MANILA</h6>
        </div>
        <div>
          <img
            width="100px"
            src="https://d3hmu1js3tz3r1.cloudfront.net/p/py9LPp/2016-08-21-884StarMedicalClinic-Jacksonville.jpg"
            alt=""
          />
        </div>
      </div>

      <div className="m-4">
        <h4>Female Patient</h4>
        <table class="table table-striped">
          <tr style={{ backgroundColor: "#013737", color: "white" }}>
            <th>PATIENT NAME</th>
            <th>BIRTHDAY</th>
            <th>GENDER</th>
            <th>MOBILE NUMBER</th>
            <th>ADDRESS</th>
          </tr>
          <tbody>
            {female?.map((o) => (
              <tr key={o.id}>
                <td>
                  {o.firstname} {o.lastname}
                </td>
                <td>{new Date(o.birthday).toLocaleDateString()}</td>
                <td>{o.gender}</td>
                <td>{o.mobileNumber}</td>
                <td>{o.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FemaleReport;
