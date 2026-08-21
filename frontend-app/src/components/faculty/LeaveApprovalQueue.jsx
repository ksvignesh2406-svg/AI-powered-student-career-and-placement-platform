import { FileText } from "lucide-react";

function LeaveApprovalQueue({ requests, onApprove, onReject }) {
  return (
    <section className="faculty-v2-panel faculty-v2-leave-queue">
      <div className="faculty-v2-panel-heading">
        <h2><FileText size={20} /> Leave Approval Queue</h2>
      </div>

      <div className="faculty-v2-leave-list">
        {requests.length === 0 ? (
          <p className="faculty-v2-empty">No pending requests.</p>
        ) : requests.map((request) => (
          <article className="faculty-v2-leave-item" key={request.id}>
            <div className="faculty-v2-leave-title">
              <strong>{request.studentName} ({request.course})</strong>
              <span>{request.type}</span>
            </div>
            <p>{request.details}</p>
            {request.status === "approved" ? (
              <div className="faculty-v2-approved">Approved</div>
            ) : (
              <div className="faculty-v2-leave-actions">
                <button type="button" onClick={() => onApprove(request.id)}>Approve</button>
                <button type="button" onClick={() => onReject(request.id)}>Reject</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default LeaveApprovalQueue;