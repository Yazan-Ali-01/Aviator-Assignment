import Table from '../Table'; // Assuming you have this component

const RankingTable = ({ players }) => (
  <Table title="Ranking" headers={["No.", "Name", "Score"]} data={players} />
);

export default RankingTable;