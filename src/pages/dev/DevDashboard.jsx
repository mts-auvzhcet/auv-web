import { useState } from "react";
import {
  Users,
  Calendar,
  FolderKanban,
  FileSpreadsheet,
  Database,
  Truck,
} from "lucide-react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import MembersManager from "../../components/dashboard/MembersManager";
import CollectionManager from "../../components/dashboard/CollectionManager";
import FormsManager from "../../components/dashboard/FormsManager";
import RecruitmentsManager from "../../components/dashboard/RecruitmentsManager";
import DbSeeder from "../../components/dashboard/DbSeeder";
import {
  eventsConfig,
  projectsConfig,
  advisoryConfig,
  facultyConfig,
  vehiclesConfig,
} from "../../components/dashboard/configs";

const TABS = [
  { id: "members", label: "Members", icon: <Users size={14} /> },
  { id: "events", label: "Events", icon: <Calendar size={14} /> },
  { id: "projects", label: "Projects", icon: <FolderKanban size={14} /> },
  { id: "vehicles", label: "Vehicles", icon: <Truck size={14} /> },
  { id: "forms", label: "Forms", icon: <FileSpreadsheet size={14} /> },
  { id: "recruitments", label: "Recruitments", icon: <FileSpreadsheet size={14} /> },
  { id: "faculty", label: "Faculty", icon: <Users size={14} /> },
  { id: "advisory", label: "Wisdom Quotes", icon: <Users size={14} /> },
  { id: "seed", label: "Seed DB", icon: <Database size={14} /> },
];

export default function DevDashboard() {
  const [tab, setTab] = useState("members");

  return (
    <DashboardShell
      title="Developer Console"
      subtitle="System Administration"
      tabs={TABS}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "members" && <MembersManager />}
      {tab === "events" && <CollectionManager config={eventsConfig} />}
      {tab === "projects" && <CollectionManager config={projectsConfig} />}
      {tab === "vehicles" && <CollectionManager config={vehiclesConfig} />}
      {tab === "forms" && <FormsManager />}
      {tab === "recruitments" && <RecruitmentsManager />}
      {tab === "faculty" && <CollectionManager config={facultyConfig} />}
      {tab === "advisory" && <CollectionManager config={advisoryConfig} />}
      {tab === "seed" && <DbSeeder />}
    </DashboardShell>
  );
}
