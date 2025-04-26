import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { dataset, dataset2, valueFormatter } from "../../../utils/dataset";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers";


const names = [
  "John Doe",
  "Jane Smith",
  "Alex Johnson",
  "Alex Johnsons",
  "Alex Johnsonzz",
];

const medalIcons = [
  "/assets/gold.png",
  "/assets/silver.png",
  "/assets/bronze.png",
  "/assets/fourth.png",
  "/assets/fifth.png",
];

const bottomIcons = [
  "/assets/bottom.png",
  "/assets/bottom.png",
  "/assets/bottom.png",
  "/assets/bottom.png",
  "/assets/bottom.png",
];

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780];
const pData = [2400, 1398, 9800, 3908];
const xLabels = [
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function OverviewAdmin() {
  const [chartSetting, setChartSetting] = useState({
    width: 500,
    height: 330,
    margin: { left: 120 },
  });

  const [chartSetting2, setChartSetting2] = useState({
    width: 1000,
    height: 330,
    margin: { left: 120 },
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // Tailwind's lg breakpoint

      setChartSetting(
        isMobile
          ? { width: 320, height: 250, margin: { left: 60 } } // mobile/small screen
          : { width: 500, height: 330, margin: { left: 60 } } // desktop/web
      );

     
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // Tailwind's lg breakpoint

      setChartSetting2(
        isMobile
          ? { width: 420, height: 400, margin: { left: 60 } } // mobile/small screen
          : { width: 600, height: 330, margin: { left: 0 } } // desktop/web
      );
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">Agents Overview</h1>
        <div className="w-full h-auto lg:h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
            <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
              <FaCalendarAlt size={20} className="text-[#50CA00]" />
              <MobileDatePicker
                className="w-[200px] text-[14px]"
                placeholder="mm/dd/yyyy"
              />
              <span>-</span>
              <MobileDatePicker className="" />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex gap-[17px]">
              <div className="flex flex-col w-[329px]">
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
                        Active vs Inactive Agents
                      </p>
                    </div>
                    <PieChart
                      colors={["#50CA00", "#FF9500"]}
                      series={[
                        {
                          data: [
                            {
                              id: 0,
                              value: 700,
                              label: "Active Agents",
                              color: "#50CA00",
                            },
                            {
                              id: 1,
                              value: 120,
                              label: "Inactive Agents",
                              color: "#FF9500",
                            },
                          ],
                        },
                      ]}
                      width={350}
                      height={100}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-[#E9E9E9] w-[1px]  mb-[53px] hidden lg:block"></div>
            </div>
            <div className="w-full flex flex-col lg:flex-row mt-5 lg:mt-1 items-center justify-center gap-[60px]">
              <div className="w-[287px] h-auto border-solid border-[1px] border-[#E9E9E9] py-[14px] pl-[20px] rounded-[10px]">
                <h3 className="mb-[26px] text-[18px]">Top 5 Agents</h3>
                {names.map((name, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-2 mb-[24px]"
                  >
                    {index < 5 ? (
                      <img
                        src={medalIcons[index]}
                        alt="medal"
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 font-semibold w-6 text-center">
                        {index + 1}
                      </span>
                    )}
                    <span className="text-gray-800 font-medium">{name}</span>
                  </li>
                ))}
              </div>
              <div className="w-[287px] h-auto border-solid border-[1px] border-[#E9E9E9] py-[14px] pl-[20px] rounded-[10px]">
                <h3 className="mb-[26px] text-[18px]">Bottom 5 Agents</h3>
                {names.map((name, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-2 mb-[24px]"
                  >
                    {index < 5 ? (
                      <img
                        src={bottomIcons[index]}
                        alt="medal"
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 font-semibold w-6 text-center">
                        {index + 1}
                      </span>
                    )}
                    <span className="text-gray-800 font-medium">{name}</span>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">
          Retailers Overview
        </h1>
        <div className="w-full h-auto lg:h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[10px] lg:px-[30px] py-[22px] mb-[30px]">
          <div className="w-full flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
            <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
              <FaCalendarAlt size={20} className="text-[#50CA00]" />
              <MobileDatePicker
                className="w-[200px] text-[14px]"
                placeholder="mm/dd/yyyy"
              />
              <span>-</span>
              <MobileDatePicker className="" />
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row">
            <div className="flex gap-[17px]">
              <div className="flex flex-col w-[329px]">
                <div className="w-full lg:w-[229px]">
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex gap-[5px] mb-[30px] items-center">
                      <img
                        src="/assets/person.png"
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[14px] font-normal mb-0">
                        Total Retailers
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
                        Active/Inactive Retailers
                      </p>
                    </div>
                    <PieChart
                      colors={["#50CA00", "#FF9500"]}
                      series={[
                        {
                          data: [
                            {
                              id: 0,
                              value: 700,
                              label: "Active Retailers",
                              color: "#50CA00",
                            },
                            {
                              id: 1,
                              value: 120,
                              label: "Inactive Retailers",
                              color: "#FF9500",
                            },
                          ],
                        },
                      ]}
                      width={350}
                      height={100}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-[#E9E9E9] w-[1px]  mb-[53px] hidden lg:block"></div>
            </div>
            <div className="w-full flex items-center justify-center gap-[60px] lg:ml-[30px] mt-5">
              <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] py-[14px] px-[20px] rounded-[10px]">
                <h3 className="mb-[26px] text-[18px]">Retail Leaderboard</h3>
                {names.map((name, index) => (
                  <li
                    key={index}
                    className="w-full flex justify-between items-center gap-4 p-2 mb-[24px]"
                  >
                    <div className="flex gap-3">
                      <img
                        src={medalIcons[index]}
                        alt="medal"
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-gray-800 font-medium">{name}</span>
                    </div>
                    <span className="text-gray-500 font-semibold bg-[#E1E1E1] rounded-[5px] py-[2px] px-[8px]">
                      120 kg
                    </span>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">
          Disbursements Overview
        </h1>
        <div className="w-full h-auto lg:h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
            <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
              <FaCalendarAlt size={20} className="text-[#50CA00]" />
              <MobileDatePicker
                className="w-full lg:w-[200px] text-[14px]"
                placeholder="mm/dd/yyyy"
              />
              <span>-</span>
              <MobileDatePicker className="" />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex gap-[17px]">
              <div className="flex flex-col w-[329px]">
                <div className="w-[229px]">
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex gap-[5px] mb-[30px] items-center">
                      <img
                        src="/assets/person.png"
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[14px] font-normal mb-0">
                        Total Disbursement
                      </p>
                    </div>
                    <h2 className="text-[50px] text-[#50CA00] mb-[53px]">
                      1.5m
                    </h2>
                    <div className="bg-[#E9E9E9] w-full h-[1px] mb-[53px]"></div>
                  </div>
                </div>
              </div>
              <div className="bg-[#E9E9E9] w-[1px]  mb-[53px] hidden lg:block"></div>
            </div>
            <div className="w-full flex items-center justify-center gap-[60px] ml-[30px]">
              <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] py-[14px] px-[20px] rounded-[10px] flex items-center ml-[50px]">
                <BarChart
                  dataset={dataset2}
                  xAxis={[
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
                  yAxis={[
                    {
                      scaleType: "linear",
                      label: "Quantity (KG)",
                    },
                  ]}
                  series={[
                    {
                      dataKey: "amount",
                      valueFormatter,
                    },
                  ]}
                  grid={{ horizontal: true }}
                  {...chartSetting2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">
          Retail Payout Overview
        </h1>
        <div className="w-full h-auto lg:h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
            <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
              <FaCalendarAlt size={20} className="text-[#50CA00]" />
              <MobileDatePicker
                className="w-[200px] text-[14px]"
                placeholder="mm/dd/yyyy"
              />
              <span>-</span>
              <MobileDatePicker className="" />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="flex gap-[17px]">
              <div className="flex flex-col w-[329px]">
                <div className="w-[229px]">
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex gap-[5px] mb-[30px] items-center">
                      <img
                        src="/assets/person.png"
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[14px] font-normal mb-0">
                        Total Disbursement
                      </p>
                    </div>
                    <h2 className="text-[50px] text-[#50CA00] mb-[53px]">
                      1.5m
                    </h2>
                    <div className="bg-[#E9E9E9] w-full h-[1px] mb-[53px]"></div>
                  </div>
                </div>
              </div>
              <div className="bg-[#E9E9E9] w-[1px]  mb-[53px] hidden lg:block"></div>
            </div>
            <div className="w-full flex items-center justify-center gap-[60px] lg:ml-[30px]">
              <div className="w-[400px] lg:w-full h-auto border-solid border-[1px] border-[#E9E9E9] py-[14px] px-[20px] rounded-[10px] flex items-center ml-[50px]">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-[20px] font-medium mb-[30px]">Collected Overview</h1>
      <div className="w-full h-auto lg:h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
        <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
          <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
            <FaCalendarAlt size={20} className="text-[#50CA00]" />
            <MobileDatePicker
              className="w-[200px] text-[14px]"
              placeholder="mm/dd/yyyy"
            />
            <span>-</span>
            <MobileDatePicker className="" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full items-center justify-between">
          <div className="flex justify-center items-center lg:ml-10">
            <p className="rotate-[-90deg] h-[20px] text-[14px] font-light text-[#8F8F8F]">
              Materials
            </p>
            <div className="flex flex-col items-center justify-center overflow-scroll">
              <LineChart
                height={300}
                width={300}
                series={[
                  { data: pData, label: "pv" },
                  { data: uData, label: "uv" },
                ]}
                xAxis={[{ scaleType: "point", data: xLabels }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
              />
              <p className="text-center text-[14px] font-light text-[#8F8F8F]">
                Quantity (KG)
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center lg:ml-10">
            <p className="rotate-[-90deg] h-[20px] text-[14px] font-light text-[#8F8F8F]">
              Materials
            </p>
            <div className="flex flex-col items-center justify-center">
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
                Quantity (KG)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewAdmin;
