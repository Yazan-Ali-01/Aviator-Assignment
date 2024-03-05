import Table from '../Table';

const CurrentRoundTable = ({ bets }) => (
  <Table title="Current Round" headers={["Name", "Guess", "Points"]} data={bets} />
);

export default CurrentRoundTable;
