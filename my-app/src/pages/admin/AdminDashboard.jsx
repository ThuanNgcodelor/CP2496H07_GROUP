import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container-fluid" id="container-wrapper">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0" style={{ color: '#eba21c' }}>Dashboard</h1>        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="./" className="text-pink-600">Home</a></li> {/* Update link color */}
          <li className="breadcrumb-item active" aria-current="page" style={{ color: '#ff66b2' }}>Dashboard</li> {/* Soft pink for active breadcrumb */}
        </ol>
      </div>


      <div className="row mb-3">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1" >Earnings (Monthly)</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-3x" style={{ color: '##4d323b' }}></i> {/* Updated icon color */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1" >Sales</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">650</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-shopping-cart fa-3x" style={{ color: '##4d323b' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1" >New User</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">366</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-3x" style={{ color: '##4d323b' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1" >Pending Requests</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-3x" style={{ color: '##4d323b' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="row">
        {/* <div className="col-xl-8 col-lg-7">
          <div className="card mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Monthly Recap Report</h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <canvas id="myAreaChart"></canvas>
              </div>
            </div>
          </div>
        </div> */}

        <div className="">
          <div className="card mb-4 ">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Products Sold</h6>
              <div className="dropdown no-arrow">
                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                  <div className="dropdown-header">Dropdown Header:</div>
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="small text-gray-500">Oblong T-Shirt
                  <div className="small float-right"><b>600 of 800 Items</b></div>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="small text-gray-500">Gundam 90'Edition
                  <div className="small float-right"><b>500 of 800 Items</b></div>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: '62.5%' }} aria-valuenow="62.5" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="small text-gray-500">Rounded Hat
                  <div className="small float-right"><b>455 of 800 Items</b></div>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-danger" role="progressbar" style={{ width: '56.875%' }} aria-valuenow="56.875" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="small text-gray-500">Indomie Goreng
                  <div className="small float-right"><b>400 of 800 Items</b></div>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-info" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="small text-gray-500">Remote Control Car Racing
                  <div className="small float-right"><b>200 of 800 Items</b></div>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <div className="mt-4 text-center small">
                <span className="mr-2">
                  <i className="fas fa-circle text-primary"></i> Direct
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-success"></i> Social
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-info"></i> Referral
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Projects</h6>
            </div>
            <div className="card-body">
              <h4 className="small font-weight-bold">Server Migration <span className="float-right">20%</span></h4>
              <div className="progress mb-4">
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: '20%' }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <h4 className="small font-weight-bold">Sales Tracking <span className="float-right">40%</span></h4>
              <div className="progress mb-4">
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: '40%' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <h4 className="small font-weight-bold">Customer Database <span className="float-right">60%</span></h4>
              <div className="progress mb-4">
                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '60%' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <h4 className="small font-weight-bold">Payout Details <span className="float-right">80%</span></h4>
              <div className="progress mb-4">
                <div className="progress-bar bg-info" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <h4 className="small font-weight-bold">Account Setup <span className="float-right">Complete!</span></h4>
              <div className="progress">
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Illustrations</h6>
            </div>
            <div className="card-body">
              <div className="text-center">
                <img className="img-fluid px-3 px-sm-4 mt-3 mb-4" style={{ width: '25rem' }} src="/src/assets/admin/img/undraw_posting_photo.svg" alt="..." />
              </div>
              <p>Add some quality, svg illustrations to your project courtesy of <a target="_blank" rel="nofollow" href="https://undraw.co/">unDraw</a>, a constantly updated collection of beautiful svg images that you can use completely free and without attribution!</p>
              <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on unDraw →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


