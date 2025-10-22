import React from "react";

const FindeOpportunity=() => {
  
  return (
    <div>
      <div className="pt-2 pt-sm-5 text-center">
        <button className="btn btn-primary btn-main w-50" type="button">
          Search all opportunities
        </button>
      </div>
      
      <div className="d-flex py-3 py-sm-5 justify-content-between flex-column flex-sm-row">
        <div className="col-sm-6 col-12 mb-3 mb-sm-0">
          <button className="btn btn-primary btn-main w-100" type="button">
            Volunteer opportunities in my area
          </button>
        </div>
        <div className="col-sm-6 col-12">
          <button className="btn btn-primary btn-main w-100" type="button">
            Paid opportunities in my area
          </button>
        </div>
      </div>
    </div>
  );
};
export default FindeOpportunity;