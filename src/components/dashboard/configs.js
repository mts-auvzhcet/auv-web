export const eventsConfig = {
  name: "events",
  label: "Event",
  titleKey: "title",
  subtitleKey: "year",
  imageKey: "imageBase64",
  fields: [
    { key: "title", label: "Name of Event", required: true },
    { key: "year", label: "Year", placeholder: "e.g. 2023" },
    { key: "venue", label: "Venue", placeholder: "e.g. AMU Campus Pool, Aligarh" },
    { key: "theme", label: "Theme", placeholder: "e.g. Remotely Operated Underwater Vehicles Challenge" },
    { key: "desc", label: "Description", textarea: true },
    { key: "highlights", label: "Key Highlights (one per line)", textarea: true, placeholder: "One highlight per line" },
    { key: "winningTeams", label: "Standings / Placements", textarea: true, placeholder: "e.g. ZHCET AMU AUV Team (First Place), IIT Kanpur (Runner-up)" },
    { key: "reportLink", label: "Document Report Link (URL)" },
    { key: "imageBase64", label: "Cover Image", type: "file" },
    { key: "images", label: "Gallery Images (upload multiple)", type: "files" },
  ],
};

export const facultyConfig = {
  name: "faculty",
  label: "Faculty",
  titleKey: "name",
  subtitleKey: "role",
  imageKey: "imageBase64",
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "role", label: "Role", required: true, placeholder: "Faculty Advisor / Faculty Councilor" },
    { key: "dept", label: "Department" },
    { key: "img", label: "Image URL (or upload below)" },
    { key: "imageBase64", label: "Photo Upload", type: "file" },
    { key: "bio", label: "Quote / Bio", textarea: true },
    { key: "sort", label: "Sort order (number)", placeholder: "1" },
  ],
};

export const projectsConfig = {
  name: "projects",
  label: "Project",
  titleKey: "title",
  subtitleKey: "category",
  imageKey: "imageBase64",
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "category", label: "Category Tag", placeholder: "e.g. Autonomous Perceptions" },
    { key: "year", label: "Year", placeholder: "e.g. 2023" },
    { key: "desc", label: "Description", textarea: true },
    { key: "imageBase64", label: "Cover Image", type: "file" },
    { key: "video", label: "Video URL", placeholder: "https://.../demo.mp4" },
    { key: "tech", label: "Tech Stack (comma separated)", placeholder: "ROS 2, C++, OpenCV" },
    { key: "features", label: "Core Features / Specifications (one per line)", textarea: true },
    { key: "team", label: "Credits / Team (comma separated names)", textarea: true, placeholder: "e.g. Mohd Rayyan Khan, Harsh Awasthi, Tanishka Bhardwaj" },
    { key: "gallery", label: "Gallery Images (upload multiple)", type: "files" },
  ],
};

export const vehiclesConfig = {
  name: "vehicles",
  label: "Vehicle",
  titleKey: "name",
  subtitleKey: "tagline",
  imageKey: "imageBase64",
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "tagline", label: "Tagline" },
    { key: "imageBase64", label: "Vehicle Image", type: "file" },
    { key: "videoUrl", label: "Animation Video URL (optional — shown instead of the image if set)" },
    { key: "thrusters", label: "Thrusters" },
    { key: "dof", label: "Degrees of Freedom" },
    { key: "depth", label: "Max Depth" },
    { key: "speed", label: "Speed" },
    { key: "endurance", label: "Endurance" },
    { key: "weight", label: "Weight" },
    { key: "mech", label: "Mechanical", textarea: true },
    { key: "elec", label: "Electrical", textarea: true },
    { key: "soft", label: "Software", textarea: true },
  ],
};

export const announcementsConfig = {
  name: "announcements",
  label: "Announcement",
  titleKey: "title",
  subtitleKey: "body",
  imageKey: null,
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "body", label: "Body", textarea: true, required: true },
  ],
};

export const advisoryConfig = {
  name: "advisory",
  label: "Advisory Board Member",
  titleKey: "name",
  subtitleKey: "role",
  imageKey: "imageBase64",
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "role", label: "Designation/Role (use the word 'Councilor' for the single Faculty Councilor entry — everyone else shows as a Faculty Advisor)", required: true },
    { key: "dept", label: "Department", required: false },
    { key: "imageBase64", label: "Member Image", type: "file" },
    { key: "text", label: "Quote / Text (only shown for the Councilor)", textarea: true, required: false },
  ],
};
