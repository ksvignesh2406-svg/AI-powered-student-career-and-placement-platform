import { motion } from "framer-motion";
import { Users, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import AttendanceTrendChart from "./AttendanceTrendChart";

export default function PulseWidgets({ itemVariants }) {
  return (
    <div className="adm-widgets-row">
      {/* Widget 1: Total Students */}
      <motion.div variants={itemVariants} className="adm-widget-card">
        <div className="adm-widget-top">
          <div>
            <div className="adm-widget-label">Total Students on Campus</div>
            <div className="adm-widget-value">
              8,432 <span>/ 9,000</span>
            </div>
          </div>
          <div className="adm-widget-icon emerald">
            <Users size={22} />
          </div>
        </div>
        <div className="adm-widget-footer emerald">
          <TrendingUp size={15} />
          <span>+124 since yesterday</span>
        </div>
      </motion.div>

      {/* Widget 2: Active Incidents */}
      <motion.div variants={itemVariants} className="adm-widget-card">
        <div className="adm-widget-top">
          <div>
            <div className="adm-widget-label">Active Incidents</div>
            <div className="adm-widget-value amber">3 Active</div>
          </div>
          <div className="adm-widget-icon amber">
            <AlertTriangle size={22} />
          </div>
        </div>
        <div className="adm-widget-footer amber">
          <span>Requires attention in triage</span>
        </div>
      </motion.div>

      {/* Widget 3: Overall Attendance Trend */}
      <motion.div variants={itemVariants} className="adm-widget-card">
        <div className="adm-widget-top">
          <div>
            <div className="adm-widget-label">Overall Attendance Trend</div>
            <div className="adm-widget-value">89%</div>
          </div>
          <div className="adm-widget-icon blue">
            <Calendar size={22} />
          </div>
        </div>
        <div style={{ height: "48px", marginTop: "8px" }}>
          <AttendanceTrendChart />
        </div>
      </motion.div>
    </div>
  );
}
