import React from "react";
import smc from "../../asset/smc.png";

const CancelledReport = ({ cancelled }) => {
  console.log("at", cancelled);

  const generateSerialNumber = (index) => {
    return index + 1; // Assuming the index starts from 0, add 1 to make it an incremental number
  };

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
          <img width="100px" src={smc} alt="" />
        </div>
        <div className="text-center">
          <h6 className="mb-0">STARWHEAL MEDICAL CLINIC</h6>
          <h6 className="mb-0">APPOINTMENT DETAILS</h6>
          <h6>AGUINALDO, SAN ANTONIO, PARANAQUE, 1700 METRO MANILA</h6>
        </div>
        <div>
          <img width="100px" src={smc} alt="" />
        </div>
      </div>

      <div className="m-4">
        <h4>Cancelled Appointment</h4>
        <table class="table table-striped">
          <tr style={{ backgroundColor: "#013737", color: "white" }}>
            <th>#</th>

            <th>PATIENT NAME</th>

            <th>SERVICE</th>
            <th>DATE</th>
            <th>TIME</th>
            <th>STATUS</th>
          </tr>
          <tbody>
            {cancelled?.map((appointment, index) => (
              <tr key={appointment.id}>
                {/* <td>{appointment._id}</td> */}
                <td>{generateSerialNumber(index)}</td>
                <td>
                  {appointment?.patientId?.firstname}{" "}
                  {appointment?.patientId?.lastname}
                </td>
                <td>{appointment.clinicService}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancelledReport;
