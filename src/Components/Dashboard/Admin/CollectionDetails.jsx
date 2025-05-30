import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { publicRequest } from "../../../requestMehod"; // API instance
import { useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import { FormGroup, Input, Label, Table } from "reactstrap";

function CollectionDetailsAdmin() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [collectionMaterial, setCollectionMaterial] = useState(null);
  const token = useSelector((state) => state?.user?.currentUser?.data?.token);
  const location = useLocation(); 
  const navigate = useNavigate();

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const moneyFormat = (value) => {
    if (value === "" || value === null || value === undefined) return "";

    // Ensure it's a valid number before formatting
    const number = Number(value);
    if (isNaN(number)) return "₦0"; // Prevent NaN issues

    return `₦${number.toLocaleString("en-US")}`;
  };

  useEffect(() => {
    const fetchCollection = async () => {
      if (!token) return;

      try {
        const response = await publicRequest.get(
          `/admin_staff/getCollection/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Include token in headers
            },
          }
        );

        setCollection(response?.data?.data?.collection);
        setCollectionMaterial(response?.data?.data?.collectionMaterials);
        console.log("Collection", response?.data?.data);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      }
    };

    fetchCollection();
  }, [id, token]);

  if (!collection) return <p>Loading...</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="px-[10px] lg:px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="flex items-center h-[60px] justify-start gap-5">
          <div
            onClick={handleBack}
            className="w-[88px] h-[40px] flex items-center justify-center gap-1 border-[1px] border-solid border-[#E9E9E9] rounded-md cursor-pointer"
          >
            <BiArrowBack />
            <p className="mb-0">Back</p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#e9e9e9] mt-[20px]"></div>
        <div className="w-full flex flex-col items-center justify-start h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px]  py-[55px] mb-[30px]">
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-[50px]">
            <FormGroup className="flex flex-col ">
              <Label for="Name" className="font-normal text-[16px] mb-[10px]">
                Name
              </Label>
              <Input
                id="FullName"
                name="FullName"
                placeholder=""
                type="text"
                className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[428px] h-[55px] rounded-[10px]"
                value={collection?.agentName}
              />
            </FormGroup>
            <FormGroup className="flex flex-col mb-0">
              <Label
                for="phoneNumber"
                className="font-normal text-[16px] mb-[10px]"
              >
                Date of Collection
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder=""
                value={formatDate(collection?.collectionDate)}
                type="emtextail"
                className="!w-[310px] lg:w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
              />
            </FormGroup>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-[50px] mt-[20px]">
            <FormGroup className="flex flex-col ">
              <Label for="Name" className="font-normal text-[16px] mb-[10px]">
                Prepayment
              </Label>
              <Input
                id="FullName"
                name="FullName"
                placeholder=""
                type="text"
                className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[428px] h-[55px] rounded-[10px]"
                value={collection?.prepayment}
              />
            </FormGroup>
            <FormGroup className="flex flex-col mb-0">
              <Label
                for="phoneNumber"
                className="font-normal text-[16px] mb-[10px]"
              >
                Total Due
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder=""
                value={collection?.totalDue}
                type="emtextail"
                className="!w-[310px] lg:w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
              />
            </FormGroup>
          </div>
          <div className="w-[90%] lg:w-[55%] mt-[20px] flex flex-col items-start justify-start">
            <p>Images</p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {collection?.images?.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-[252px] bg-[#F3F3F3] rounded-[10px] flex items-center justify-center"
                >
                  <img
                    src={image}
                    alt={`Collection image ${index + 1}`}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-[100%] lg:w-[55%] mt-[30px] overflow-scroll">
            <Table striped>
              <thead>
                <tr>
                  <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                    Material Type
                  </th>
                  <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                    Amount
                  </th>
                  <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                    Total Amount Disbursed
                  </th>
                  <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                    Total Collected Material
                  </th>
                </tr>
              </thead>
              <tbody>
                {collectionMaterial?.map((material, index) => (
                  <tr key={index}>
                    <td>{material.materialType?.name}</td>
                    <td>{moneyFormat(material.amount)}</td>
                    <td>{moneyFormat(material.totalAmountDisbursed)}</td>
                    <td>{material.totalCollectedMaterial}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionDetailsAdmin;
