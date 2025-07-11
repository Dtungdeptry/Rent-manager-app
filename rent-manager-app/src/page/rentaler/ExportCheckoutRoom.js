import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import { checkoutRoom, getContract, getRequestById } from '../../services/fetch/ApiUtils';
import * as XLSX from 'xlsx';


function ExportCheckoutRoom(props) {
    const { authenticated, role, currentUser, location, onLogout } = props;
    const { id } = useParams();

    const [contractData, setContractData] = useState({
        nameBill: '',
        createdAt: '',
        price: 0,
        nameOfRent: '',
        nameRoom: '',
        room: '',
        priceRequest: '',
        waterCostRequest: 0,
        electricCostRequest: 0,
        internetCostRequest: '',
        deadlineContract: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContractData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    const handleSubmit = (event) => {
        event.preventDefault();
    
    };

    useEffect(() => {
        getContract(id)
            .then(response => {
                const contract = response;
                setContractData(prevState => ({
                    ...prevState,
                    ...contract
                }));

            })
            .catch(error => {
                toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
            });
    }, [id]);

    const handleExport = (id) => {
        checkoutRoom(id)
        .then(response => {
            toast.success(response.message)
            exportToExcel(contractData);
        })
        .catch(error => {
            toast.error((error && error.message) || 'Oops! Có điều gì đó xảy ra. Vui lòng thử lại!');
        });
        setContractData({
            nameBill: "",
            priceRequest: "",

        });
    };


    if (!authenticated) {
        return <Navigate
            to={{
                pathname: "/login-rentaler",
                state: { from: location }
            }} />;
    }
    return (
        <>
            <div className="wrapper">
                <nav id="sidebar" className="sidebar js-sidebar">
                    <div className="sidebar-content js-simplebar">
                        <a className="sidebar-brand" href="index.html">
                            <span className="align-middle">RENTALER PRO</span>
                        </a>
                        <SidebarNav />
                    </div>
                </nav>

                <div className="main">
                    <Nav onLogout={onLogout} currentUser={currentUser} />

                    <br />
                    <div className="container-fluid p-0">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Xuất hóa đơn trả phòng</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Tên Hóa Đơn</label>
                                        <input type="text" className="form-control" id="price" name="nameBill" value={contractData.nameBill}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Tên Phòng</label>
                                        <input type="text" className="form-control" id="price" name="nameRoom" value={contractData.room && contractData.room.title}
                                            onChange={handleInputChange} disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Giá Phòng</label>
                                        <input type="number" className="form-control" id="price" name="price" value={contractData.room && contractData.room.price}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="waterCost">Tiền nước</label>
                                        <input type="number" className="form-control" id="waterCost" name="waterCost" value={contractData.waterCost}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="publicElectricCost">Tiền điện chung</label>
                                        <input type="number" className="form-control" id="publicElectricCost" name="publicElectricCost" value={contractData.publicElectricCost}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="internetCost">Tiền mạng</label>
                                        <input type="number" className="form-control" id="internetCost" name="internetCost" value={contractData.room && contractData.room.internetCost}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Thời Gian Điểm Bắt Đầu Thuê</label>
                                        <input type="datetime" className="form-control" id="price" name="createAt" value={contractData.createdAt}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Thời Hạn</label>
                                        <input type="datetime" className="form-control" id="price" name="deadlineContract" value={contractData.deadlineContract}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Chi phí lặp đặt (Theo yêu cầu) </label>
                                        <input type="number" className="form-control" id="price" name="priceRequest" value={contractData.priceRequest}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="price">Người thuê</label>
                                        <input type="text" className="form-control" id="price" name="nameOfRent" value={contractData.nameOfRent}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button type="submit" onClick={() => handleExport(contractData.room.id)} className="btn btn-primary">Xuất hóa đơn</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        </>
    )
}



function exportToExcel(contractData) {
    // Create an empty workbook
    const workbook = XLSX.utils.book_new();

    const formattedPrice = contractData.priceRequest ? formatCurrency(contractData.priceRequest) : '';

    // Lấy ngày hạn hợp đồng, nếu không hợp lệ thì dùng ngày hiện tại
    const deadlineDate = new Date(contractData.deadlineContract);
    const now = new Date();

    const deadlineYear = isNaN(deadlineDate.getFullYear()) ? now.getFullYear() : deadlineDate.getFullYear();
    const currentYear = now.getFullYear();

    const deadlineMonth = isNaN(deadlineDate.getMonth()) ? now.getMonth() : deadlineDate.getMonth();
    const currentMonth = now.getMonth();

    // Parse các giá trị số, nếu parse lỗi thì dùng 0
    const pricePerMonth = parseFloat(contractData.room?.price) || 0;
    const priceRequest = parseFloat(contractData.priceRequest) || 0;
    const waterCostRequest = parseFloat(contractData.waterCostRequest) || 0;
    const electricCostRequest = parseFloat(contractData.electricCostRequest) || 0;
    const internetCostRequest = parseFloat(contractData.internetCostRequest) || 0;


    const result = ((deadlineYear - currentYear) * 12 + (deadlineMonth - currentMonth)) * pricePerMonth + priceRequest + waterCostRequest + electricCostRequest + internetCostRequest;
    // Add a worksheet to the workbook
    const worksheet = XLSX.utils.aoa_to_sheet([
        ['Tên Hóa Đơn', 'Thời Gian Điểm Bắt Đầu Thuê', 'Chi phí lặp đặt (Theo yêu cầu)', 'Giá Phòng', 'Tiền nước', 'Tiền điện chung', 'Tiền mạng', 'Tên Phòng', 'Thời Hạn', 'Người thuê', 'Tổng Tiền'],
        [contractData.nameBill, contractData.createdAt, formattedPrice, contractData.room.price, contractData.waterCost, contractData.publicElectricCost, contractData.room.internetCost, contractData.room.title, contractData.deadlineContract, contractData.nameOfRent, result],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    function formatCurrency(value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    }

    // Generate the Excel file data
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    // Create a Blob from the Excel file data
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hoa_don.xlsx';
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
}

export default ExportCheckoutRoom;