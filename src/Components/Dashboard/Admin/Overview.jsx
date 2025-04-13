import { BarChart } from "@mui/x-charts";
import { dataset, dataset2, valueFormatter } from "../../../utils/dataset";
import { useSelector } from "react-redux";
//import { useSelector } from "react-redux";

const chartSetting = {
  width: 500,
  height: 330,
  margin: { left: 120 },
};

function OverviewAdmin() {
  // const user = useSelector((state) => state?.user?.currentUser.data);
  const balance = useSelector((state) => state?.user?.currentUser?.data.balance);

  const moneyFormat = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\D/g, ""); // Remove non-numeric characters
    return `₦${new Intl.NumberFormat("en-US").format(number)}`;
  };

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        {/* <div className="mb-10">
          <h2 className="mb-4">Staff Balance</h2>
          <span className="bg-[#E9E9E9] text-[#151515] font-bold text-[40px] px-[20px] py-[15px] rounded-[10px]">{moneyFormat(balance)}</span>
        </div> */}
        <h1 className="text-[20px] font-medium mb-[30px]">Agents Overview</h1>
        <div className="w-full h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <div className="flex justify-end">Calendar</div>
          <div className="flex">
            <div className="flex gap-[17px]">
              <div className="flex flex-col">
                <div className="w-[229px]">
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex gap-[5px] mb-[30px] items-center">
                      <img
                        src="/assets/person.png"
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[14px] font-normal mb-0">
                        Total Agents
                      </p>
                    </div>
                    <h2 className="text-[50px] text-[#50CA00] mb-[53px]">
                      150
                    </h2>
                    <div className="bg-[#E9E9E9] w-full h-[1px] mb-[53px]"></div>
                  </div>
                </div>
                <div className="w-[229px]">
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex gap-[5px] mb-[30px] items-center">
                      <img
                        src="/assets/active.png"
                        alt=""
                        className="w-[15px] h-[15px]"
                      />
                      <p className="text-[14px] font-normal mb-0">
                        Active Agents
                      </p>
                    </div>
                    <h2 className="text-[50px] text-[#50CA00] mb-[53px]">
                      150
                    </h2>
                  </div>
                </div>
              </div>
              <div className="bg-[#E9E9E9] w-[1px]  mb-[53px]"></div>
            </div>
            <div className="ml-[100px] w-full">
              <h1 className="font-medium text-[16px]">
                Top and Bottom 3 Performing Agents
              </h1>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <p className="rotate-[-90deg] h-[20px] text-[14px] font-light text-[#8F8F8F]">
                    Agent Name
                  </p>
                  <div className="flex flex-col">
                    <BarChart
                      dataset={dataset}
                      yAxis={[
                        {
                          scaleType: "band",
                          dataKey: "name",
                          tickLabelStyle: {
                            fontFamily: "Outfit, sans-serif",
                            fontSize: 14,
                            fontWeight: "normal",
                          },
                          categoryGapRatio: 0.5,
                          barGapRatio: 0.1,
                          colorMap: {
                            type: "ordinal",
                            colors: [
                              "#50CA00",
                              "#50CA00",
                              "#50CA00",
                              "#FF9A30",
                              "#FF9A30",
                              "#FF9A30",
                            ],
                          },
                        },
                      ]}
                      series={[
                        {
                          dataKey: "amount",
                          valueFormatter,
                        },
                      ]}
                      layout="horizontal"
                      grid={{ vertical: true }}
                      {...chartSetting}
                    />
                    <p className="text-center text-[14px] font-light text-[#8F8F8F]">
                      Quantity
                    </p>
                  </div>
                </div>
                <div className="mr-10">
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[15px] h-[12px] bg-[#50cA00]"></div>
                    <p className="text-[#8f8f8f] text-[14px] mb-0">
                      Top 3 Agents
                    </p>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[15px] h-[12px] bg-[#FF9A30]"></div>
                    <p className="text-[#8f8f8f] text-[14px] mb-0">
                      Bottom 3 Agents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-[20px] font-medium mb-[30px]">Collection Overview</h1>
      <div className="w-full h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
        <div className="flex justify-end">Search and Calendar</div>
        <div className="flex items-center ml-10">
          <p className="rotate-[-90deg] h-[20px] text-[14px] font-light text-[#8F8F8F]">
            Materials
          </p>
          <div className="flex flex-col">
            <BarChart
              dataset={dataset2}
              yAxis={[
                {
                  scaleType: "band",
                  dataKey: "name",
                  tickLabelStyle: {
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 14,
                    fontWeight: "normal",
                  },
                  categoryGapRatio: 0.5,
                  barGapRatio: 0.1,
                  colorMap: {
                    type: "ordinal",
                    colors: [
                      "#50CA00",
                      "#50CA00",
                      "#50CA00",
                      "#50CA00",
                      "#50CA00",
                    ],
                  },
                },
              ]}
              series={[
                {
                  dataKey: "amount",
                  valueFormatter,
                },
              ]}
              layout="horizontal"
              grid={{ vertical: true }}
              {...chartSetting}
            />
            <p className="text-center text-[14px] font-light text-[#8F8F8F]">
              Quantity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewAdmin;
