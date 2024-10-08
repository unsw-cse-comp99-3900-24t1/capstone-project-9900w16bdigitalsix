import React, { useState, useEffect, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../assets/scss/VirtualDataReport.css";

// field color map
const fieldColors = {
  "Artificial Intelligence": "rgba(75, 192, 192, 0.6)",
  "Data Science": "rgba(255, 99, 132, 0.6)",
  "Cyber Security": "rgba(153, 102, 255, 0.6)",
  "Software Engineering": "rgba(255, 159, 64, 0.6)",
  "Network Engineering": "rgba(54, 162, 235, 0.6)",
  "Human-Computer Interaction": "rgba(255, 206, 86, 0.6)",
  "Cloud Computing": "rgba(75, 192, 192, 0.6)",
  "Information Systems": "rgba(153, 102, 255, 0.6)",
  "Machine Learning": "rgba(255, 99, 132, 0.6)",
  Blockchain: "rgba(54, 162, 235, 0.6)",
  Other: "rgba(255, 159, 64, 0.6)",
};

const userId = localStorage.getItem("userId");
const fetchProjectList = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8080/v1/project/get/public_project/list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

// fetch the statistics result from backend
const fetchApiData = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8080/v1/project/statistics/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
};

const VirtualDataReport = () => {
  const [data, setData] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [tutorFilter, setTutorFilter] = useState("");
  const [coorFilter, setCoorFilter] = useState("");
  const reportRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // load statistics chats
  useEffect(() => {
    const fetchData = async () => {
      const apiData = await fetchApiData();
      if (apiData) {
        const filteredFields = apiData.fields.filter((field) =>
          fieldColors.hasOwnProperty(field.field)
        );
        setData({ ...apiData, fields: filteredFields });
        if (filteredFields.length > 0) {
          setSelectedField(filteredFields[0].field);
        }
      }

      const projectListData = await fetchProjectList();
      setProjectList(projectListData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  // convert to PDF file
  const handlePrintPdf = async () => {
    const input = reportRef.current;
    const pdf = new jsPDF("p", "pt", "a4");

    // get time
    const currentDate = new Date();
    const dateString = currentDate.toLocaleString();

    pdf.setFontSize(18);
    pdf.text("Project Statistics", 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${dateString}`, 20, 50);

    let offset = 70; // offset
    const margin = 20;
    const imgWidth = 595.28; // A4 width in points

    // get all chart elements
    const charts = input.querySelectorAll(".chart-container");
    for (let i = 0; i < charts.length; i += 2) {
      const firstChartCanvas = await html2canvas(charts[i], { scale: 2 });
      const firstImgData = firstChartCanvas.toDataURL("image/png");
      const secondChartCanvas = charts[i + 1]
        ? await html2canvas(charts[i + 1], { scale: 2 })
        : null;
      const secondImgData = secondChartCanvas
        ? secondChartCanvas.toDataURL("image/png")
        : null;

      const pageHeight = 841.89; // A4 height in points
      const imgHeight =
        (firstChartCanvas.height * imgWidth) / firstChartCanvas.width;

      // Adjust the height to fit two charts in one page
      const adjustedHeight = (pageHeight - margin * 3 - offset) / 2;
      const adjustedWidth =
        (firstChartCanvas.width * adjustedHeight) / firstChartCanvas.height;

      // Draw the first chart
      pdf.addImage(
        firstImgData,
        "PNG",
        margin,
        offset + margin,
        adjustedWidth,
        adjustedHeight
      );

      // Draw the second chart if it exists
      if (secondImgData) {
        pdf.addImage(
          secondImgData,
          "PNG",
          margin,
          offset + adjustedHeight + margin * 2,
          adjustedWidth,
          adjustedHeight
        );
      }

      // Add a new page if there are more charts to be added
      if (i + 2 < charts.length) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("Project Statistics", 20, 30);
        pdf.setFontSize(12);
        pdf.text(`Generated on: ${dateString}`, 20, 50);
        offset = 70; // reset offset
      }
    }

    // Print the table
    const table = input.querySelector(".project-list-table");
    const tableCanvas = await html2canvas(table, { scale: 2 });
    const tableImgData = tableCanvas.toDataURL("image/png");
    pdf.addPage();
    pdf.addImage(
      tableImgData,
      "PNG",
      margin,
      offset + margin,
      imgWidth - 40,
      (tableCanvas.height * imgWidth) / tableCanvas.width
    );

    pdf.save("report.pdf");
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  // define the filtering logic
  const filteredProjects = projectList.filter((project) => {
    return (
      (!clientFilter || project.clientName === clientFilter) &&
      (!tutorFilter || project.tutorName === tutorFilter) &&
      (!coorFilter || project.coorName === coorFilter)
    );
  });

  const uniqueValues = (key) => {
    return [
      ...new Set(projectList.map((project) => project[key]).filter(Boolean)),
    ];
  };

  // get filtered list
  const renderFilterDropdown = (field, setFilter) => {
    const values = uniqueValues(field);
    if (values.length === 0) return null;

    return (
      <span className="filter-icon">
        ▼
        <div className="filter-dropdown">
          <ul>
            {values.map((value) => (
              <li key={value} onClick={() => setFilter(value)}>
                {value}
              </li>
            ))}
            <li onClick={() => setFilter("")}>Clear</li>
          </ul>
        </div>
      </span>
    );
  };

  // load user data
  const totalUsersData = {
    labels: ["Students", "Clients", "Tutors", "Coordinators"],
    datasets: [
      {
        data: [
          data.totalStudents,
          data.totalClients,
          data.totalTutors,
          data.totalCoordinators,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  // load team data
  const fieldTeamsData = {
    labels: data.fields.map((field) => field.field),
    datasets: [
      {
        data: data.fields.map((field) => field.teams),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // load project data
  const selectedFieldProjects = data.projects.filter(
    (project) => project.field === selectedField
  );
  const fieldProjectsData = {
    labels: selectedFieldProjects.map((project) => project.title),
    datasets: [
      {
        label: "Teams",
        data: selectedFieldProjects.map((project) => project.teams),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const topKProjects = data.projects
    .sort((a, b) => b.teams - a.teams)
    .slice(0, 5);
  const topKProjectsData = {
    labels: topKProjects.map((project) => project.title),
    datasets: [
      {
        label: "Fields",
        data: topKProjects.map((project) => project.teams),
        backgroundColor: topKProjects.map(
          (project) => fieldColors[project.field]
        ),
      },
    ],
  };

  // define different charts
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return percentage + "%";
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            const uniqueFields = [
              ...new Set(topKProjects.map((project) => project.field)),
            ];
            return uniqueFields.map((field, i) => ({
              text: field,
              fillStyle: fieldColors[field],
              strokeStyle: fieldColors[field],
              index: i,
            }));
          },
        },
      },
    },
  };

  const noLegendBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chartHeight = windowWidth < 768 ? "200px" : "300px";

  return (
    <Container fluid>
      <Button onClick={handlePrintPdf} className="mb-4">
        Print PDF
      </Button>
      <div ref={reportRef}>
        {/* load charts */}
        <Row>
          <Col lg="6" className="mb-4 chart-container">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Total Users Distribution</CardTitle>
                <div
                  style={{
                    position: "relative",
                    height: chartHeight,
                    width: "100%",
                  }}
                >
                  <Pie
                    data={totalUsersData}
                    options={pieOptions}
                    plugins={[ChartDataLabels]}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" className="mb-4 chart-container">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Teams per Field</CardTitle>
                <div
                  style={{
                    position: "relative",
                    height: chartHeight,
                    width: "100%",
                  }}
                >
                  <Bar data={fieldTeamsData} options={noLegendBarOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6" className="mb-4 chart-container">
            <Card>
              <CardBody>
                <FormGroup>
                  <Label for="fieldSelect">Top 5 Popular Field</Label>
                  <Input
                    type="select"
                    id="fieldSelect"
                    value={selectedField}
                    onChange={handleFieldChange}
                  >
                    {data.fields.map((field) => (
                      <option key={field.field} value={field.field}>
                        {field.field}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <CardTitle tag="h5">{selectedField} Projects</CardTitle>
                <div
                  style={{
                    position: "relative",
                    height: chartHeight,
                    width: "100%",
                  }}
                >
                  <Bar
                    data={fieldProjectsData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" className="mb-4 chart-container">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Top 5 Popular Projects</CardTitle>
                <div
                  style={{
                    position: "relative",
                    height: chartHeight,
                    width: "100%",
                  }}
                >
                  <Bar data={topKProjectsData} options={barOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          {/* load projects with filtering operators */}
          <Col lg="12" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Project List</CardTitle>
                <div style={{ overflowX: "auto" }}>
                  <Table striped className="project-list-table">
                    <thead>
                      <tr>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        {uniqueValues("clientName").length > 0 && (
                          <th>
                            Client
                            {renderFilterDropdown(
                              "clientName",
                              setClientFilter
                            )}
                          </th>
                        )}
                        {uniqueValues("tutorName").length > 0 && (
                          <th>
                            Tutor
                            {renderFilterDropdown("tutorName", setTutorFilter)}
                          </th>
                        )}
                        {uniqueValues("coorName").length > 0 && (
                          <th>
                            Coordinator
                            {renderFilterDropdown("coorName", setCoorFilter)}
                          </th>
                        )}
                        <th>Allocate Team</th>
                        <th>Team Allocation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.projectId}>
                          <td>{project.projectId}</td>
                          <td>{project.title}</td>

                          {uniqueValues("clientName").length > 0 && (
                            <td>{project.clientName}</td>
                          )}
                          {uniqueValues("tutorName").length > 0 && (
                            <td>{project.tutorName}</td>
                          )}
                          {uniqueValues("coorName").length > 0 && (
                            <td>{project.coorName}</td>
                          )}
                          <td>
                            {project.allocatedTeam
                              ? project.allocatedTeam.length
                              : 0}{" "}
                            / {project.maxTeams || "N/A"}
                          </td>
                          <td>
                            {project.allocatedTeam &&
                            project.allocatedTeam.length > 0
                              ? project.allocatedTeam
                                  .map((team) => team.teamName)
                                  .join(", ")
                                  .replace(/,/g, ",\n")
                              : "None"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default VirtualDataReport;
