export const defaultCols = [
    {
        id: "todo",
        title: "Col 1",
    },
    {
        id: "doing",
        title: "Col 2",
    },
    {
        id: "done",
        title: "Col 3",
    },
];

export const defaultTasks = [
    {
        id: "1",
        columnId: "todo",
        content: "List admin APIs for dashboard",
    },
    {
        id: "2",
        columnId: "todo",
        content:
            "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
    },
    {
        id: "3",
        columnId: "doing",
        content: "Conduct security testing",
    },
    {
        id: "4",
        columnId: "doing",
        content: "Analyze competitors",
    },
    {
        id: "5",
        columnId: "done",
        content: "Create UI kit documentation",
    },
    {
        id: "6",
        columnId: "done",
        content: "Dev meeting",
    },
    {
        id: "7",
        columnId: "done",
        content: "Deliver dashboard prototype",
    },
    {
        id: "8",
        columnId: "todo",
        content: "Optimize application performance",
    },
    {
        id: "9",
        columnId: "todo",
        content: "Implement data validation",
    },
    {
        id: "10",
        columnId: "todo",
        content: "Design database schema",
    },
    {
        id: "11",
        columnId: "todo",
        content: "Integrate SSL web certificates into workflow",
    },
    {
        id: "12",
        columnId: "doing",
        content: "Implement error logging and monitoring",
    },
    {
        id: "13",
        columnId: "doing",
        content: "Design and implement responsive UI",
    },
];

export const healthcareAnalysis = {
    t: "📊 Healthcare Appointment Analysis",
    n: "This analysis provides a comprehensive overview of the healthcare appointment data, exploring various aspects such as appointment status, patient demographics, and appointment timing.",
    qa: "quantitative",
    ts: [
        {
            tp: "🕑 Appointment Status Overview",
            tq: "This section analyzes the distribution of appointment status, providing insights into the number of show-ups and no-shows.",
            q: [
                {
                    dl: [
                        "healthcare-appointment-data"
                    ],
                    s: [
                        "9yBaE9KYZ.csv"
                    ],
                    x: "SELECT `Status`",
                    l: "Appointment Status Distribution",
                    c: "pie",
                    y: "This query retrieves the count of appointments for each status (Show-Up and No-Show) to provide a high-level overview of the appointment status distribution.",
                    r: [{ "Status": "Show-Up", "TotalCount": 4621 }, { "Status": "No-Show", "TotalCount": 2050 }]
                }
            ]
        },
        {
            tp: "🧑‍⚕️ Patient Demographics",
            tq: "This section explores the demographic characteristics of the patients, including their age and gender.",
            q: [
                {
                    dl: [
                        "healthcare-appointment-data"
                    ],
                    s: [
                        "9yBaE9KYZ.csv"
                    ],
                    x: "SELECT `Gender`",
                    l: "Patient Demographics",
                    c: "bar",
                    y: "This query calculates the average age of patients for each gender, providing insights into the age distribution within the dataset.",
                    r: [{ "Gender": "M", "AvgAge": 34.22696629213483 }, { "Gender": "F", "AvgAge": 39.85987404408457 }]
                }
            ]
        },
        {
            tp: "📆 Appointment Scheduling",
            tq: "This section analyzes the appointment scheduling, including the distribution of appointments by day of the week and the average waiting time.",
            q: [
                {
                    dl: [
                        "healthcare-appointment-data"
                    ],
                    s: [
                        "9yBaE9KYZ.csv"
                    ],
                    x: "SELECT `DayOfTheWeek`",
                    l: "Appointments by Day of the Week",
                    c: "bar",
                    y: "This query counts the number of appointments for each day of the week, allowing us to analyze the distribution of appointments throughout the week.",
                    r: [{ "DayOfTheWeek": "Wednesday", "TotalCount": 1390 }, { "DayOfTheWeek": "Tuesday", "TotalCount": 1415 }, { "DayOfTheWeek": "Thursday", "TotalCount": 1329 }, { "DayOfTheWeek": "Friday", "TotalCount": 1167 }, { "DayOfTheWeek": "Monday", "TotalCount": 1344 }, { "DayOfTheWeek": "Saturday", "TotalCount": 26 }]
                },
                {
                    dl: [
                        "healthcare-appointment-data"
                    ],
                    s: [
                        "9yBaE9KYZ.csv"
                    ],
                    x: "SELECT AVG()`",
                    l: "Average Waiting Time",
                    c: "singleNumber",
                    y: "This query calculates the average waiting time for appointments, providing insights into the timeliness of the healthcare system.",
                    r: [{ "AvgAwaitingTime": -13.928196672163095 }]
                }
            ]
        }
    ]
};