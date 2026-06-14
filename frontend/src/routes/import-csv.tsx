import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { UploadCloud, FileSearch, AlertTriangle, CheckCircle2, Download, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadCSV } from "@/lib/api";

export const Route = createFileRoute("/import-csv")({
  head: () => ({ meta: [{ title: "Import CSV — SplitWell" }, { name: "description", content: "Bring in messy CSV expense data with anomaly detection." }] }),
  component: ImportCsvPage,
});

const steps = [
  { label: "Upload", icon: UploadCloud },
  { label: "Analyze", icon: FileSearch },
  { label: "Detect Anomalies", icon: AlertTriangle },
  { label: "Review", icon: CheckCircle2 },
  { label: "Import", icon: Download },
];

function ImportCsvPage() {
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [report, setReport] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = uploading ? 1 : uploaded ? 3 : 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setUploaded(false);
    setReport(null);

    try {
      const data = await uploadCSV(file);
      setReport(data);
      setUploaded(true);
    } catch (err) {
      console.error(err);
      alert("Failed to upload and validate CSV file.");
    } finally {
      setUploading(false);
    }
  };

  const handleBoxClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <header>
        <h1 className="text-3xl font-extrabold">Import CSV</h1>
        <p className="text-sm text-muted-foreground">Upload your expenses CSV file to run anomaly detection.</p>
      </header>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      <section
        onClick={handleBoxClick}
        className={`card-soft card-soft-hover flex flex-col items-center gap-4 border-2 border-dashed border-primary/30 bg-primary/5 p-10 text-center md:p-16 cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground">
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <UploadCloud className="h-7 w-7" />
          )}
        </div>
        <div>
          <div className="text-lg font-bold">
            {uploading ? "Processing..." : uploaded ? `${fileName} uploaded` : "Choose or drag a CSV file here"}
          </div>
          <div className="text-sm text-muted-foreground">
            {uploading
              ? "Running server-side validations and anomaly checks..."
              : uploaded && report
              ? `Validation complete · ${report.rows} rows · ${report.anomaly_count} anomalies found`
              : "Click to browse files (CSV format expected)"}
          </div>
        </div>
        {!uploaded && !uploading && <Button className="rounded-2xl">Choose File</Button>}
        {uploaded && (
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
            <Check className="h-4 w-4" /> Validation Passed
          </div>
        )}
      </section>

      <section className="card-soft p-6 md:p-8">
        <h2 className="mb-5 text-lg font-bold">Workflow</h2>
        <div className="flex flex-wrap items-center gap-2 md:gap-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < current;
            const active = i === current;
            return (
              <div key={s.label} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl transition ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 hidden h-0.5 w-12 md:block ${done ? "bg-success" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {uploaded && report && (
        <section className="card-soft p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Detected Anomalies ({report.anomaly_count})</h2>
            <Button className="rounded-2xl" onClick={() => alert("Report review and import complete!")}>Approve &amp; Import</Button>
          </div>
          {report.anomaly_count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Anomaly Type</th>
                    <th className="px-4 py-3 font-medium">Count</th>
                    <th className="px-4 py-3 font-medium">Suggested Action</th>
                  </tr>
                </thead>
                <tbody>
                  {report.anomalies.map((a: any, idx: number) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold capitalize">{a.type.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">{a.count || 1}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
                          {a.action || "Flagged for review"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No anomalies detected. Everything looks perfect!
            </div>
          )}
        </section>
      )}
    </div>
  );
}