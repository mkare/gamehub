"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const Stats = () => {
  return (
    <div className="admin-dashboard-stats mt-3 order-1">
      <div className="card">
        <h3>Total Games</h3>
        <span>10</span>
        <hr />
        <h3>Total Lists</h3>
        <span>5</span>
      </div>
      <div className="card">
        <h3>Games</h3>
        <h3>Added Today</h3>
        <span>10</span>
        <hr />
        <p className="mt-1 h6">Found 2 duplicated games click below to fix</p>
        <button className="btn btn-sm btn-outline-warning">
          Fix Duplicates
        </button>
      </div>
      <div className="card">
        <h3>Lists</h3>
        <h3>Added Today</h3>
        <span>5</span>
        <hr />
        <h3>Last Months totals</h3>
        <span className="d-flex justify-content-between align-items-center gap-3">
          <h6 className="mt-2">Games</h6>
          <span>10</span>
        </span>
        <span className="d-flex justify-content-between align-items-center gap-3">
          <h6 className="mt-2">Lists</h6>
          <span>5</span>
        </span>
      </div>
    </div>
  );
};

const Settings = () => {
  const [deploymentStatus, setDeploymentStatus] = useState<string>("Idle");
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Deployment durumu sorgulama fonksiyonu
  const checkDeploymentStatus = async (deploymentId: string) => {
    try {
      const res = await fetch(
        `https://api.vercel.com/v13/deployments/${deploymentId}`,
        {
          headers: {
            Authorization: `Bearer aYdleKIuBtfIS4R2qAuSoQrN`,
          },
        }
      );
      const data = await res.json();
      setDeploymentStatus(data.state); // `INITIALIZING`, `BUILDING`, `READY`, `ERROR`
    } catch (error) {
      console.error("Error fetching deployment status:", error);
    }
  };

  // Deploy tetikleme ve durumu sorgulama
  const triggerDeployment = async () => {
    setIsDeploying(true);
    setDeploymentStatus("Deploying...");

    try {
      // Vercel Deploy Hook'u tetikleme
      const res = await fetch(
        "https://api.vercel.com/v1/integrations/deploy/prj_GOAcHGXBfG0yLFOHH5yOhUqXvzrU/fpnD3N3ye5",
        { method: "POST" }
      );

      const data = await res.json();

      if (data.job) {
        // Dağıtım ID'sini aldıktan sonra durumu düzenli olarak sorgula
        const deploymentId = data.job.id;
        const interval = setInterval(async () => {
          await checkDeploymentStatus(deploymentId);
          if (deploymentStatus === "READY" || deploymentStatus === "ERROR") {
            clearInterval(interval);
            setIsDeploying(false);
            toast.success("Deployment successful");
          } else {
            setIsDeploying(false);
            toast.error("Deployment failed");
            clearInterval(interval);
          }
        }, 5000); // 5 saniyede bir durumu sorgula
      }
    } catch (error) {
      console.error("Error triggering deployment:", error);
      setIsDeploying(false);
    }
  };

  return (
    <div className="admin-dashboard-settings">
      <Image src="/icons/settings.svg" alt="Settings" width={50} height={50} />
      <div className="links">
        <a href="/admin/settings">
          <span>Settings</span>
        </a>
        <a href="/" target="_blank">
          <span>Display website</span>
        </a>
        <a
          role="button"
          onClick={triggerDeployment}
          className={isDeploying ? "disabled" : ""}
        >
          {isDeploying ? "Deploying..." : "Re-Deploy Site"}
        </a>
        <a href="/admin/logout">
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

const StatsAndSettings = () => {
  return (
    <div className="d-flex gap-0 gap-md-4 flex-column flex-md-row align-items-center align-items-md-start justify-content-center">
      <Stats />
      <Settings />
    </div>
  );
};

export default StatsAndSettings;
