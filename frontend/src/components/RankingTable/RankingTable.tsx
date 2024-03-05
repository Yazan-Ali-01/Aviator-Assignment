import Table from '../Table'; // Assuming you have this component

const RankingTable = ({ rankings }) => {

  console.log(rankings);
  return (
    <Table title="Ranking" headers={["No.", "Player Name", "Score"]} data={rankings} />
  )
}

export default RankingTable;