import GradeBookTable from "../component/GradeBookTable";

const GradeTab = ({ class_id, class_name }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-bold text-xl">Gradebook</h2>
          <div className="text-gray-500 text-sm">
            Click on quiz column headers to view detailed results and export
            data
          </div>
        </div>
      </div>
      <GradeBookTable classId={class_id} class_name={class_name} />
    </div>
  );
};

export default GradeTab;
